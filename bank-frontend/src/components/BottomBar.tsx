import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomBar: React.FC = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Only trigger if scrolled more than a threshold (e.g. 10px) to avoid jitter
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false); // Scrolling down -> Hide
            } else if (currentScrollY < lastScrollY) {
                setIsVisible(true); // Scrolling up -> Show
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <div className={`bottom-bar ${isVisible ? '' : 'bottom-bar-hidden'}`}>
            <Link to="/dashboard" className={`bottom-bar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                <i className="bi bi-house-door"></i>
                <span>Home</span>
            </Link>
            <Link to="/transfer" className={`bottom-bar-item ${location.pathname === '/transfer' ? 'active' : ''}`}>
                <i className="bi bi-arrow-left-right"></i>
                <span>Bonifico</span>
            </Link>
            <Link to="/payments" className={`bottom-bar-item ${location.pathname === '/payments' ? 'active' : ''}`}>
                <i className="bi bi-receipt"></i>
                <span>Utenze</span>
            </Link>
            <Link to="/savings-goals" className={`bottom-bar-item ${location.pathname === '/savings-goals' ? 'active' : ''}`}>
                <i className="bi bi-piggy-bank"></i>
                <span>Salvadanai</span>
            </Link>
            <Link to="/profile" className={`bottom-bar-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                <i className="bi bi-person"></i>
                <span>Profilo</span>
            </Link>
        </div>
    );
};

export default BottomBar;
