import { useState, useEffect } from 'react';
import api from '../api';

export interface LoginHistoryEntry {
    id: number;
    loginDate: string;
    ipAddress: string;
}

export const useLoginHistory = () => {
    const [history, setHistory] = useState<LoginHistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await api.get<LoginHistoryEntry[]>('/login-history');
            setHistory(res.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Impossibile caricare la cronologia degli accessi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return { history, loading, error, refresh: fetchHistory };
};
