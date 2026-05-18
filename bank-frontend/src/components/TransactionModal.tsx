import React from "react";
import { Transaction } from "../hooks/useAccounts";

interface TransactionModalProps {
    transaction: Transaction | null;
    isOpen: boolean;
    onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ transaction, isOpen, onClose }) => {
    if (!isOpen || !transaction) return null;

    const getCategoryLabel = (t: Transaction) => {
        if (t.category) return t.category.toUpperCase();
        const descText = ((t.description || '') + ' ' + (t.recipientLastName || '')).toUpperCase();
        if (descText.includes('PAGOPA')) return 'PAGOPA';
        if (descText.includes('BOLLETTINO')) return 'BOLLETTINO';
        if (descText.includes('BONIFICO')) return 'BONIFICO';
        return 'GENERICO';
    };

    const category = getCategoryLabel(transaction);
    let relatedAccountLabel = 'IBAN';
    if (category === 'PAGOPA') {
        relatedAccountLabel = 'IUV';
    } else if (category === 'BOLLETTINO') {
        relatedAccountLabel = 'Codice Bollettino';
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1050,
            backdropFilter: 'blur(5px)',
            padding: 0
        }}>
            <button 
                type="button"
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: 'none',
                    padding: 0,
                    cursor: 'default'
                }}
                aria-label="Chiudi modale"
            />
            
            <dialog 
                open
                className="glass-panel" 
                aria-labelledby="modal-title"
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '500px',
                    padding: '2rem',
                    margin: '1rem',
                    backgroundColor: 'var(--primary-color)',
                    cursor: 'auto',
                    color: 'white',
                    textAlign: 'left',
                    zIndex: 1051,
                    border: 'none',
                    display: 'block'
                }} 
            >
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        lineHeight: 1
                    }}
                    aria-label="Chiudi"
                >
                    &times;
                </button>

                <h3 id="modal-title" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                    Dettagli Transazione
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>ID Transazione:</span>
                        <span>{transaction.id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Data:</span>
                        <span>{new Date(transaction.date).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Descrizione:</span>
                        <span style={{ fontWeight: '500' }}>{transaction.description || '-'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Categoria:</span>
                        <span style={{ padding: '2px 8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.8rem' }}>
                            {getCategoryLabel(transaction)}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Tipo:</span>
                        <span style={{ color: transaction.type === 'IN' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                            {transaction.type === 'IN' ? 'ENTRATA' : 'USCITA'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--glass-border)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Importo:</span>
                        <span style={{ color: transaction.type === 'IN' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                             €{transaction.amount.toFixed(2)}
                        </span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{relatedAccountLabel}:</span>
                        <span>{transaction.relatedAccountNumber || '-'}</span>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
                        Chiudi
                    </button>
                </div>
            </dialog>
        </div>
    );
};

export default TransactionModal;
