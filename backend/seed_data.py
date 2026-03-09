from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/ecommerce_db")
client = MongoClient(uri)
db = client.get_default_database() if client.get_database().name else client['ecommerce_db']

products = [
    {
        "name": "Wireless Headphones",
        "description": "Premium noise-canceling wireless headphones",
        "price": 199.99,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        "stock": 50
    },
    {
        "name": "Smart Watch",
        "description": "Fitness tracking, heart rate monitor, waterproof",
        "price": 149.50,
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        "stock": 30
    },
    {
        "name": "Mechanical Keyboard",
        "description": "RGB backlit mechanical keyboard with blue switches",
        "price": 89.99,
        "image_url": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80",
        "stock": 20
    },
    {
        "name": "Gaming Mouse",
        "description": "16000 DPI optical sensor, customizable buttons",
        "price": 59.90,
        "image_url": "https://images.unsplash.com/photo-1527814050087-179fca6d395a?w=500&q=80",
        "stock": 100
    }
]

db.products.delete_many({})
db.products.insert_many(products)
print("Database seeded with sample products!")
