from flask import Blueprint, request, jsonify
from backend.utils.db import db
from bson.objectid import ObjectId

product_bp = Blueprint('products', __name__)

@product_bp.route('/', methods=['GET'])
def get_products():
    products = list(db.products.find())
    for product in products:
        product['_id'] = str(product['_id'])
    return jsonify(products), 200

@product_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = db.products.find_one({'_id': ObjectId(product_id)})
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        product['_id'] = str(product['_id'])
        return jsonify(product), 200
    except Exception:
        return jsonify({'error': 'Invalid product ID'}), 400

@product_bp.route('/', methods=['POST'])
def add_product():
    # Typically this would be admin protected
    data = request.json
    name = data.get('name')
    description = data.get('description', '')
    price = data.get('price')
    image_url = data.get('image_url', '')
    stock = data.get('stock', 0)
    
    if not name or price is None:
        return jsonify({'error': 'Name and price are required'}), 400
        
    product = {
        'name': name,
        'description': description,
        'price': float(price),
        'image_url': image_url,
        'stock': int(stock)
    }
    
    inserted_id = db.products.insert_one(product).inserted_id
    
    return jsonify({'message': 'Product added', 'product_id': str(inserted_id)}), 201
