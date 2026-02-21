import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL || '';

    // Fetch cart when user logs in
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            // Load from localStorage for guest users
            const localCart = localStorage.getItem('guestCart');
            if (localCart) {
                setCart(JSON.parse(localCart));
            } else {
                setCart({ items: [], totalAmount: 0 });
            }
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/api/cart`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        if (isAuthenticated) {
            try {
                setLoading(true);
                const response = await fetch(`${apiUrl}/api/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ productId: product._id, quantity })
                });

                if (response.ok) {
                    const data = await response.json();
                    setCart(data);
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
            } finally {
                setLoading(false);
            }
        } else {
            // Guest cart (localStorage)
            const updatedCart = { ...cart };
            const existingIndex = updatedCart.items.findIndex(
                item => item.product._id === product._id
            );

            if (existingIndex > -1) {
                updatedCart.items[existingIndex].quantity += quantity;
            } else {
                updatedCart.items.push({
                    _id: Date.now().toString(),
                    product,
                    quantity,
                    price: product.price
                });
            }

            updatedCart.totalAmount = updatedCart.items.reduce(
                (total, item) => total + item.price * item.quantity, 0
            );

            setCart(updatedCart);
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        if (isAuthenticated) {
            try {
                setLoading(true);
                const response = await fetch(`${apiUrl}/api/cart/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ quantity })
                });

                if (response.ok) {
                    const data = await response.json();
                    setCart(data);
                }
            } catch (error) {
                console.error('Error updating cart:', error);
            } finally {
                setLoading(false);
            }
        } else {
            const updatedCart = { ...cart };
            const itemIndex = updatedCart.items.findIndex(item => item._id === itemId);

            if (itemIndex > -1) {
                updatedCart.items[itemIndex].quantity = quantity;
                updatedCart.totalAmount = updatedCart.items.reduce(
                    (total, item) => total + item.price * item.quantity, 0
                );
                setCart(updatedCart);
                localStorage.setItem('guestCart', JSON.stringify(updatedCart));
            }
        }
    };

    const removeFromCart = async (itemId) => {
        if (isAuthenticated) {
            try {
                setLoading(true);
                const response = await fetch(`${apiUrl}/api/cart/${itemId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCart(data);
                }
            } catch (error) {
                console.error('Error removing from cart:', error);
            } finally {
                setLoading(false);
            }
        } else {
            const updatedCart = { ...cart };
            updatedCart.items = updatedCart.items.filter(item => item._id !== itemId);
            updatedCart.totalAmount = updatedCart.items.reduce(
                (total, item) => total + item.price * item.quantity, 0
            );
            setCart(updatedCart);
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        }
    };

    const clearCart = async () => {
        if (isAuthenticated) {
            try {
                setLoading(true);
                const response = await fetch(`${apiUrl}/api/cart`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (response.ok) {
                    setCart({ items: [], totalAmount: 0 });
                }
            } catch (error) {
                console.error('Error clearing cart:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setCart({ items: [], totalAmount: 0 });
            localStorage.removeItem('guestCart');
        }
    };

    const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);

    const value = {
        cart,
        loading,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
