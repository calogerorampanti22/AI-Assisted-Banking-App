import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useBeneficiaries, Beneficiary } from '../hooks/useBeneficiaries';

const Transfer: React.FC = () => {
    const [formData, setFormData] = useState({
        amount: '',
        type: 'OUT',
        relatedAccountNumber: '',
        description: '',
        recipientFirstName: '',
        recipientLastName: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showAddModal, setShowAddModal] = useState(false);
    const [savingBeneficiary, setSavingBeneficiary] = useState(false);
    const navigate = useNavigate();

    const { beneficiaries, addBeneficiary, deleteBeneficiary, error: beneficiaryError } = useBeneficiaries();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectBeneficiary = (b: Beneficiary) => {
        setFormData(prev => ({
            ...prev,
            recipientFirstName: b.firstName,
            recipientLastName: b.lastName,
            relatedAccountNumber: b.iban
        }));
        // clear any previous messages
        setMessage({ type: '', text: '' });
    };

    const handleDeleteBeneficiary = async (id: number) => {
        try {
            await deleteBeneficiary(id);
        } catch {
            setMessage({ type: 'error', text: 'Errore durante l\'eliminazione del beneficiario.' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/transactions/transfer', formData);
            setMessage({ type: 'success', text: 'Bonifico effettuato correttamente' });
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data || 'Errore durante la transazione.' });
        }
    };

    const handleSaveAsBeneficiary = async () => {
        if (!formData.recipientFirstName || !formData.recipientLastName || !formData.relatedAccountNumber) {
            setMessage({ type: 'error', text: 'Compila nome, cognome e IBAN prima di salvare.' });
            return;
        }
        setSavingBeneficiary(true);
        try {
            await addBeneficiary(formData.recipientFirstName, formData.recipientLastName, formData.relatedAccountNumber);
            setMessage({ type: 'success', text: 'Beneficiario salvato nella rubrica!' });
        } catch {
            setMessage({ type: 'error', text: 'Errore nel salvare il beneficiario.' });
        } finally {
            setSavingBeneficiary(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 1rem' }}>

            {/* Rubrica Beneficiari */}
            {beneficiaries.length > 0 && (
                <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>📋 Rubrica Beneficiari</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {beneficiaries.map(b => (
                            <div key={b.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.75rem 1rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                            >
                                <div onClick={() => handleSelectBeneficiary(b)} style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600' }}>{b.firstName} {b.lastName}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{b.iban}</div>
                                </div>
                                <button
                                    onClick={() => handleDeleteBeneficiary(b.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--danger)',
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                        opacity: 0.7,
                                        transition: 'opacity 0.2s',
                                        fontSize: '1rem'
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
                                    title="Rimuovi dalla rubrica"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.75rem', textAlign: 'center' }}>
                        Clicca su un beneficiario per precompilare il modulo
                    </p>
                </div>
            )}

            {/* Modulo Bonifico */}
            <div className="glass-panel">
                <h2 style={{ marginBottom: '1.5rem' }}>Effettua bonifico</h2>

                {message.text && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        borderRadius: '8px',
                        background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                        border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Importo (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            min="0.01"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Nome Beneficiario</label>
                            <input
                                type="text"
                                className="form-control"
                                name="recipientFirstName"
                                value={formData.recipientFirstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Cognome Beneficiario</label>
                            <input
                                type="text"
                                className="form-control"
                                name="recipientLastName"
                                value={formData.recipientLastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">IBAN Destinatario</label>
                        <input
                            type="text"
                            className="form-control"
                            name="relatedAccountNumber"
                            value={formData.relatedAccountNumber}
                            onChange={handleChange}
                            required
                            placeholder="es. IT12X00000..."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Descrizione / Causale</label>
                        <input
                            type="text"
                            className="form-control"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                            Conferma Bonifico
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveAsBeneficiary}
                            disabled={savingBeneficiary}
                            className="btn"
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                padding: '0.75rem',
                                transition: 'background 0.2s',
                                fontSize: '0.85rem'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                            title="Salva nome, cognome e IBAN nella rubrica"
                        >
                            📋 Salva in rubrica
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Transfer;
