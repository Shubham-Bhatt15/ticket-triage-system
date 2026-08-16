import os, json
from google import genai
from config import TICKET_CATEGORIES, PRIORITY_LEVELS
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def classify_ticket(message: str):
    prompt = f"""
    Classify this support ticket. Categories: {TICKET_CATEGORIES}.
    Priorities: {PRIORITY_LEVELS}.
    Return ONLY valid JSON with keys: category, priority, sentiment, suggested_reply.
    Do not include markdown code fences or any extra text — only the raw JSON object.

    Ticket: "{message}"
    """
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )
    raw_text = response.text.strip()

    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")
        raw_text = raw_text.replace("json\n", "", 1).strip()

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        return {
            "category": "General Inquiry",
            "priority": "Medium",
            "sentiment": "Neutral",
            "suggested_reply": "Thank you for reaching out, we'll get back to you shortly."
        }