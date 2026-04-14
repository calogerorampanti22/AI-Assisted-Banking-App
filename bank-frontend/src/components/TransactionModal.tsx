import React from 'react';
import { Transaction } from '../hooks/useAccounts';

interface TransactionModalProps {
    transaction: Transaction | null;
    isOpen: boolean;
    onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ transaction, isOpen, onClose }) => {
    if (!isOpen || !transaction) return null;

    const formattedDate = new Date(transaction.date).toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const isIncome = transaction.type === 'IN';
    const amountColor = isIncome ? 'var(--success)' : 'var(--danger)';
    const amountPrefix = isIncome ? '+' : '-';

    const categoryText = (() => {
        if (transaction.category) return transaction.category.toUpperCase();
        const descText = ((transaction.description || '') + ' ' + (transaction.recipientLastName || '')).toUpperCase();
        if (descText.includes('PAGOPA')) return 'PAGOPA';
        if (descText.includes('BOLLETTINO')) return 'BOLLETTINO';
        if (descText.includes('BONIFICO')) return 'BONIFICO';
        return 'GENERICO';
    })();

    const relatedAccountLabel = (() => {
        if (categoryText === 'PAGOPA') return 'IUV (Codice Avviso)';
        if (categoryText === 'BOLLETTINO') return 'Codice Bollettino';
        return `IBAN ${isIncome ? 'Mittente' : 'Destinatario'}`;
    })();

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1050,
            backdropFilter: 'blur(5px)'
        }} onClick={onClose}>
            <div className="glass-panel" style={{
                position: 'relative',
                width: '100%',
                maxWidth: '500px',
                padding: '2rem',
                margin: '1rem',
                backgroundColor: 'var(--primary-color)'
            }} onClick={(e) => e.stopPropagation()}>
                <button
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
                >
                    &times;
                </button>

                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                    Dettagli Transazione
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Importo:</span>
                        <strong style={{ fontSize: '1.25rem', color: amountColor }}>
                            {amountPrefix} €{transaction.amount.toFixed(2)}
                        </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Data:</span>
                        <span>{formattedDate}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Tipologia:</span>
                        <span style={{ fontWeight: 'bold' }}>{categoryText}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Causale:</span>
                        <span style={{ textAlign: 'right', wordBreak: 'break-word', maxWidth: '60%' }}>
                            {transaction.description || '-'}
                        </span>
                    </div>


                    {(transaction.recipientFirstName || transaction.recipientLastName) && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Nominativo {isIncome ? 'Mittente' : 'Destinatario'}:</span>
                            <span>{`${transaction.recipientFirstName || ''} ${transaction.recipientLastName || ''}`.trim()}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{relatedAccountLabel}:</span>
                        <span>{transaction.relatedAccountNumber || '-'}</span>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
                        Chiudi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
