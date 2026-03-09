import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/ecommerce_db")
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key")
    GMAIL_SENDER = os.getenv("GMAIL_SENDER", "")
    GMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD", "")
