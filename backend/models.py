from pydantic import BaseModel,Field,EmailStr
from typing import Optional

class TicketCreate(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr  # validates the email
    subject: str = Field(..., min_length=3, max_length=200)
    message: str = Field(..., min_length=1, max_length=2000)

class TicketResponse(TicketCreate):
    id: str
    category: Optional[str] = None
    priority: Optional[str] = None
    sentiment: Optional[str] = None
    suggested_reply: Optional[str] = None
    status: str = "pending"