import React from "react";
import { Transaction as TransactionType } from "../hooks/useAccounts";

interface TransactionProps {
    transactions: TransactionType[];
    onTransactionClick?: (transaction: TransactionType) => void;
}

const Transaction: React.FC<TransactionProps> = ({ transactions, onTransactionClick }) => {
    const getCategoryLabel = (t: TransactionType) => {
        if (t.category) return t.category.toUpperCase();
        const descText = ((t.description || '') + ' ' + (t.recipientLastName || '')).toUpperCase();
        if (descText.includes('PAGOPA')) return 'PAGOPA';
        if (descText.includes('BOLLETTINO')) return 'BOLLETTINO';
        if (descText.includes('BONIFICO')) return 'BONIFICO';
        return 'GENERICO';
    };

    const getRelatedAccountPrefix = (category: string) => {
        if (category === 'PAGOPA') return 'IUV: ';
        if (category === 'BOLLETTINO') return 'Cod. Boll: ';
        return 'IBAN: ';
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>Data</th>
                        <th style={{ padding: '1rem' }}>Descrizione</th>
                        <th style={{ padding: '1rem', textAlign: 'right' }}>Importo</th>
                        {onTransactionClick && <th style={{ padding: '1rem' }}></th>}
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? transactions.map(t => (
                        <tr
                            key={t.id}
                            style={{
                                borderBottom: '1px solid var(--glass-border)',
                                transition: 'background-color 0.2s',
                            }}
                        >
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{new Date(t.date).toLocaleString()}</td>
                            <td style={{ padding: '1rem' }}>
                                <div style={{ marginBottom: '4px' }}>{t.description || '-'}</div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ padding: '2px 8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                        {getCategoryLabel(t)}
                                    </span>
                                    <small style={{ color: 'var(--text-secondary)' }}>
                                        {getRelatedAccountPrefix(getCategoryLabel(t))}
                                        {t.relatedAccountNumber}
                                    </small>
                                </div>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: t.type === 'IN' ? 'var(--success)' : 'var(--danger)' }}>
                                {t.type === 'IN' ? '+' : '-'} €{t.amount.toFixed(2)}
                            </td>
                            {onTransactionClick && (
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        onClick={() => onTransactionClick(t)}
                                        style={{ 
                                            background: 'rgba(255,255,255,0.05)', 
                                            border: '1px solid var(--glass-border)', 
                                            color: 'var(--text-primary)',
                                            fontSize: '0.75rem',
                                            padding: '4px 8px'
                                        }}
                                        aria-label="Vedi dettagli"
                                    >
                                        Dettagli
                                    </button>
                                </td>
                            )}
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Nessuna transazione trovata.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Transaction;