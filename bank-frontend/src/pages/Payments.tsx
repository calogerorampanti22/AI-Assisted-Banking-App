import React from 'react';
import { useNavigate } from 'react-router-dom';

const Payments: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Pagamenti e Servizi</h2>

            {/* Ricarica Telefonica */}
            <div
                className="glass-panel"
                onClick={() => navigate('/phone-topup')}
                style={{
                    cursor: 'pointer',
                    marginBottom: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '1.5rem',
                    border: '1px solid var(--success)',
                    transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: 'var(--success)'
                }}>
                    <i className="bi bi-phone"></i>
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Ricarica Telefonica</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ricarica il tuo credito o quello dei tuoi contatti in pochi secondi.</p>
                </div>
                <i className="bi bi-chevron-right" style={{ color: 'var(--text-secondary)' }}></i>
            </div>

            {/* Altre Opzioni di Pagamento */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div
                    className="glass-panel"
                    onClick={() => navigate('/pagopa')}
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        padding: '1.5rem',
                        border: '1px solid var(--glass-border)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'rgba(59, 130, 246, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        color: 'var(--primary-light, #3b82f6)'
                    }}>
                        <i className="bi bi-bank"></i>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>PagoPA</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Paga tasse, multe e servizi pubblici in modo rapido e sicuro.</p>
                    </div>
                    <i className="bi bi-chevron-right" style={{ color: 'var(--text-secondary)' }}></i>
                </div>

                <div
                    className="glass-panel"
                    onClick={() => navigate('/bollettino')}
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        padding: '1.5rem',
                        border: '1px solid var(--glass-border)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'rgba(59, 130, 246, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        color: 'var(--primary-light, #3b82f6)'
                    }}>
                        <i className="bi bi-file-earmark-text"></i>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Bollettino Postale</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Paga bollettini bianchi e premarcati comodamente da casa.</p>
                    </div>
                    <i className="bi bi-chevron-right" style={{ color: 'var(--text-secondary)' }}></i>
                </div>
            </div>
        </div>
    );
};

export default Payments;
