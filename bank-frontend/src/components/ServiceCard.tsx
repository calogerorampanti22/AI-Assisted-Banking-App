import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
    title: string;
    description: string;
    icon: string;
    route: string;
    color?: string;
    borderColor?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, route, color = 'var(--primary-light)', borderColor = 'var(--glass-border)' }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            type="button"
            className="glass-panel"
            onClick={() => navigate(route)}
            style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.5rem',
                border: `1px solid ${isHovered ? color : borderColor}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                width: '100%',
                textAlign: 'left',
                color: 'inherit',
                background: 'none',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 8px 30px rgba(0,0,0,0.2)' : 'none'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: `${color}1A`, // 10% opacity
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: color
            }}>
                <span className={`bi ${icon}`}></span>
            </div>
            <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{title}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{description}</p>
            </div>
            <span className="bi bi-chevron-right" style={{ color: 'var(--text-secondary)', opacity: isHovered ? 1 : 0.5 }}></span>
        </button>
    );
};

export default ServiceCard;
