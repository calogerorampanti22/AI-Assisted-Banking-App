import { useState, useEffect } from 'react';
import api from '../api';

export interface SavingsGoal {
    id: number;
    name: string;
    targetAmount: number;
    currentAmount: number;
}

export const useSavingsGoals = () => {
    const [goals, setGoals] = useState<SavingsGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const res = await api.get<SavingsGoal[]>('/savings-goals');
            setGoals(res.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Errore durante il caricamento dei salvadanai.');
        } finally {
            setLoading(false);
        }
    };

    const createGoal = async (name: string, targetAmount: number) => {
        try {
            await api.post('/savings-goals', { name, targetAmount });
            fetchGoals();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const deposit = async (id: number, amount: number) => {
        try {
            await api.post(`/savings-goals/${id}/deposit`, { amount });
            fetchGoals();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const withdraw = async (id: number, amount: number) => {
        try {
            await api.post(`/savings-goals/${id}/withdraw`, { amount });
            fetchGoals();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const deleteGoal = async (id: number) => {
        try {
            await api.delete(`/savings-goals/${id}`);
            fetchGoals();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    return { goals, loading, error, createGoal, deposit, withdraw, deleteGoal, refresh: fetchGoals };
};
