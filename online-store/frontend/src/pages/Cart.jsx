import React, { useEffect, useState } from 'react';
import { fetchCart, removeFromCart, checkoutCart } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Cart = ({ updateCartCount }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadCart = async () => {
        try {
            const items = await fetchCart();
            setCartItems(items);
            if (updateCartCount) updateCartCount();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
            return;
        }
        loadCart();
    }, [navigate]);

    const handleRemove = async (cartItemId) => {
        try {
            await removeFromCart(cartItemId);
            loadCart();
        } catch (error) {
            alert('Failed to remove item');
        }
    };

    const handleCheckout = async () => {
        try {
            await checkoutCart();
            alert('Order placed successfully! Thank you for shopping with NexusStore.');
            loadCart();
        } catch (error) {
            alert('Failed to place order');
        }
    };

    if (loading) return <div className="container text-center"><h2>Loading cart...</h2></div>;

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Your Shopping Cart</h1>
            
            {cartItems.length === 0 ? (
                <div className="card text-center" style={{ padding: '3rem' }}>
                    <h2>Your cart is empty</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Browse our products and add some items!</p>
                </div>
            ) : (
                <>
                    {cartItems.map(item => (
                        <div key={item.cart_item_id} className="cart-item">
                            <div className="cart-item-info">
                                <img src={item.image} alt={item.name} className="cart-item-img" />
                                <div>
                                    <h3>{item.name}</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>Quantity: {item.quantity}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>${(item.price * item.quantity).toFixed(2)}</div>
                                <button onClick={() => handleRemove(item.cart_item_id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>Remove</button>
                            </div>
                        </div>
                    ))}
                    
                    <div className="cart-summary">
                        <div>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>Total</h2>
                            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent-color)' }}>${total.toFixed(2)}</div>
                        </div>
                        <button onClick={handleCheckout} className="btn" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
                            Checkout Now
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
