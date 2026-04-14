import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Bollettino: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showScanner, setShowScanner] = useState(false);
    const navigate = useNavigate();

    // Form states
    const [amount, setAmount] = useState('');
    const [billerName, setBillerName] = useState('');
    const [billReferenceNumber, setBillReferenceNumber] = useState('');
    const [description, setDescription] = useState('');

    const handleScan = (result: any) => {
        if (result && result.length > 0) {
            const scannedText = result[0].rawValue;
            console.log("Scanned QR Bollettino:", scannedText);
            setBillerName('Poste Italiane / Ente');
            setBillReferenceNumber(scannedText.substring(0, 12));
            setAmount('120.00'); // Importo fittizio
            setDescription('Bollettino Precompilato');
            setShowScanner(false);
            setSuccess('Codice QR Scansionato con successo!');
            setTimeout(() => setSuccess(null), 3000);
        }
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const parsedAmount = parseFloat(amount.replace(',', '.'));
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                throw new Error("Inserisci un importo valido.");
            }

            const payload = {
                amount: parsedAmount,
                billerName,
                billReferenceNumber,
                description,
                type: 'BOLLETTINO'
            };

            await api.post('/transactions/pay-bill', payload);
            setSuccess('Pagamento Bollettino effettuato con successo!');
            setTimeout(() => navigate('/dashboard'), 2500);
        } catch (err: any) {
            setError(err.response?.data || err.message || 'Errore durante il pagamento.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button onClick={() => navigate('/payments')} className="btn" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                    <i className="bi bi-arrow-left"></i>
                </button>
                <h2 style={{ margin: 0 }}>Bollettino Postale</h2>
            </div>

            <div className="glass-panel">
                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', padding: '10px', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>{error}</div>}
                {success && <div style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center', padding: '10px', background: 'rgba(0,255,0,0.1)', borderRadius: '8px' }}>{success}</div>}

                <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowScanner(!showScanner)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', gap: '10px' }}
                    >
                        <i className={`bi ${showScanner ? 'bi-x-circle' : 'bi-qr-code-scan'}`}></i>
                        {showScanner ? 'Chiudi Fotocamera' : 'Scansiona Bollettino'}
                    </button>

                    {showScanner && (
                        <div style={{ marginTop: '1.5rem', width: '100%', maxWidth: '400px', margin: '1.5rem auto 0 auto', borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--primary-color)' }}>
                            <Scanner onScan={handleScan} />
                        </div>
                    )}
                </div>

                <form onSubmit={handlePayment}>
                    <div style={{ display: 'flex', gap: '1.5rem', flexDirection: "column" }}>
                        <div className="form-group">
                            <label className="form-label">Intestatario</label>
                            <input
                                type="text"
                                className="form-control"
                                value={billerName}
                                onChange={(e) => setBillerName(e.target.value)}
                                placeholder="Es. Poste Italiane SpA"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Codice Bollettino (12 o 18 cifre)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={billReferenceNumber}
                                onChange={(e) => setBillReferenceNumber(e.target.value)}
                                placeholder="123456789012"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Importo (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                required
                                style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Causale</label>
                            <input
                                type="text"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Causale del versamento"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Elaborazione in corso...' : `Paga ${amount ? '€' + amount : ''}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Bollettino;
