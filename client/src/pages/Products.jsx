import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    const apiUrl = import.meta.env.VITE_API_URL || '';

    const currentCategory = searchParams.get('category') || '';
    const currentSort = searchParams.get('sort') || 'newest';
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/categories`);
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    page: currentPage,
                    limit: 12,
                    sort: currentSort
                });

                if (currentCategory) params.append('category', currentCategory);
                if (searchQuery) params.append('search', searchQuery);
                if (searchParams.get('featured')) params.append('featured', 'true');

                const res = await fetch(`${apiUrl}/api/products?${params}`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.products);
                    setPagination({ page: data.page, pages: data.pages, total: data.total });
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentCategory, currentSort, currentPage, searchQuery, searchParams]);

    const handleCategoryChange = (categoryId) => {
        const params = new URLSearchParams(searchParams);
        if (categoryId) {
            params.set('category', categoryId);
        } else {
            params.delete('category');
        }
        params.set('page', '1');
        setSearchParams(params);
    };

    const handleSortChange = (sort) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', sort);
        params.set('page', '1');
        setSearchParams(params);
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        setSearchParams(params);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="section">
            <div className="container">
                <h1 style={{ marginBottom: 'var(--spacing-2xl)' }}>
                    {currentCategory
                        ? categories.find(c => c._id === currentCategory)?.name || 'Products'
                        : 'All Products'
                    }
                </h1>

                {/* Filters */}
                <div className="flex justify-between items-center gap-lg" style={{ marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
                    <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
                        <button
                            className={`btn ${!currentCategory ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                            onClick={() => handleCategoryChange('')}
                        >
                            All
                        </button>
                        {categories.map(category => (
                            <button
                                key={category._id}
                                className={`btn ${currentCategory === category._id ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                                onClick={() => handleCategoryChange(category._id)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <select
                        className="form-input form-select"
                        style={{ width: 'auto', minWidth: '180px' }}
                        value={currentSort}
                        onChange={(e) => handleSortChange(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                    </select>
                </div>

                {/* Results count */}
                <p className="text-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    Showing {products.length} of {pagination.total} products
                </p>

                {/* Products Grid */}
                {loading ? (
                    <Loader />
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-4">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="pagination">
                                <button
                                    className="pagination-btn"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    ←
                                </button>

                                {[...Array(pagination.pages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    className="pagination-btn"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pagination.pages}
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h3 className="empty-state-title">No Products Found</h3>
                        <p className="empty-state-text">
                            Try adjusting your filters or search criteria.
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setSearchParams({})}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Products;
