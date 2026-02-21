import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch(`${apiUrl}/api/products/featured`),
                    fetch(`${apiUrl}/api/categories`)
                ]);

                if (productsRes.ok) {
                    const productsData = await productsRes.json();
                    setFeaturedProducts(productsData);
                }

                if (categoriesRes.ok) {
                    const categoriesData = await categoriesRes.json();
                    setCategories(categoriesData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <main>
            {/* Hero Section */}
            <section className="hero">
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3xl)', flexWrap: 'wrap' }}>
                    <div className="hero-content slide-up" style={{ flex: '1 1 400px', textAlign: 'left', margin: 0 }}>
                        <div style={{ display: 'inline-block', padding: 'var(--spacing-xs) var(--spacing-sm)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-full)', color: 'var(--color-accent)', fontWeight: 'bold', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-md)' }}>
                            ✨ New Collection Live
                        </div>
                        <h1 className="hero-title" style={{ fontSize: '3.5rem', fontWeight: '900' }}>
                            Discover Top <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Premium Goods</span> Today
                        </h1>
                        <p className="hero-subtitle" style={{ marginLeft: 0, fontSize: '1.1rem' }}>
                            Shop from thousands of products across multiple categories. Fast delivery, easy returns, and unbeatable quality.
                        </p>
                        <div className="hero-actions" style={{ justifyContent: 'flex-start', marginTop: 'var(--spacing-xl)' }}>
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Shop Now
                            </Link>
                            <Link to="/products?featured=true" className="btn btn-secondary btn-lg">
                                View Featured
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image slide-up" style={{ flex: '1 1 400px' }}>
                        <div style={{
                            width: '100%',
                            aspectRatio: '4/3',
                            background: 'var(--gradient-card)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid var(--color-border-light)',
                            borderRadius: '3rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25)',
                            position: 'relative',
                            overflow: 'hidden',
                            transform: 'rotate(2deg)'
                        }}>
                            <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-primary)', opacity: 0.1 }}></div>
                            <h2 style={{ fontSize: '4rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '900', zIndex: 1, textShadow: '0 10px 30px rgba(244, 63, 94, 0.3)' }}>ShopSmart</h2>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section" style={{ padding: 'var(--spacing-xl) 0 0 0' }}>
                <div className="container">
                    <div className="section-header" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <h2 className="section-title" style={{ fontSize: '1.5rem', margin: 0 }}>Shop by Category</h2>
                        <Link to="/products" className="btn btn-ghost" style={{ fontSize: '0.875rem' }}>
                            View All
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px' }}>
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {categories.slice(0, 6).map(category => (
                            <Link
                                key={category._id}
                                to={`/products?category=${category._id}`}
                                style={{ flex: '0 0 auto', width: '120px', textAlign: 'center' }}
                            >
                                <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--color-bg-tertiary)', overflow: 'hidden', marginBottom: '8px', border: '1px solid var(--color-border)' }}>
                                    <img src={category.image} alt={category.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="section" style={{ padding: 'var(--spacing-2xl) 0' }}>
                <div className="container">
                    <div className="section-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <h2 className="section-title" style={{ fontSize: '1.5rem', margin: 0 }}>Trending Now</h2>
                        <Link to="/products?featured=true" className="btn btn-ghost" style={{ fontSize: '0.875rem' }}>
                            View Collection
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px' }}>
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                        {featuredProducts.slice(0, 8).map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    {featuredProducts.length === 0 && (
                        <div className="empty-state" style={{ padding: '40px', textAlign: 'center', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-xl)' }}>
                            <div className="empty-state-icon" style={{ fontSize: '3rem', marginBottom: '16px' }}>🛍️</div>
                            <h3 className="empty-state-title" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Trending Products</h3>
                            <p className="empty-state-text" style={{ color: 'var(--color-text-secondary)' }}>
                                Check back later for curated collections.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Promotional Banner */}
            <section style={{ margin: 'var(--spacing-2xl) 0' }}>
                <div className="container">
                    <div style={{ background: 'var(--color-text-primary)', color: 'white', borderRadius: 'var(--radius-2xl)', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
                        <div>
                            <span style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>Limited Time</span>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0', color: 'white' }}>Get 20% Off Your First Order</h2>
                            <p style={{ color: '#A1A1AA', fontSize: '1.1rem', maxWidth: '400px' }}>Sign up today and use code WELCOME20 at checkout.</p>
                        </div>
                        <Link to="/register" className="btn btn-primary btn-lg" style={{ background: 'white', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-full)' }}>
                            Join ShopSmart
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
