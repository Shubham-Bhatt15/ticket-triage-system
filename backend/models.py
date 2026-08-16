from pydantic import BaseModel
from typing import Optional

class TicketCreate(BaseModel):
    customer_name: str
    email: str
    subject: str
    message: str

class TicketResponse(TicketCreate):
    id: str
    category: Optional[str] = None
    priority: Optional[str] = None
    sentiment: Optional[str] = None
    suggested_reply: Optional[str] = None
    status: str = "pending"