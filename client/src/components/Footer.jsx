import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-about">
                        <div className="footer-brand">ShopSmart</div>
                        <p className="footer-description">
                            Your one-stop destination for quality products at unbeatable prices.
                            Shop with confidence and enjoy a seamless shopping experience.
                        </p>
                    </div>

                    <div>
                        <h4 className="footer-title">Shop</h4>
                        <div className="footer-links">
                            <Link to="/products" className="footer-link">All Products</Link>
                            <Link to="/products?category=electronics" className="footer-link">Electronics</Link>
                            <Link to="/products?category=clothing" className="footer-link">Clothing</Link>
                            <Link to="/products?category=home" className="footer-link">Home & Kitchen</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-title">Account</h4>
                        <div className="footer-links">
                            <Link to="/login" className="footer-link">Login</Link>
                            <Link to="/register" className="footer-link">Register</Link>
                            <Link to="/orders" className="footer-link">My Orders</Link>
                            <Link to="/cart" className="footer-link">Cart</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-title">Support</h4>
                        <div className="footer-links">
                            <a href="#" className="footer-link">Help Center</a>
                            <a href="#" className="footer-link">Contact Us</a>
                            <a href="#" className="footer-link">Shipping Info</a>
                            <a href="#" className="footer-link">Returns</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} ShopSmart. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
