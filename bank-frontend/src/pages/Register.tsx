import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import PasswordField from '../components/PasswordField';

const Register: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nationality, setNationality] = useState('');
    const [birthday, setBirthday] = useState('');
    const [birthPlace, setBirthPlace] = useState('');
    const [idCardNumber, setIdCardNumber] = useState('');
    const [taxId, setTaxId] = useState('');
    const [initialDeposit, setInitialDeposit] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const nationalities = [
        "", "Italia", "Stati Uniti", "Gran Bretagna", "Francia", "Germania", "Spagna", "Canada", "Australia", "Other"
    ];

    const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Le password non corrispondono.');
            return;
        }

        if (birthday) {
            const birthDate = new Date(birthday);
            const today = new Date();
            const ageCalc = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const isUnderage = ageCalc < 18 || (ageCalc === 18 && (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())));
            if (isUnderage) {
                setError('Devi avere almeno 18 anni per registrarti.');
                return;
            }
        }

        if (Number.parseFloat(initialDeposit) < 0) {
            setError('Il deposito iniziale non può essere negativo.');
            return;
        }

        try {
            await api.post('/auth/register', {
                password,
                email,
                firstName,
                lastName,
                nationality,
                birthday,
                birthPlace,
                idCardNumber,
                taxId,
                initialDeposit: Number.parseFloat(initialDeposit) || 0
            });
            setSuccess('Registrazione avvenuca con successo! Reindirizzamento in corso...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data || 'Errore durante la registrazione.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Join <span>BankingApp</span></h2>

                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                {success && <div style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}

                <form onSubmit={handleRegister}>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <PasswordField
                        id="password"
                        label="Password"
                        value={password}
                        onChange={setPassword}
                        required
                    />

                    <PasswordField
                        id="confirmPassword"
                        label="Conferma Password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        required
                    />

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label" htmlFor="firstName">Nome</label>
                            <input
                                id="firstName"
                                type="text"
                                className="form-control"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label" htmlFor="lastName">Cognome</label>
                            <input
                                id="lastName"
                                type="text"
                                className="form-control"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label" htmlFor="nationality">Nazionalità</label>
                            <select
                                id="nationality"
                                className="form-control"
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}
                                required
                            >
                                {nationalities.map((n) => (
                                    <option key={n} value={n}>{n || "Seleziona..."}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label" htmlFor="birthday">Data di nascita</label>
                            <input
                                id="birthday"
                                type="date"
                                className="form-control"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label" htmlFor="birthPlace">Luogo di nascita</label>
                            <input
                                id="birthPlace"
                                type="text"
                                className="form-control"
                                value={birthPlace}
                                onChange={(e) => setBirthPlace(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label" htmlFor="idCardNumber">Numero Documento</label>
                            <input
                                id="idCardNumber"
                                type="text"
                                className="form-control"
                                value={idCardNumber}
                                onChange={(e) => setIdCardNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label" htmlFor="taxId">Codice Fiscale</label>
                            <input
                                id="taxId"
                                type="text"
                                className="form-control"
                                value={taxId}
                                onChange={(e) => setTaxId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label" htmlFor="initialDeposit">Deposito iniziale (€)</label>
                            <input
                                id="initialDeposit"
                                type="number"
                                className="form-control"
                                value={initialDeposit}
                                onChange={(e) => setInitialDeposit(e.target.value)}
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Registrati
                    </button>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Hai già un account? </span>
                        <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>
                            Accedi
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
