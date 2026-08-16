import os, json
from anthropic import Anthropic
from config import TICKET_CATEGORIES, PRIORITY_LEVELS

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def classify_ticket(message: str):
    prompt = f"""
    Classify this support ticket. Categories: {TICKET_CATEGORIES}. 
    Priorities: {PRIORITY_LEVELS}.
    Return ONLY valid JSON with keys: category, priority, sentiment, suggested_reply.

    Ticket: "{message}"
    """
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )
    raw_text = response.content[0].text
    return json.loads(raw_text)