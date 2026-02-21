import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar" style={{ borderBottom: '1px solid var(--color-border-light)', padding: 'var(--spacing-md) 0' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                {/* Left: Mobile Toggle & Desktop Search (Placeholder) */}
                <div className="navbar-left" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <button
                        className="navbar-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                        style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                        <span style={{ width: '20px', height: '2px', background: 'var(--color-text-primary)' }}></span>
                        <span style={{ width: '20px', height: '2px', background: 'var(--color-text-primary)' }}></span>
                        <span style={{ width: '20px', height: '2px', background: 'var(--color-text-primary)' }}></span>
                    </button>
                    <div className="desktop-only" style={{ position: 'relative', width: '200px' }}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="form-input"
                            style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', background: 'var(--color-bg-tertiary)', border: 'none', fontSize: 'var(--font-size-sm)', width: '100%' }}
                        />
                    </div>
                </div>

                {/* Center: Brand */}
                <div className="navbar-center" style={{ textAlign: 'center' }}>
                    <Link to="/" className="navbar-brand" style={{ fontSize: '1.75rem', letterSpacing: '-0.5px' }}>
                        ShopSmart<span style={{ color: 'var(--color-accent)' }}>.</span>
                    </Link>
                </div>

                {/* Right: Actions */}
                <div className="navbar-right" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
                    <div className={`navbar-nav ${isMenuOpen ? 'open' : ''}`} style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                        <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                            Home
                        </Link>
                        <Link to="/products" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                            Shop
                        </Link>
                        {isAuthenticated && (
                            <Link to="/orders" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                                Orders
                            </Link>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', borderLeft: '1px solid var(--color-border)', paddingLeft: 'var(--spacing-md)' }}>
                        {isAuthenticated ? (
                            <div className="flex flex-col items-end">
                                <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    {user.name?.split(' ')[0]}
                                </span>
                                <button onClick={handleLogout} className="text-muted" style={{ fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.875rem' }}>
                                Sign In
                            </Link>
                        )}

                        <Link to="/cart" className="btn btn-ghost btn-icon cart-icon" style={{ position: 'relative' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            {cartCount > 0 && <span className="cart-count" style={{ background: 'var(--color-secondary)' }}>{cartCount}</span>}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
