import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL || '';

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        postalCode: '',
        country: 'India',
        phone: '',
        paymentMethod: 'COD'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    shippingAddress: {
                        fullName: formData.fullName,
                        address: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode,
                        country: formData.country,
                        phone: formData.phone
                    },
                    paymentMethod: formData.paymentMethod
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to place order');
            }

            await clearCart();
            navigate(`/orders/${data._id}`, { state: { orderPlaced: true } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (cart.items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <main className="container section">
            <h1 style={{ marginBottom: 'var(--spacing-2xl)' }}>Checkout</h1>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-2xl)', alignItems: 'flex-start' }}>
                {/* Checkout Form */}
                <form onSubmit={handleSubmit}>
                    <div className="card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
                        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Shipping Address</h3>

                        <div className="form-group">
                            <label className="form-label" htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                className="form-input"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className="form-input"
                                placeholder="10-digit mobile number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="address">Street Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                className="form-input"
                                placeholder="House no, Building, Street"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    className="form-input"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="postalCode">Postal Code</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    className="form-input"
                                    placeholder="6-digit PIN"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="country">Country</label>
                            <select
                                id="country"
                                name="country"
                                className="form-input form-select"
                                value={formData.country}
                                onChange={handleChange}
                            >
                                <option value="India">India</option>
                            </select>
                        </div>
                    </div>

                    <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
                        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Payment Method</h3>

                        <div className="flex flex-col gap-md">
                            {['COD', 'Card', 'UPI'].map(method => (
                                <label
                                    key={method}
                                    className="flex items-center gap-md"
                                    style={{
                                        padding: 'var(--spacing-md)',
                                        background: formData.paymentMethod === method ? 'var(--color-bg-tertiary)' : 'transparent',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method}
                                        checked={formData.paymentMethod === method}
                                        onChange={handleChange}
                                    />
                                    <span>
                                        {method === 'COD' && 'Cash on Delivery'}
                                        {method === 'Card' && 'Credit/Debit Card'}
                                        {method === 'UPI' && 'UPI Payment'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </form>

                {/* Order Summary */}
                <div className="order-summary">
                    <h3 className="order-summary-title">Order Summary</h3>

                    {/* Items preview */}
                    <div style={{ marginBottom: 'var(--spacing-lg)', maxHeight: '200px', overflowY: 'auto' }}>
                        {cart.items.map(item => (
                            <div key={item._id} className="flex gap-md" style={{ marginBottom: 'var(--spacing-md)' }}>
                                <img
                                    src={item.product?.image || 'https://via.placeholder.com/50'}
                                    alt={item.product?.name}
                                    style={{ width: 50, height: 50, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)' }}>{item.product?.name}</p>
                                    <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                                        Qty: {item.quantity}
                                    </p>
                                </div>
                                <p style={{ fontWeight: 600 }}>
                                    {formatPrice((item.product?.price || item.price) * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="order-summary-row">
                        <span>Subtotal</span>
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

                    <button
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%', marginTop: 'var(--spacing-xl)' }}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Placing Order...' : `Place Order • ${formatPrice(total)}`}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Checkout;
