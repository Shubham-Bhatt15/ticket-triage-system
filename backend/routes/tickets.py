from fastapi import APIRouter
from bson import ObjectId
from database import tickets_collection
from models import TicketCreate
from services.ai_classifier import classify_ticket

router = APIRouter()

@router.post("/tickets")
async def create_ticket(ticket: TicketCreate):
    ai_result = classify_ticket(ticket.message)
    ticket_doc = ticket.model_dump()
    ticket_doc.update(ai_result)
    ticket_doc["status"] = "pending"
    result = await tickets_collection.insert_one(ticket_doc)
    ticket_doc["id"] = str(result.inserted_id)
    del ticket_doc["_id"]
    return ticket_doc

@router.get("/tickets")
async def get_tickets():
    tickets = []
    async for t in tickets_collection.find():
        t["id"] = str(t["_id"])
        del t["_id"]
        tickets.append(t)
    return tickets

@router.patch("/tickets/{ticket_id}")
async def update_status(ticket_id: str, status: str):
    await tickets_collection.update_one(
        {"_id": ObjectId(ticket_id)}, {"$set": {"status": status}}
    )
    return {"message": "updated"}