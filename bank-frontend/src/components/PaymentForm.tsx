import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import api from '../api';
import { useNavigate } from 'react-router-dom';

interface PaymentFormProps {
    type: 'BOLLETTINO' | 'PAGOPA';
    title: string;
    descriptionPlaceholder: string;
    billerLabel: string;
    billerPlaceholder: string;
    referenceLabel: string;
    referencePlaceholder: string;
    scanButtonLabel: string;
    successMessage: string;
    onScan?: (text: string) => { biller: string; reference: string; amount: string; description: string };
}

const PaymentForm: React.FC<PaymentFormProps> = ({
    type,
    title,
    descriptionPlaceholder,
    billerLabel,
    billerPlaceholder,
    referenceLabel,
    referencePlaceholder,
    scanButtonLabel,
    successMessage,
    onScan
}) => {
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
        if (result && result.length > 0 && onScan) {
            const scannedText = result[0].rawValue;
            const data = onScan(scannedText);
            setBillerName(data.biller);
            setBillReferenceNumber(data.reference);
            setAmount(data.amount);
            setDescription(data.description);
            setShowScanner(false);
            setSuccess('Codice QR Scansionato con successo!');
            setTimeout(() => setSuccess(null), 3000);
        }
    };

    const handlePayment = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const parsedAmount = Number.parseFloat(amount.replace(',', '.'));
            if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
                throw new Error("Inserisci un importo valido.");
            }

            const payload = {
                amount: parsedAmount,
                billerName,
                billReferenceNumber,
                description,
                type
            };

            await api.post('/transactions/pay-bill', payload);
            setSuccess(successMessage);
            setTimeout(() => navigate('/dashboard'), 2500);
        } catch (err: any) {
            setError(err.response?.data || err.message || 'Errore durante il pagamento.');
        } finally {
            setLoading(false);
        }
    };

    const getButtonText = () => {
        if (loading) return 'Elaborazione in corso...';
        if (amount) return `Paga €${amount}`;
        return 'Paga';
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button onClick={() => navigate('/payments')} className="btn" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                    <span className="bi bi-arrow-left"></span>
                </button>
                <h2 style={{ margin: 0 }}>{title}</h2>
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
                        <span className={`bi ${showScanner ? 'bi-x-circle' : 'bi-qr-code-scan'}`}></span>
                        {showScanner ? 'Chiudi Fotocamera' : scanButtonLabel}
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
                            <label className="form-label" htmlFor="billerName">{billerLabel}</label>
                            <input
                                id="billerName"
                                type="text"
                                className="form-control"
                                value={billerName}
                                onChange={(e) => setBillerName(e.target.value)}
                                placeholder={billerPlaceholder}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="billReferenceNumber">{referenceLabel}</label>
                            <input
                                id="billReferenceNumber"
                                type="text"
                                className="form-control"
                                value={billReferenceNumber}
                                onChange={(e) => setBillReferenceNumber(e.target.value)}
                                placeholder={referencePlaceholder}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="amountInput">Importo (€)</label>
                            <input
                                id="amountInput"
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
                            <label className="form-label" htmlFor="description">Causale</label>
                            <input
                                id="description"
                                type="text"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={descriptionPlaceholder}
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
                        {getButtonText()}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;
