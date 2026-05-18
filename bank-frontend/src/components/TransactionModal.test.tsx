import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TransactionModal from './TransactionModal';
import React from 'react';

describe('TransactionModal Component', () => {
    const mockTransaction: any = {
        id: '1',
        amount: 100.5,
        type: 'OUT',
        description: 'Test payment',
        date: '2023-01-01T10:00:00',
        category: 'FOOD',
        relatedAccountNumber: 'IT1234567890'
    };

    const mockOnClose = vi.fn();

    it('renders transaction details correctly', () => {
        render(<TransactionModal transaction={mockTransaction} isOpen={true} onClose={mockOnClose} />);
        expect(screen.getByText('Test payment')).toBeDefined();
        // Euro format might use comma or dot depending on locale, let's use regex or just part of it
        expect(screen.getByText(/100/)).toBeDefined();
        expect(screen.getByText('FOOD')).toBeDefined();
    });

    it('calls onClose when close button clicked', () => {
        render(<TransactionModal transaction={mockTransaction} isOpen={true} onClose={mockOnClose} />);
        const closeBtn = screen.getByLabelText('Chiudi');
        fireEvent.click(closeBtn);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('does not render when transaction is null', () => {
        const { queryByText } = render(<TransactionModal transaction={null} isOpen={true} onClose={mockOnClose} />);
        expect(queryByText('Dettagli Transazione')).toBeNull();
    });

    it('does not render when isOpen is false', () => {
        const { queryByText } = render(<TransactionModal transaction={mockTransaction} isOpen={false} onClose={mockOnClose} />);
        expect(queryByText('Dettagli Transazione')).toBeNull();
    });
});
