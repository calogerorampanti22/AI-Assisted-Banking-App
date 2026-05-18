import React, { useState } from 'react';
import { Card } from '../hooks/useAccounts';
import VisaLogo from '../assets/Visa.svg';
import MastercardLogo from '../assets/Mastercard.svg';

interface CreditCardProps {
    card: Card;
    onToggleFreeze: (cardId: string, isFrozen: boolean) => void;
}

const CreditCard: React.FC<CreditCardProps> = ({ card, onToggleFreeze }) => {
    const [showPan, setShowPan] = useState(false);

    const formatExpDate = (dateStr: string) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length >= 2) return `${parts[1]}/${parts[0].substring(2)}`;
        return dateStr;
    };

    const displayPan = () => {
        if (!card.pan) return '';
        if (showPan) {
            return card.pan.replaceAll(/(.{4})/g, '$1 ').trim();
        } else {
            const last4 = card.pan.substring(card.pan.length - 4);
            return `•••• •••• •••• ${last4}`;
        }
    };

    const getCardBackground = () => {
        switch (card.type) {
            case 'CREDIT':
                return 'linear-gradient(135deg, #42d44eff 0%, #36ff2bff 100%)'; // Red/Orange
            case 'DEBIT':
                return 'linear-gradient(135deg, #8145f9ff 0%, #8700feff 100%)'; // Blue/Cyan
            case 'PREPAID':
                return 'linear-gradient(135deg, #d4cf34ff 0%, #efef38ff 100%)'; // Green
            default:
                return card.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; // Purple fallback
        }
    };

    const isFrozen = card.frozen;

    return (
        <div style={{
            background: isFrozen ? 'linear-gradient(135deg, #444 0%, #222 100%)' : getCardBackground(),
            borderRadius: '16px',
            padding: '1.5rem',
            color: 'white',
            width: '320px',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0
        }}>

            {/* Effetto Vetro Decorativo */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '150px',
                height: '150px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(30px)'
            }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 11 }}>
                <div style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {card.type}
                    {isFrozen && <span style={{ padding: '2px 6px', background: 'rgba(255,100,100,0.8)', borderRadius: '4px', fontSize: '0.6rem' }}>BLOCCATA</span>}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>

                    {/* Pulsante Blocco/Sblocco Carta */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFreeze(card.id, card.frozen);
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: isFrozen ? '#ff6666' : 'white',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isFrozen ? 1 : 0.8,
                            transition: 'opacity 0.2s',
                            zIndex: 12
                        }}
                        title={isFrozen ? "Sblocca Carta" : "Blocca Carta"}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = isFrozen ? '1' : '0.8'}
                    >
                        {isFrozen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                            </svg>
                        )}
                    </button>

                    {/* Pulsante Mostra/Nascondi PAN */}
                    <button
                        onClick={() => setShowPan(!showPan)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0.8,
                            transition: 'opacity 0.2s',
                            zIndex: 12
                        }}
                        title={showPan ? "Nascondi PAN" : "Mostra PAN"}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                    >
                        {showPan ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', zIndex: 11 }}>
                <div style={{
                    fontSize: '1rem',
                    letterSpacing: '4px',
                    fontFamily: '"Courier New", Courier, monospace',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                    {displayPan()}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 11 }}>
                <div>
                    <div style={{ fontSize: '0.5rem', opacity: 0.8, marginBottom: '2px' }}>CVV</div>
                    <div style={{ fontSize: '0.9rem', fontFamily: '"Courier New", Courier, monospace' }}>{showPan ? card.cvv : '***'}</div>
                </div>
                <div style={{ textAlign: 'center', marginRight: '1rem' }}>
                    <div style={{ fontSize: '0.5rem', opacity: 0.8, marginBottom: '2px' }}>SCAD<br /></div>
                    <div style={{ fontSize: '0.9rem', fontFamily: '"Courier New", Courier, monospace' }}>{showPan ? formatExpDate(card.expirationDate) : '**/**'}</div>
                </div>
                <div style={{ fontStyle: 'italic', fontWeight: 'bold', fontSize: '1.2rem', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                    {card.network == "VISA" ? (
                        <img src={VisaLogo} alt="Visa" style={{ height: '30px' }} />
                    ) : (
                        <img src={MastercardLogo} alt="Mastercard" style={{ height: '30px' }} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreditCard;
