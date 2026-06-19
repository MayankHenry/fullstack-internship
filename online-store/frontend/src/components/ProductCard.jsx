import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="card">
            <img src={product.image} alt={product.name} className="card-img" />
            <h3 className="card-title">{product.name}</h3>
            <div className="card-price">${product.price.toFixed(2)}</div>
            <p className="card-desc">{product.description.substring(0, 60)}...</p>
            <Link to={`/product/${product.id}`} className="btn text-center">View Details</Link>
        </div>
    );
};

export default ProductCard;
