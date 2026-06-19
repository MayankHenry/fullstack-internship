const API_URL = 'http://localhost:3000/api';

export const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};

export const fetchProductById = async (id) => {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
};

export const loginUser = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
    }
    return res.json();
};

export const registerUser = async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
    }
    return res.json();
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const fetchCart = async () => {
    const res = await fetch(`${API_URL}/cart`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
};

export const addToCart = async (productId, quantity = 1) => {
    const res = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity })
    });
    if (!res.ok) throw new Error('Failed to add to cart');
    return res.json();
};

export const removeFromCart = async (cartItemId) => {
    const res = await fetch(`${API_URL}/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to remove item');
    return res.json();
};

export const checkoutCart = async () => {
    const res = await fetch(`${API_URL}/cart/checkout`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to checkout');
    return res.json();
};
