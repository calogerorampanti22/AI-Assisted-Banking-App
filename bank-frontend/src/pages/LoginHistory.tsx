import React from 'react';
import { useLoginHistory } from '../hooks/useLoginHistory';

const LoginHistory: React.FC = () => {
    const { history, loading, error } = useLoginHistory();

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Caricamento cronologia...</div>;
    if (error) return <div style={{ color: 'var(--danger)', textAlign: 'center', marginTop: '2rem' }}>{error}</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
            <section className="glass-panel" aria-label="Cronologia Accessi">
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="bi bi-shield-lock-fill" style={{ color: 'var(--success)' }}></span>
                    {' '}Cronologia Accessi
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Monitora gli ultimi accessi al tuo account per garantire la massima sicurezza.
                </p>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Data e Ora</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Indirizzo IP</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Stato</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? history.map((entry) => (
                                <tr key={entry.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        {new Date(entry.loginDate).toLocaleString('it-IT', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}
                                    </td>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace' }}>
                                        {entry.ipAddress}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            color: 'var(--success)',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}>
                                            Successo
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                        Nessun accesso registrato.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default LoginHistory;
