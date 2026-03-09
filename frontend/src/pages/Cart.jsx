import { useEffect, useState } from 'react';
import { getCart, updateCartQuantity, removeFromCart } from '../services/api';
import { Trash2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCartItems = async () => {
        try {
            const res = await getCart();
            setCartItems(res.data.items);
            setTotalPrice(res.data.total_price);
        } catch (err) {
            setError('Failed to load cart items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleUpdateQty = async (productId, currentQty, newQty) => {
        if (newQty < 1) return;
        try {
            await updateCartQuantity(productId, newQty);
            fetchCartItems();
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (e) {
            setError('Failed to update quantity');
        }
    };

    const handleRemove = async (productId) => {
        try {
            await removeFromCart(productId);
            fetchCartItems();
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (e) {
            setError('Failed to remove item');
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading cart...</div>;
    }

    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1e293b' }}>Your Cart</h1>

            {error && <div className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} /> {error}
            </div>}

            {cartItems.length === 0 ? (
                <div className="cart-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <p style={{ color: '#64748b', fontSize: '1.25rem', marginBottom: '2rem' }}>Your cart is empty.</p>
                    <Link to="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '0.75rem 2rem' }}>
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="cart-container">
                    {cartItems.map(item => (
                        <div key={item._id} className="cart-item">
                            <div className="cart-item-img">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                ) : (
                                    <div style={{ padding: '2rem', color: '#94a3b8', textAlign: 'center' }}>Img</div>
                                )}
                            </div>
                            <div className="cart-item-details">
                                <h3 className="cart-item-title">{item.name}</h3>
                                <div className="cart-item-price">${item.price.toFixed(2)} each</div>
                            </div>
                            <div className="cart-item-actions">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '0.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <button className="qty-btn" onClick={() => handleUpdateQty(item.product_id, item.quantity, item.quantity - 1)}>-</button>
                                    <span style={{ width: '2rem', textAlign: 'center', fontWeight: '500' }}>{item.quantity}</span>
                                    <button className="qty-btn" onClick={() => handleUpdateQty(item.product_id, item.quantity, item.quantity + 1)}>+</button>
                                </div>
                                <div style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>
                                    ${(item.item_total).toFixed(2)}
                                </div>
                                <button className="remove-btn" onClick={() => handleRemove(item.product_id)} title="Remove item">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="cart-summary">
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.25rem', color: '#64748b' }}>Total</span>
                            <span className="cart-total">${totalPrice.toFixed(2)}</span>
                        </div>
                        <button className="btn-primary" style={{ marginTop: '2rem', width: 'auto', padding: '1rem 3rem' }}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
