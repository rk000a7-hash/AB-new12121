from flask import Flask
from flask_cors import CORS
from backend.config import Config

# Import route blueprints
from backend.routes.auth_routes import auth_bp
from backend.routes.product_routes import product_bp
from backend.routes.cart_routes import cart_bp
# Create Flask app
app = Flask(__name__)

# Load configuration
app.config.from_object(Config)

# Enable CORS for frontend
CORS(app)

# Home route (to check server is running)
@app.route("/")
def home():
    return "Backend is running successfully 🚀"

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(product_bp, url_prefix="/api/products")
app.register_blueprint(cart_bp, url_prefix="/api/cart")

# Run server
if __name__ == "__main__":
    app.run(debug=True, port=5000)
