import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ cartItemCount, setToken, token }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">NexusStore</Link>
            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                {token ? (
                    <>
                        <Link to="/cart" className="nav-link">
                            Cart {cartItemCount > 0 && <span style={{ background: 'var(--accent-color)', borderRadius: '50%', padding: '0.2rem 0.6rem', color: 'white', marginLeft: '0.5rem', fontSize: '0.8rem' }}>{cartItemCount}</span>}
                        </Link>
                        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
                    </>
                ) : (
                    <Link to="/auth" className="btn">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
