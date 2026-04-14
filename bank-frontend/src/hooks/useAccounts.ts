import { useState, useEffect } from "react";
import api from '../api';

//Definizione dell'interfaccia User
export interface User {
    firstName: string;
    lastName: string;
    username: string
}

//Definizione dell'interfaccia Account
export interface Account {
    id: number;
    accountNumber: string;
    balance: number;
    user: User;
}

//Definizione dell'interfaccia Transaction
export interface Transaction {
    id: number;
    date: string;
    description: string;
    type: 'IN' | 'OUT';
    amount: number;
    relatedAccountNumber: string;
    recipientFirstName: string;
    recipientLastName: string;
    category: string;
}

//Definizione dell'interfaccia Carta
export interface Card {
    id: string;
    type: 'CREDIT' | 'DEBIT' | 'PREPAID';
    network: 'VISA' | 'MASTERCARD';
    pan: string;
    expirationDate: string;
    cvv: number;
    cardholderName: string;
    color: string;
    frozen: boolean;
}

//Definizione dell'interfaccia Filters
export interface Filters {
    startDate: string;
    endDate: string;
    type: string;
}

//Creazione del custom hook
export const useAccounts = () => {
    //Tipizzazione degli state in base alle interfacce
    const [account, setAccount] = useState<Account | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [filters, setFilters] = useState<Filters>({ startDate: '', endDate: '', type: '' });

    //Stati utili per UI loading e gestione errori
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAccount = async () => {
        try {
            const res = await api.get<Account>('/accounts/me');
            setAccount(res.data);
        } catch (err) {
            console.error(err);
            setError('Impossibile recuperare i dettagli del conto');
        }
    };

    const fetchTransactions = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.type) params.append('type', filters.type);

            const res = await api.get<Transaction[]>(`/transactions?${params.toString()}`);
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
            setError('Impossibile recuperare le transazioni');
        }
    };

    const fetchCard = async () => {
        try {
            const res = await api.get<Card[]>('/cards');
            setCards(res.data);
        } catch (err) {
            console.error(err);
            setError('Impossibile recuperare le carte');
        }
    };

    //Funzione che effettua le fetch ogni volta che cambiano i filtri
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchAccount();
            await fetchTransactions();
            await fetchCard();
            setLoading(false);
        };

        loadData();
    }, [filters]);

    //Tipizzazione dell'evento del cambio filtro
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    //Aggiorna i nomi fittizi se cambiano i dati dell'account
    useEffect(() => {
        if (account?.user) {
            setCards(prevCards => prevCards.map(c => ({
                ...c,
                cardholderName: `${account.user.firstName} ${account.user.lastName}`.toUpperCase()
            })));
        }
    }, [account]);

    const requestNewCard = async (type: string, network: string) => {
        try {
            setLoading(true);
            const res = await api.post<Card>('/cards', { type, network });
            setCards(prevCards => [...prevCards, {
                ...res.data,
                cardholderName: account?.user ? `${account.user.firstName} ${account.user.lastName}`.toUpperCase() : ''
            }]);
        } catch (err) {
            console.error(err);
            setError('Impossibile richiedere una nuova carta');
        } finally {
            setLoading(false);
        }
    };

    const toggleCardFreeze = async (cardId: string, currentFrozenStatus: boolean) => {
        try {
            const endpoint = currentFrozenStatus ? `/cards/${cardId}/unfreeze` : `/cards/${cardId}/freeze`;
            const res = await api.put<Card>(endpoint);
            setCards(prevCards => prevCards.map(c =>
                c.id === cardId ? { ...c, frozen: res.data.frozen } : c
            ));
        } catch (err) {
            console.error(err);
            setError('Impossibile modificare lo stato della carta.');
        }
    };


    //Esportazione dei dati e delle funzioni che la Dashboard userà
    return {
        account,
        transactions,
        cards,
        filters,
        loading,
        error,
        handleFilterChange,
        requestNewCard,
        toggleCardFreeze
    };
}