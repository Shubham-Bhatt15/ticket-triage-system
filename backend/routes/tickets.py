from fastapi import APIRouter,HTTPException
from bson import ObjectId
from database import tickets_collection
from models import TicketCreate,TicketResponse
from services.ai_classifier import classify_ticket
from config import TICKET_STATUSES
router = APIRouter()

@router.post("/tickets",response_model=TicketResponse)
async def create_ticket(ticket: TicketCreate):
    try:
        ai_result = classify_ticket(ticket.message)
    except Exception as e:
        ai_result = {"category": "General Inquiry", "priority": "Low"}  # sensible fallback
        print(f"AI classification failed: {e}")
    ticket_doc = ticket.model_dump()
    ticket_doc.update(ai_result)
    ticket_doc["status"] = "pending"
    result = await tickets_collection.insert_one(ticket_doc)
    ticket_doc["id"] = str(result.inserted_id)
    del ticket_doc["_id"]
    return ticket_doc

@router.get("/tickets",response_model=list[TicketResponse])
async def get_tickets():
    tickets = []
    async for t in tickets_collection.find():
        t["id"] = str(t["_id"])
        del t["_id"]
        tickets.append(t)
    return tickets


@router.patch("/tickets/{ticket_id}")
async def update_status(ticket_id: str, status: str):
    if status not in TICKET_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    await tickets_collection.update_one(
        {"_id": ObjectId(ticket_id)}, {"$set": {"status": status}}
    )
    return {"message": "updated"}


@router.get("/tickets/{ticket_id}",response_model=TicketResponse)
async def get_ticket_by_id(ticket_id:str):
    ticket =  await tickets_collection.find_one({"_id":ObjectId(ticket_id)})
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    ticket["id"] = str(ticket["_id"])
    del ticket["_id"]
    return ticket
