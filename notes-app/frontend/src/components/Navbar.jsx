import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar flex-between glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
      <div className="navbar-brand">Antigravity Notes</div>
      <div className="flex-center" style={{ gap: '16px' }}>
        <span style={{ fontWeight: 500 }}>Hello, {user.name}</span>
        <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px 16px' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
