import React, { useState } from 'react';
import { usePhoneTopUp, TopUpRequest } from '../hooks/usePhoneTopUp';
import { useNavigate } from 'react-router-dom';

const operators = ['TIM', 'Vodafone', 'WindTre', 'Iliad', 'PosteMobile', 'Fastweb'];
const amounts = [5, 10, 20, 30, 50, 100];

const PhoneTopUp: React.FC = () => {
    const { contacts, topUp, loading: loadingContacts } = usePhoneTopUp();
    const navigate = useNavigate();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [operator, setOperator] = useState('');
    const [amount, setAmount] = useState<number | null>(null);
    const [saveContact, setSaveContact] = useState(false);
    const [contactName, setContactName] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) {
            setError('Seleziona un importo.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const request: TopUpRequest = {
            phoneNumber,
            operator,
            amount,
            saveContact,
            contactName: saveContact ? contactName : undefined
        };

        const result = await topUp(request);
        setIsSubmitting(false);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 3000);
        } else {
            setError(result.message);
        }
    };

    const selectContact = (contact: any) => {
        setPhoneNumber(contact.phoneNumber);
        setOperator(contact.operator);
    };

    if (success) {
        return (
            <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
                <div className="glass-panel">
                    <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: '1.5rem', display: 'block' }}></i>
                    <h2>Ricarica Effettuata!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        L'importo di €{amount?.toFixed(2)} è stato accreditato sul numero {phoneNumber}.
                    </p>
                    <p>Verrai reindirizzato alla dashboard in pochi secondi...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>Ricarica Telefonica</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="glass-panel">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label className="form-label">Numero di Telefono</label>
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="333 1234567"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Operatore</label>
                            <select
                                className="form-control"
                                value={operator}
                                onChange={(e) => setOperator(e.target.value)}
                                required
                            >
                                <option value="" disabled>Seleziona operatore</option>
                                {operators.map(op => (
                                    <option key={op} value={op}>{op}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="form-label">Importo</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                {amounts.map(amt => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setAmount(amt)}
                                        style={{
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: amount === amt ? '2px solid var(--success)' : '1px solid var(--glass-border)',
                                            background: amount === amt ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                                            color: 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        €{amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <input
                                type="checkbox"
                                id="saveContact"
                                checked={saveContact}
                                onChange={(e) => setSaveContact(e.target.checked)}
                            />
                            <label htmlFor="saveContact" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                Salva contatto per ricariche veloci
                            </label>
                        </div>

                        {saveContact && (
                            <div>
                                <label className="form-label">Nome Contatto</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Es: Mamma, Mio numero..."
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {error && <div style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</div>}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ marginTop: '1rem' }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'In corso...' : 'Conferma Ricarica'}
                        </button>
                    </form>
                </div>

                <div className="glass-panel">
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Contatti Salvati</h3>
                    {loadingContacts ? (
                        <p>Caricamento...</p>
                    ) : contacts.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {contacts.map(contact => (
                                <div
                                    key={contact.id}
                                    onClick={() => selectContact(contact)}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--glass-border)',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                >
                                    <div style={{ fontWeight: '600' }}>{contact.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {contact.phoneNumber} • {contact.operator}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            Nessun contatto salvato.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhoneTopUp;
