import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
print("Using Mongo URI:", MONGO_URI)

client = AsyncIOMotorClient(MONGO_URI)

db = client.ticket_triage
tickets_collection = db.tickets