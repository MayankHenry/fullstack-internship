import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, addToCart } from '../utils/api';

const ProductDetail = ({ updateCartCount }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await fetchProductById(id);
                setProduct(data);
            } catch (err) {
                setError('Product not found');
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
            return;
        }

        try {
            await addToCart(product.id, 1);
            alert('Added to cart!');
            if (updateCartCount) updateCartCount();
        } catch (err) {
            alert('Failed to add to cart: ' + err.message);
        }
    };

    if (loading) return <div className="container text-center"><h2>Loading...</h2></div>;
    if (error) return <div className="container text-center"><h2>{error}</h2></div>;
    if (!product) return null;

    return (
        <div className="container" style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', marginTop: '4rem' }}>
            <div style={{ flex: '1 1 400px' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
            </div>
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ color: 'var(--accent-color)', fontWeight: '600', marginBottom: '0.5rem' }}>{product.category}</span>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: '1.2' }}>{product.name}</h1>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem' }}>${product.price.toFixed(2)}</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.8' }}>
                    {product.description}
                </p>
                <button onClick={handleAddToCart} className="btn" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
