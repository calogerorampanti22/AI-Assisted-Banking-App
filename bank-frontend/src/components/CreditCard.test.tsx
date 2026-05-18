import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CreditCard from './CreditCard';
import React from 'react';

// Mock the CSS modules if any, but since we use global styles here it's fine.

describe('CreditCard Component', () => {
    const mockCard: any = {
        id: '1',
        pan: '1234567812345678',
        cardHolder: 'MARIO ROSSI',
        expirationDate: '2025-12-01',
        type: 'CREDIT',
        network: 'VISA',
        frozen: false,
        cvv: '123'
    };

    const mockToggleFreeze = vi.fn();

    it('renders card type correctly', () => {
        render(<CreditCard card={mockCard} onToggleFreeze={mockToggleFreeze} />);
        expect(screen.getByText('CREDIT')).toBeDefined();
    });

    it('renders masked card number by default', () => {
        render(<CreditCard card={mockCard} onToggleFreeze={mockToggleFreeze} />);
        expect(screen.getByText(/•••• •••• •••• 5678/)).toBeDefined();
    });

    it('shows full pan when toggle button is clicked', () => {
        render(<CreditCard card={mockCard} onToggleFreeze={mockToggleFreeze} />);
        const toggleBtn = screen.getByTitle('Mostra PAN');
        fireEvent.click(toggleBtn);
        expect(screen.getByText(/1234 5678 1234 5678/)).toBeDefined();
    });
});
