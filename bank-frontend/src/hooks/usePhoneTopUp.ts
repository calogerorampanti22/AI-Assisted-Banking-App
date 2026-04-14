import { useState, useEffect } from 'react';
import api from '../api';

export interface PhoneContact {
    id: number;
    name: string;
    phoneNumber: string;
    operator: string;
}

export interface TopUpRequest {
    phoneNumber: string;
    operator: string;
    amount: number;
    saveContact: boolean;
    contactName?: string;
}

export const usePhoneTopUp = () => {
    const [contacts, setContacts] = useState<PhoneContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = await api.get<PhoneContact[]>('/phone-topups/contacts');
            setContacts(res.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Impossibile caricare i contatti salvati.');
        } finally {
            setLoading(false);
        }
    };

    const topUp = async (request: TopUpRequest) => {
        try {
            await api.post('/phone-topups', request);
            fetchContacts();
            return { success: true };
        } catch (err: any) {
            console.error(err);
            return {
                success: false,
                message: err.response?.data || 'Errore durante la ricarica.'
            };
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return { contacts, loading, error, topUp, refreshContacts: fetchContacts };
};
