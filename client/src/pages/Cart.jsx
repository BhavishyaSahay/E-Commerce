import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, loading } = useCart();
    const { isAuthenticated } = useAuth();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const subtotal = cart.items.reduce((total, item) => {
        const price = item.product?.price || item.price;
        return total + price * item.quantity;
    }, 0);

    const shipping = subtotal > 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    if (cart.items.length === 0) {
        return (
            <div className="container section">
                <div className="empty-state">
                    <div className="empty-state-icon">🛒</div>
                    <h3 className="empty-state-title">Your Cart is Empty</h3>
                    <p className="empty-state-text">
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link to="/products" className="btn btn-primary">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="container section">
            <h1 style={{ marginBottom: 'var(--spacing-2xl)' }}>Shopping Cart</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-2xl)', alignItems: 'flex-start' }}>
                {/* Cart Items */}
                <div>
                    {cart.items.map(item => {
                        const product = item.product || {};
                        const price = product.price || item.price;

                        return (
                            <div key={item._id} className="cart-item">
                                <img
                                    src={product.image || 'https://via.placeholder.com/120'}
                                    alt={product.name || 'Product'}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-details">
                                    <Link to={`/products/${product._id}`} className="cart-item-title">
                                        {product.name || 'Product'}
                                    </Link>
                                    <p className="cart-item-price">{formatPrice(price)}</p>

                                    <div className="flex justify-between items-center">
                                        <div className="quantity-control">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1 || loading}
                                            >
                                                −
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                disabled={loading}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            className="btn btn-ghost"
                                            onClick={() => removeFromCart(item._id)}
                                            disabled={loading}
                                            style={{ color: 'var(--color-error)' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
                                    {formatPrice(price * item.quantity)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                    <h3 className="order-summary-title">Order Summary</h3>

                    <div className="order-summary-row">
                        <span>Subtotal ({cart.items.length} items)</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>

                    <div className="order-summary-row">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                    </div>

                    <div className="order-summary-row">
                        <span>Tax (18% GST)</span>
                        <span>{formatPrice(tax)}</span>
                    </div>

                    <div className="order-summary-row total">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>

                    {subtotal < 500 && (
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-md)' }}>
                            Add ₹{500 - subtotal} more for free shipping!
                        </p>
                    )}

                    {isAuthenticated ? (
                        <Link
                            to="/checkout"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: 'var(--spacing-xl)' }}
                        >
                            Proceed to Checkout
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: 'var(--spacing-xl)' }}
                        >
                            Login to Checkout
                        </Link>
                    )}

                    <Link
                        to="/products"
                        className="btn btn-ghost"
                        style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Cart;
