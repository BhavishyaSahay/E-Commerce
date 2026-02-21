import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addToCart } = useCart();
    const apiUrl = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${apiUrl}/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    if (loading) {
        return <Loader />;
    }

    if (!product) {
        return (
            <div className="container section">
                <div className="empty-state">
                    <div className="empty-state-icon">❌</div>
                    <h3 className="empty-state-title">Product Not Found</h3>
                    <p className="empty-state-text">The product you're looking for doesn't exist.</p>
                    <Link to="/products" className="btn btn-primary">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    return (
        <main className="container">
            <div className="product-detail">
                {/* Product Gallery */}
                <div className="product-gallery">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-main-image"
                    />
                </div>

                {/* Product Info */}
                <div className="product-info">
                    {product.category && (
                        <Link
                            to={`/products?category=${product.category._id}`}
                            className="badge badge-primary"
                            style={{ marginBottom: 'var(--spacing-md)', display: 'inline-block' }}
                        >
                            {product.category.name}
                        </Link>
                    )}

                    <h1>{product.name}</h1>

                    <div className="product-meta">
                        <div className="product-rating">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            {product.rating?.toFixed(1) || '0.0'}
                            <span>({product.numReviews || 0} reviews)</span>
                        </div>

                        {product.stock > 0 ? (
                            <span className="badge badge-success">In Stock</span>
                        ) : (
                            <span className="badge badge-error">Out of Stock</span>
                        )}
                    </div>

                    <div className="product-price" style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-xl)' }}>
                        <span className="current">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                            <>
                                <span className="original">{formatPrice(product.originalPrice)}</span>
                                <span className="badge badge-warning">{discount}% OFF</span>
                            </>
                        )}
                    </div>

                    <p className="product-description">{product.description}</p>

                    {/* Quantity Selector */}
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <label className="form-label">Quantity</label>
                        <div className="quantity-control">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                            >
                                −
                            </button>
                            <span>{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                disabled={quantity >= product.stock}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="product-actions">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            style={{ flex: 1 }}
                        >
                            {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                        </button>
                        <Link to="/cart" className="btn btn-secondary btn-lg">
                            View Cart
                        </Link>
                    </div>

                    {/* Additional Info */}
                    <div style={{ marginTop: 'var(--spacing-2xl)', paddingTop: 'var(--spacing-xl)', borderTop: '1px solid var(--color-border)' }}>
                        <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Product Details</h4>
                        <ul style={{ color: 'var(--color-text-secondary)' }}>
                            <li>• Free shipping on orders over ₹500</li>
                            <li>• 30-day return policy</li>
                            <li>• Secure payment options</li>
                            <li>• {product.stock} items in stock</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetail;
