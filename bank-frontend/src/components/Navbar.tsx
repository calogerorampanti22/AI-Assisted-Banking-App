import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <nav className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem 2rem', borderRadius: '0 0 16px 16px' }}>
            <h2 style={{ margin: 0, fontWeight: 700 }}>
                <Link to="/dashboard" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                    BankingApp
                </Link>
            </h2>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '0.4rem 1rem' }}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
