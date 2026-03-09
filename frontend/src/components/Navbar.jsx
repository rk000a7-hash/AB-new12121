import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCart } from '../services/api';

export default function Navbar() {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);

    const fetchCartCount = async () => {
        try {
            const res = await getCart();
            setCartCount(res.data.items.reduce((acc, item) => acc + item.quantity, 0));
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchCartCount();
        window.addEventListener('cartUpdated', fetchCartCount);
        return () => window.removeEventListener('cartUpdated', fetchCartCount);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">Shopifyz</Link>

            <div className="nav-links">
                <Link to="/" className="nav-btn">
                    <Package size={20} /> Products
                </Link>
                <Link to="/cart" className="nav-btn" style={{ position: 'relative' }}>
                    <ShoppingCart size={20} /> Cart
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
                <button className="nav-btn" onClick={handleLogout}>
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </nav>
    );
}
