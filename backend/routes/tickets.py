import asyncio
from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import tickets_collection
from models import TicketCreate, TicketResponse
from services.ai_classifier import classify_ticket
from config import TICKET_STATUSES, TICKET_CATEGORIES, PRIORITY_LEVELS

router = APIRouter()

DEFAULT_AI_RESULT = {
    "category": "General Inquiry",
    "priority": "Medium",
    "sentiment": "Neutral",
    "suggested_reply": None,
}


def parse_object_id(ticket_id: str) -> ObjectId:
    if not ObjectId.is_valid(ticket_id):
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ObjectId(ticket_id)


def serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


def sanitize_ai_result(result: dict) -> dict:
    clean = {**DEFAULT_AI_RESULT, **(result or {})}
    if clean["category"] not in TICKET_CATEGORIES:
        clean["category"] = DEFAULT_AI_RESULT["category"]
    if clean["priority"] not in PRIORITY_LEVELS:
        clean["priority"] = DEFAULT_AI_RESULT["priority"]
    return clean


@router.post("/tickets", response_model=TicketResponse)
async def create_ticket(ticket: TicketCreate):
    try:
        ai_result = await asyncio.to_thread(classify_ticket, ticket.message)
        ai_result = sanitize_ai_result(ai_result)
    except Exception as e:
        print(f"AI classification failed: {e}")
        ai_result = DEFAULT_AI_RESULT.copy()

    ticket_doc = ticket.model_dump()
    ticket_doc.update(ai_result)
    ticket_doc["status"] = "pending"
    result = await tickets_collection.insert_one(ticket_doc)
    ticket_doc["id"] = str(result.inserted_id)
    del ticket_doc["_id"]
    return ticket_doc


@router.get("/tickets", response_model=list[TicketResponse])
async def get_tickets():
    tickets = []
    async for t in tickets_collection.find().sort("_id", -1):
        tickets.append(serialize(t))
    return tickets


@router.patch("/tickets/{ticket_id}")
async def update_status(ticket_id: str, status: str):
    if status not in TICKET_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await tickets_collection.update_one(
        {"_id": parse_object_id(ticket_id)}, {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return {"message": "updated"}


@router.get("/tickets/{ticket_id}", response_model=TicketResponse)
async def get_ticket_by_id(ticket_id: str):
    ticket = await tickets_collection.find_one({"_id": parse_object_id(ticket_id)})
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return serialize(ticket)