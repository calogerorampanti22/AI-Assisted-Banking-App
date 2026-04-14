import React, { useState, useEffect } from 'react';
import api from '../api';
import ReactCountryFlag from 'react-country-flag';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    nationality: string;
    age: number;
    birthday: string;
    birthPlace: string;
    idCardNumber: string;
    taxId: string;
}

const nationalityToCode: Record<string, string> = {
    'Italia': 'IT',
    'Stati Uniti': 'US',
    'Gran Bretagna': 'GB',
    'Francia': 'FR',
    'Germania': 'DE',
    'Spagna': 'ES',
    'Canada': 'CA',
    'Australia': 'AU',
};

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/me');
                setProfile(res.data);
            } catch (err) {
                console.error("Errore nel recupero del profilo", err);
                setError("Impossibile caricare i dati del profilo.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        if (newPassword !== confirmPassword) {
            setPasswordError("Le nuove password non combaciano.");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("La nuova password deve essere di almeno 6 caratteri.");
            return;
        }

        setIsUpdating(true);

        try {
            const res = await api.put('/users/me/password', {
                oldPassword,
                newPassword
            });

            setPasswordSuccess("Password aggiornata con successo! Al prossimo login dovrai usare la nuova password.");
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.error) {
                setPasswordError(err.response.data.error);
            } else {
                setPasswordError("Errore durante l'aggiornamento della password. Verifica la vecchia password e riprova.");
            }
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Caricamento in corso...</div>;
    }

    if (error) {
        return <div style={{ color: 'var(--danger)', textAlign: 'center', marginTop: '50px' }}>{error}</div>;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>Il mio Profilo</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Informazioni Personali</h3>
                    {profile && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                <strong style={{ color: 'var(--text-secondary)' }}>Nome:</strong> <span>{profile.firstName}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                <strong style={{ color: 'var(--text-secondary)' }}>Cognome:</strong> <span>{profile.lastName}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                <strong style={{ color: 'var(--text-secondary)' }}>Email:</strong> <span>{profile.email}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                <strong style={{ color: 'var(--text-secondary)' }}>Data di nascita:</strong> <span>{profile.birthday ? profile.birthday.split('-').reverse().join('/') : '-'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                <strong style={{ color: 'var(--text-secondary)' }}>Luogo di nascita:</strong> <span>{profile.birthPlace}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                <strong style={{ color: 'var(--text-secondary)' }}>Nazionalità:</strong> <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>{profile.nationality}{nationalityToCode[profile.nationality] && <ReactCountryFlag countryCode={nationalityToCode[profile.nationality]} svg style={{ width: '1.3em', height: '1.3em', borderRadius: '2px' }} />}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                <strong style={{ color: 'var(--text-secondary)' }}>Codice Fiscale:</strong> <span>{profile.taxId}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                <strong style={{ color: 'var(--text-secondary)' }}>Carta d'Identità:</strong> <span>{profile.idCardNumber}</span>
                            </div>
                        </div>
                    )}
                    <div style={{ marginTop: 'auto', paddingTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center' }}>
                        <i className="bi bi-info-circle" style={{ marginRight: '0.5rem' }}></i>
                        Per modificare questi dati, contatta l'assistenza clienti al numero verde o recati in filiale.
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Cambio Password</h3>
                    {passwordSuccess && (
                        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            {passwordSuccess}
                        </div>
                    )}
                    {passwordError && (
                        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            {passwordError}
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
                        <div>
                            <label className="form-label">Vecchia Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showOldPassword ? "text" : "password"}
                                    className="form-control"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                    style={{ paddingRight: '2.5rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <i className={showOldPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="form-label">Nuova Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    className="form-control"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    style={{ paddingRight: '2.5rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <i className={showNewPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="form-label">Conferma Nuova Password</label>
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
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                </button>
                            </div>
                        </div>
                        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Aggiornamento in corso...' : 'Cambia Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="glass-panel" style={{ marginTop: '2rem' }}>
                <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Sicurezza</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <strong>Cronologia Accessi</strong>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Visualizza gli ultimi login effettuati sul tuo account.</p>
                    </div>
                    <button className="btn" onClick={() => navigate('/login-history')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>
                        Visualizza Cronologia
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
