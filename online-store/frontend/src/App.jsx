import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import { fetchCart } from './utils/api';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [cartItemCount, setCartItemCount] = useState(0);

    const updateCartCount = async () => {
        if (!token) {
            setCartItemCount(0);
            return;
        }
        try {
            const items = await fetchCart();
            const count = items.reduce((sum, item) => sum + item.quantity, 0);
            setCartItemCount(count);
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    };

    useEffect(() => {
        updateCartCount();
    }, [token]);

    return (
        <>
            <Navbar cartItemCount={cartItemCount} setToken={setToken} token={token} />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetail updateCartCount={updateCartCount} />} />
                    <Route path="/cart" element={<Cart updateCartCount={updateCartCount} />} />
                    <Route path="/auth" element={<Auth setToken={setToken} />} />
                </Routes>
            </main>
        </>
    );
}

export default App;
