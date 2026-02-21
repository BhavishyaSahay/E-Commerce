import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    return (
        <div className="card product-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', border: 'none', background: 'white' }}>
            {discount > 0 && (
                <span className="badge badge-primary" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, background: 'var(--color-secondary)' }}>-{discount}%</span>
            )}

            <Link to={`/products/${product._id}`} style={{ position: 'relative', display: 'block', padding: '10px' }}>
                <div style={{ paddingBottom: '100%', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)', background: '#F8F9FA' }}>
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                    />
                </div>
                {/* Quick Add Overlay */}
                <button
                    className="quick-add-btn"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(e); }}
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--color-text-primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 20
                    }}
                    title="Add to Cart"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </Link>

            <Link to={`/products/${product._id}`} className="card-body" style={{ flexGrow: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="card-title" style={{ fontSize: '1rem', fontWeight: '600', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.name}
                    </h3>
                </div>

                <div className="product-rating" style={{ fontSize: '0.75rem', gap: '4px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-warning)" stroke="var(--color-warning)" strokeWidth="1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span style={{ fontWeight: '600', color: 'var(--color-text-primary)', marginLeft: '2px' }}>{product.rating?.toFixed(1) || '0.0'}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>({product.numReviews || 0})</span>
                </div>

                <div className="product-price" style={{ marginTop: 'auto', gap: '8px' }}>
                    <span className="current" style={{ fontSize: '1.25rem', background: 'none', WebkitTextFillColor: 'initial', color: 'var(--color-text-primary)' }}>{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                        <span className="original">{formatPrice(product.originalPrice)}</span>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
