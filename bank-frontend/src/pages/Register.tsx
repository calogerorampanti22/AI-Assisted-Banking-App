import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    const handleRegister = async (e: React.FormEvent) => {
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

        if (parseFloat(initialDeposit) < 0) {
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
                initialDeposit: parseFloat(initialDeposit) || 0
            });
            setSuccess('Registrazione avvenuta con successo! Reindirizzamento in corso...');
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
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                style={{ paddingRight: '2.5rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Conferma Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                style={{ paddingRight: '2.5rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Nome</label>
                            <input
                                type="text"
                                className="form-control"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Cognome</label>
                            <input
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
                            <label className="form-label">Nazionalità</label>
                            <select
                                className="form-control"
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}
                                required
                            >
                                {nationalities.map(nat => (
                                    <option key={nat} value={nat}>{nat === "" ? "Seleziona nazionalità" : nat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Data di nascita</label>
                            <input
                                type="date"
                                className="form-control"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Luogo di nascita</label>
                            <input
                                type="text"
                                className="form-control"
                                value={birthPlace}
                                onChange={(e) => setBirthPlace(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">ID Carta d'Identità</label>
                            <input
                                type="text"
                                className="form-control"
                                value={idCardNumber}
                                onChange={(e) => setIdCardNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Codice Fiscale</label>
                            <input
                                type="text"
                                className="form-control"
                                value={taxId}
                                onChange={(e) => setTaxId(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Deposito iniziale (€)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={initialDeposit}
                            onChange={(e) => setInitialDeposit(e.target.value)}
                            required
                            min="0"
                            step="0.01"
                        />
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
