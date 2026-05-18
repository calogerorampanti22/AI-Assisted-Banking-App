import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '../Dashboard';
import React from 'react';
import { useAccounts } from '../../hooks/useAccounts';

// Mock the hook
vi.mock('../../hooks/useAccounts');

describe('Dashboard Page', () => {
    const mockUseAccounts = {
        account: {
            user: { firstName: 'Mario', lastName: 'Rossi' },
            accountNumber: 'IT123456789',
            balance: 1000.50
        },
        transactions: [],
        cards: [],
        filters: { startDate: '', endDate: '', type: '' },
        loading: false,
        error: null,
        handleFilterChange: vi.fn(),
        requestNewCard: vi.fn(),
        toggleCardFreeze: vi.fn()
    };

    it('renders user greeting and balance', () => {
        vi.mocked(useAccounts).mockReturnValue(mockUseAccounts);
        render(<Dashboard />);
        expect(screen.getByText(/Bentornato, Mario Rossi/)).toBeDefined();
        expect(screen.getByText(/IT123456789/)).toBeDefined();
        expect(screen.getByText(/1.000,50/)).toBeDefined();
    });

    it('shows loading state', () => {
        vi.mocked(useAccounts).mockReturnValue({ ...mockUseAccounts, loading: true });
        render(<Dashboard />);
        expect(screen.getByText(/Caricamento in corso.../)).toBeDefined();
    });

    it('shows error message', () => {
        vi.mocked(useAccounts).mockReturnValue({ ...mockUseAccounts, error: 'Errore di test' });
        render(<Dashboard />);
        expect(screen.getByText('Errore di test')).toBeDefined();
    });

    it('opens request card modal when button clicked', () => {
        vi.mocked(useAccounts).mockReturnValue(mockUseAccounts);
        render(<Dashboard />);
        const btn = screen.getByText('+ Richiedi Carta');
        fireEvent.click(btn);
        expect(screen.getByText('Richiedi Nuova Carta')).toBeDefined();
    });

    it('submits new card request', async () => {
        vi.mocked(useAccounts).mockReturnValue(mockUseAccounts);
        render(<Dashboard />);
        fireEvent.click(screen.getByText('+ Richiedi Carta'));
        
        fireEvent.change(screen.getByLabelText('Tipo di Carta'), { target: { value: 'CREDIT' } });
        fireEvent.change(screen.getByLabelText('Circuito'), { target: { value: 'VISA' } });
        
        fireEvent.click(screen.getByText('Conferma Richiesta'));
        expect(mockUseAccounts.requestNewCard).toHaveBeenCalledWith('CREDIT', 'VISA');
    });
});
