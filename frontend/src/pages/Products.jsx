import { useEffect, useState } from 'react';
import { getProducts, addToCart } from '../services/api';
import { ShoppingCart } from 'lucide-react';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await getProducts();
            setProducts(res.data);
        } catch (e) {
            console.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        setAddingId(product._id);
        try {
            await addToCart(product._id, 1);
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (e) {
            console.error('Failed to add to cart');
        } finally {
            setAddingId(null);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading products...</div>;
    }

    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1e293b' }}>Our Products</h1>

            {products.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', marginTop: '4rem' }}>
                    No products available. Please add some from the database.
                </div>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product._id} className="product-card">
                            <div className="product-img-container">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="product-img" />
                                ) : (
                                    <div style={{ color: '#94a3b8' }}>No Image</div>
                                )}
                            </div>
                            <div className="product-info">
                                <h3 className="product-title">{product.name}</h3>
                                <p style={{ color: '#64748b', marginBottom: '1rem', minHeight: '48px' }}>
                                    {product.description || 'No description available.'}
                                </p>
                                <div className="product-price">${product.price.toFixed(2)}</div>
                                <button
                                    className="btn-primary"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    onClick={() => handleAddToCart(product)}
                                    disabled={addingId === product._id}
                                >
                                    <ShoppingCart size={18} />
                                    {addingId === product._id ? 'Adding...' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
