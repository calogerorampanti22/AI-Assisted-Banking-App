import { useState, useEffect, useCallback } from 'react';
import api from '../api';

export interface Beneficiary {
    id: number;
    firstName: string;
    lastName: string;
    iban: string;
}

export const useBeneficiaries = () => {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBeneficiaries = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get<Beneficiary[]>('/beneficiaries');
            setBeneficiaries(res.data);
        } catch (err) {
            setError('Impossibile caricare la rubrica');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBeneficiaries();
    }, [fetchBeneficiaries]);

    const addBeneficiary = async (firstName: string, lastName: string, iban: string) => {
        try {
            const res = await api.post<Beneficiary>('/beneficiaries', { firstName, lastName, iban });
            setBeneficiaries(prev => [...prev, res.data]);
            return res.data;
        } catch (err) {
            setError('Impossibile aggiungere il beneficiario');
            throw err;
        }
    };

    const deleteBeneficiary = async (id: number) => {
        try {
            await api.delete(`/beneficiaries/${id}`);
            setBeneficiaries(prev => prev.filter(b => b.id !== id));
        } catch (err) {
            setError('Impossibile eliminare il beneficiario');
            throw err;
        }
    };

    return { beneficiaries, loading, error, addBeneficiary, deleteBeneficiary, refetch: fetchBeneficiaries };
};
