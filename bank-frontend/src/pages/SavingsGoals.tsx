import React, { useState } from 'react';
import { useSavingsGoals, SavingsGoal } from '../hooks/useSavingsGoals';

const SavingsGoals: React.FC = () => {
    const { goals, loading, error, createGoal, deposit, withdraw, deleteGoal } = useSavingsGoals();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newTarget, setNewTarget] = useState('');

    const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
    const [actionAmount, setActionAmount] = useState('');
    const [actionType, setActionType] = useState<'deposit' | 'withdraw' | null>(null);

    const handleCreate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const success = await createGoal(newName, Number.parseFloat(newTarget));
        if (success) {
            setShowCreateModal(false);
            setNewName('');
            setNewTarget('');
        }
    };

    const handleAction = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedGoal || !actionType) return;

        const amount = Number.parseFloat(actionAmount);
        const success = actionType === 'deposit'
            ? await deposit(selectedGoal.id, amount)
            : await withdraw(selectedGoal.id, amount);

        if (success) {
            setSelectedGoal(null);
            setActionType(null);
            setActionAmount('');
        }
    };

    const confirmDelete = async (id: number) => {
        if (globalThis.confirm("Sei sicuro di voler eliminare questo salvadanaio? I fondi rimanenti verranno riportati sul conto principale.")) {
            await deleteGoal(id);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Caricamento salvadanai...</div>;
    if (error) return <div style={{ color: 'var(--danger)', textAlign: 'center', marginTop: '50px' }}>{error}</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Salvadanai</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Gestisci i tuoi obiettivi di risparmio e accantona fondi.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    <span className="bi bi-plus-lg" style={{ marginRight: '0.5rem' }} />
                    {'Nuovo Obiettivo'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {goals.length > 0 ? goals.map(goal => {
                    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                    return (
                        <div key={goal.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ margin: 0 }}>{goal.name}</h3>
                                <button
                                    onClick={() => confirmDelete(goal.id)}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '5px' }}
                                >
                                    <span className="bi bi-trash"></span>
                                </button>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    €{goal.currentAmount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    Obiettivo: €{goal.targetAmount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                </div>
                            </div>

                            <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${progress}%`,
                                    background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                    borderRadius: '5px'
                                }}></div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                <span>Progresso</span>
                                <span style={{ color: progress === 100 ? 'var(--success)' : 'var(--text-primary)', fontWeight: 'bold' }}>
                                    {progress.toFixed(1)}%
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <button
                                    className="btn btn-primary"
                                    style={{ flex: 1, fontSize: '0.875rem' }}
                                    onClick={() => { setSelectedGoal(goal); setActionType('deposit'); }}
                                >
                                    Deposita
                                </button>
                                <button
                                    className="btn"
                                    style={{ flex: 1, fontSize: '0.875rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                    onClick={() => { setSelectedGoal(goal); setActionType('withdraw'); }}
                                >
                                    Preleva
                                </button>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
                        <span className="bi bi-piggy-bank" style={{ fontSize: '4rem', color: 'var(--text-secondary)', opacity: 0.3, marginBottom: '1.5rem', display: 'block' }}></span>
                        <h3>Nessun salvadanaio creato</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Inizia a risparmiare per i tuoi sogni creando il tuo primo obiettivo.</p>
                    </div>
                )}
            </div>

            {/* Create Goal Modal */}
            {showCreateModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', border: '1px solid var(--success)' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Nuovo Salvadanaio</h3>
                        <form onSubmit={handleCreate}>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="newName">Nome Obiettivo</label>
                                <input
                                    id="newName"
                                    type="text"
                                    className="form-control"
                                    placeholder="Es: Vacanza in montagna"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="newTarget">Somma da Raggiungere (€)</label>
                                <input
                                    id="newTarget"
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Es: 1500"
                                    value={newTarget}
                                    onChange={(e) => setNewTarget(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} onClick={() => setShowCreateModal(false)}>Annulla</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Crea</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Deposit/Withdraw Modal */}
            {selectedGoal && actionType && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', border: actionType === 'deposit' ? '1px solid var(--success)' : '1px solid var(--danger)' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>{actionType === 'deposit' ? 'Deposita' : 'Preleva'}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{selectedGoal.name}</p>
                        <form onSubmit={handleAction}>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="actionAmount">Importo (€)</label>
                                <input
                                    id="actionAmount"
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Es: 50.00"
                                    value={actionAmount}
                                    onChange={(e) => setActionAmount(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} onClick={() => { setSelectedGoal(null); setActionType(null); }}>Annulla</button>
                                <button type="submit" className={`btn ${actionType === 'deposit' ? 'btn-primary' : 'btn-danger'}`} style={{ flex: 1 }}>
                                    {actionType === 'deposit' ? 'Conferma Deposito' : 'Conferma Prelievo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavingsGoals;
