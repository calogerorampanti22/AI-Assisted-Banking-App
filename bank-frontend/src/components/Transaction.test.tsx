import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Transaction from './Transaction';
import React from 'react';

describe('Transaction Component', () => {
    const mockFullTransactions: any[] = [
        { id: '1', type: 'OUT', amount: 100, category: 'Food', date: '2023-01-01T10:00:00', description: 'Grocery', relatedAccountNumber: 'ACC1' },
    ];

    it('renders transactions correctly', () => {
        render(<Transaction transactions={mockFullTransactions} />);
        expect(screen.getByText('Grocery')).toBeDefined();
        expect(screen.getByText('FOOD')).toBeDefined();
        expect(screen.getByText('- €100.00')).toBeDefined();
    });

    it('renders empty message when no transactions', () => {
        render(<Transaction transactions={[]} />);
        expect(screen.getByText('Nessuna transazione trovata.')).toBeDefined();
    });
});
