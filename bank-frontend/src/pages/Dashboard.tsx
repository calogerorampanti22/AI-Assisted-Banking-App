import React, { useState } from 'react';
import { useAccounts, Transaction as TransactionType } from '../hooks/useAccounts';
import Transaction from '../components/Transaction';
import TransactionModal from '../components/TransactionModal';
import CreditCard from '../components/CreditCard';
import SpendingChart from '../components/SpendingChart';

const Dashboard: React.FC = () => {
    //Richiamo il custom hook
    const {
        account,
        transactions,
        cards,
        filters,
        loading,
        error,
        handleFilterChange,
        requestNewCard,
        toggleCardFreeze
    } = useAccounts();

    const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // States for Request New Card Modal
    const [isRequestCardModalOpen, setIsRequestCardModalOpen] = useState(false);
    const [newCardType, setNewCardType] = useState('DEBIT');
    const [newCardNetwork, setNewCardNetwork] = useState('VISA');

    const handleTransactionClick = (transaction: TransactionType) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleRequestNewCard = async () => {
        await requestNewCard(newCardType, newCardNetwork);
        setIsRequestCardModalOpen(false);
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Caricamento in corso...</div>;
    }

    if (error) {
        return <div style={{ color: 'var(--danger)', textAlign: 'center', marginTop: '50px' }}>{error}</div>;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
            <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ marginBottom: '0.5rem' }}>
                        Bentornato, {account?.user?.firstName ? `${account.user.firstName} ${account.user.lastName} ` : account?.user?.username}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>IBAN: <strong>{account?.accountNumber || 'Loading...'}</strong></p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Saldo</p>
                    <h1>€ {account?.balance?.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}</h1>
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>Le tue Carte</h3>
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsRequestCardModalOpen(true)}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                        + Richiedi Carta
                    </button>
                </div>
                {cards && cards.length > 0 ? (
                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        overflowX: 'auto',
                        padding: '0.5rem',
                        paddingBottom: '1rem',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'var(--glass-border) transparent'
                    }}>
                        {cards.map(card => (
                            <CreditCard
                                key={card.id}
                                card={card}
                                onToggleFreeze={toggleCardFreeze}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        <p>Non hai ancora nessuna carta associata al tuo conto.</p>
                        <p>Clicca su "+ Richiedi Carta" per riceverne una!</p>
                    </div>
                )}
            </div>

            <div className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ margin: 0 }}>Transazioni recenti</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input type="date" className="form-control" name="startDate" value={filters.startDate} onChange={handleFilterChange} style={{ padding: '0.5rem', width: 'auto' }} />
                        <input type="date" className="form-control" name="endDate" value={filters.endDate} onChange={handleFilterChange} style={{ padding: '0.5rem', width: 'auto' }} />
                        <select className="form-control" name="type" value={filters.type} onChange={handleFilterChange} style={{ padding: '0.5rem', width: 'auto' }}>
                            <option value="">Tutti</option>
                            <option value="IN">Entrate</option>
                            <option value="OUT">Uscite</option>
                        </select>
                    </div>
                </div>

                <Transaction
                    transactions={transactions}
                    onTransactionClick={handleTransactionClick}
                />
            </div>
            <br></br>
            <SpendingChart transactions={transactions} />

            <TransactionModal
                transaction={selectedTransaction}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Request Card Modal */}
            {isRequestCardModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="glass-panel" style={{ width: '90%', maxWidth: '400px', backgroundColor: 'var(--bg-card)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Richiedi Nuova Carta</h3>
                            <button onClick={() => setIsRequestCardModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-primary)' }}>&times;</button>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tipo di Carta</label>
                            <select
                                className="form-control"
                                value={newCardType}
                                onChange={(e) => setNewCardType(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem' }}
                            >
                                <option value="DEBIT">Debito</option>
                                <option value="CREDIT">Credito</option>
                                <option value="PREPAID">Prepagata</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Circuito</label>
                            <select
                                className="form-control"
                                value={newCardNetwork}
                                onChange={(e) => setNewCardNetwork(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem' }}
                            >
                                <option value="VISA">Visa</option>
                                <option value="MARSTERCARD">Mastercard</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button className="btn btn-secondary" onClick={() => setIsRequestCardModalOpen(false)}>Annulla</button>
                            <button className="btn btn-primary" onClick={handleRequestNewCard} disabled={loading}>
                                {loading ? 'Richiesta in corso...' : 'Conferma Richiesta'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Dashboard;
