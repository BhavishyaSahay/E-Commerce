import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/orders`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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
            day: 'numeric'
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

    return (
        <main className="container section">
            <h1 style={{ marginBottom: 'var(--spacing-2xl)' }}>My Orders</h1>

            {orders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📦</div>
                    <h3 className="empty-state-title">No Orders Yet</h3>
                    <p className="empty-state-text">
                        You haven't placed any orders yet. Start shopping to see your orders here.
                    </p>
                    <Link to="/products" className="btn btn-primary">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div>
                    {orders.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                                    <span className="order-date" style={{ marginLeft: 'var(--spacing-md)' }}>
                                        {formatDate(order.createdAt)}
                                    </span>
                                </div>
                                <span className={`badge ${getStatusBadge(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="order-items">
                                {order.items.slice(0, 4).map((item, index) => (
                                    <img
                                        key={index}
                                        src={item.image}
                                        alt={item.name}
                                        className="order-item-thumb"
                                    />
                                ))}
                                {order.items.length > 4 && (
                                    <div
                                        className="order-item-thumb flex items-center justify-center"
                                        style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}
                                    >
                                        +{order.items.length - 4}
                                    </div>
                                )}
                            </div>

                            <div className="order-footer">
                                <span className="order-total">{formatPrice(order.totalAmount)}</span>
                                <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default Orders;
