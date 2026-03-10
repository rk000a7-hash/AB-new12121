from flask import Blueprint, request, jsonify
from backend.utils.db import db
from backend.utils.email_sender import send_email
import random
import datetime
import jwt
from config import Config

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/request-otp', methods=['POST'])
def request_otp():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
        
    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    
    # Store OTP in DB with expiration (5 mins)
    expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=5)
    db.otps.update_one(
        {'email': email},
        {'$set': {'otp': otp, 'expiry': expiry}},
        upsert=True
    )
    
    # Send email
    success = send_otp_email(email, otp)
    if success:
        return jsonify({'message': 'OTP sent successfully'}), 200
    else:
        return jsonify({'error': 'Failed to send OTP email'}), 500

@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get('email')
    otp = data.get('otp')
    
    if not email or not otp:
        return jsonify({'error': 'Email and OTP are required'}), 400
        
    otp_record = db.otps.find_one({'email': email})
    
    if not otp_record or otp_record['otp'] != str(otp):
        return jsonify({'error': 'Invalid OTP'}), 401
        
    if otp_record['expiry'] < datetime.datetime.utcnow():
        return jsonify({'error': 'OTP expired'}), 401
        
    # Valid OTP - delete from db
    db.otps.delete_one({'email': email})
    
    # Find or create user
    user = db.users.find_one({'email': email})
    if not user:
        user_id = db.users.insert_one({
            'email': email,
            'created_at': datetime.datetime.utcnow()
        }).inserted_id
    else:
        user_id = user['_id']
        
    # Generate JWT
    token = jwt.encode({
        'user_id': str(user_id),
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, Config.SECRET_KEY, algorithm='HS256')
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'email': email
    }), 200
