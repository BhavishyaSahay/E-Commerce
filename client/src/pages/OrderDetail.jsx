import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const OrderDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const orderPlaced = location.state?.orderPlaced;

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/orders/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                }
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            'Pending': 'badge-warning',
            'Processing': 'badge-primary',
            'Shipped': 'badge-primary',
            'Delivered': 'badge-success',
            'Cancelled': 'badge-error'
        };
        return badges[status] || 'badge-primary';
    };

    if (loading) {
        return <Loader />;
    }

    if (!order) {
        return (
            <div className="container section">
                <div className="empty-state">
                    <div className="empty-state-icon">❌</div>
                    <h3 className="empty-state-title">Order Not Found</h3>
                    <p className="empty-state-text">The order you're looking for doesn't exist.</p>
                    <Link to="/orders" className="btn btn-primary">
                        View All Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="container section">
            {orderPlaced && (
                <div className="alert alert-success" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Order placed successfully! Thank you for shopping with us.
                </div>
            )}

            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <div>
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>
                        Order #{order._id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="text-secondary">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <span className={`badge ${getStatusBadge(order.status)}`} style={{ fontSize: 'var(--font-size-base)', padding: 'var(--spacing-sm) var(--spacing-lg)' }}>
                    {order.status}
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-2xl)', alignItems: 'flex-start' }}>
                {/* Order Items */}
                <div>
                    <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
                        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Order Items</h3>

                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex gap-lg"
                                style={{
                                    padding: 'var(--spacing-md) 0',
                                    borderBottom: index < order.items.length - 1 ? '1px solid var(--color-border)' : 'none'
                                }}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{ width: 80, height: 80, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{item.name}</h4>
                                    <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                                        Quantity: {item.quantity} × {formatPrice(item.price)}
                                    </p>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
                                    {formatPrice(item.price * item.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="card" style={{ padding: 'var(--spacing-xl)', marginTop: 'var(--spacing-xl)' }}>
                        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Shipping Address</h3>
                        <p style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
                            {order.shippingAddress.fullName}<br />
                            {order.shippingAddress.address}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                            {order.shippingAddress.country}<br />
                            Phone: {order.shippingAddress.phone}
                        </p>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                    <h3 className="order-summary-title">Order Summary</h3>

                    <div className="order-summary-row">
                        <span>Items Total</span>
                        <span>{formatPrice(order.itemsPrice)}</span>
                    </div>

                    <div className="order-summary-row">
                        <span>Shipping</span>
                        <span>{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</span>
                    </div>

                    <div className="order-summary-row">
                        <span>Tax (GST)</span>
                        <span>{formatPrice(order.taxPrice)}</span>
                    </div>

                    <div className="order-summary-row total">
                        <span>Total</span>
                        <span>{formatPrice(order.totalAmount)}</span>
                    </div>

                    <div style={{ marginTop: 'var(--spacing-xl)', padding: 'var(--spacing-md)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-sm)' }}>
                            <strong>Payment Method:</strong>
                        </p>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            {order.paymentMethod === 'COD' && 'Cash on Delivery'}
                            {order.paymentMethod === 'Card' && 'Credit/Debit Card'}
                            {order.paymentMethod === 'UPI' && 'UPI Payment'}
                        </p>
                    </div>

                    <Link
                        to="/orders"
                        className="btn btn-secondary"
                        style={{ width: '100%', marginTop: 'var(--spacing-xl)' }}
                    >
                        ← Back to Orders
                    </Link>

                    <Link
                        to="/products"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default OrderDetail;
