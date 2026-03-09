from flask import Blueprint, request, jsonify
from utils.db import db
from utils.decorators import token_required
from bson.objectid import ObjectId

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/', methods=['GET'])
@token_required
def get_cart(current_user):
    cart_items = list(db.cart.find({'user_email': current_user['email']}))
    
    total_price = 0
    detailed_cart = []
    
    for item in cart_items:
        try:
            product = db.products.find_one({'_id': ObjectId(item['product_id'])})
            if product:
                item_total = product['price'] * item['quantity']
                total_price += item_total
                detailed_cart.append({
                    '_id': str(item['_id']),
                    'product_id': str(product['_id']),
                    'name': product['name'],
                    'price': product['price'],
                    'image_url': product.get('image_url', ''),
                    'quantity': item['quantity'],
                    'item_total': item_total
                })
        except Exception:
            continue
            
    return jsonify({
        'items': detailed_cart,
        'total_price': total_price
    }), 200

@cart_bp.route('/add', methods=['POST'])
@token_required
def add_to_cart(current_user):
    data = request.json
    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 1))
    
    if not product_id:
        return jsonify({'error': 'Product ID is required'}), 400
        
    try:
        product = db.products.find_one({'_id': ObjectId(product_id)})
        if not product:
            return jsonify({'error': 'Product not found'}), 404
    except:
        return jsonify({'error': 'Invalid Product ID'}), 400
        
    existing_item = db.cart.find_one({
        'user_email': current_user['email'],
        'product_id': product_id
    })
    
    if existing_item:
        db.cart.update_one(
            {'_id': existing_item['_id']},
            {'$inc': {'quantity': quantity}}
        )
    else:
        db.cart.insert_one({
            'user_email': current_user['email'],
            'product_id': product_id,
            'quantity': quantity
        })
        
    return jsonify({'message': 'Added to cart'}), 200

@cart_bp.route('/update', methods=['PUT'])
@token_required
def update_cart_quantity(current_user):
    data = request.json
    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 0))
    
    if not product_id or quantity is None:
        return jsonify({'error': 'Product ID and quantity required'}), 400
        
    if quantity <= 0:
        db.cart.delete_one({
            'user_email': current_user['email'],
            'product_id': product_id
        })
        return jsonify({'message': 'Removed from cart'}), 200
        
    db.cart.update_one(
        {'user_email': current_user['email'], 'product_id': product_id},
        {'$set': {'quantity': quantity}}
    )
    
    return jsonify({'message': 'Cart updated'}), 200

@cart_bp.route('/remove', methods=['DELETE'])
@token_required
def remove_from_cart(current_user):
    product_id = request.args.get('product_id')
    
    if not product_id:
        if request.is_json:
            product_id = request.json.get('product_id')
            
    if not product_id:
        return jsonify({'error': 'Product ID required'}), 400
        
    db.cart.delete_one({
        'user_email': current_user['email'],
        'product_id': product_id
    })
    
    return jsonify({'message': 'Removed from cart'}), 200
