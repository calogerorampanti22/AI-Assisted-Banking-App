import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PhoneTopUp from '../PhoneTopUp';
import React from 'react';
import { usePhoneTopUp } from '../../hooks/usePhoneTopUp';
import { useNavigate } from 'react-router-dom';

// Mock hooks
vi.mock('../../hooks/usePhoneTopUp');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn()
    };
});

describe('PhoneTopUp Page', () => {
    const mockTopUp = vi.fn();
    const mockNavigate = vi.fn();
    const mockContacts = [
        { id: 1, name: 'Mamma', phoneNumber: '3331234567', operator: 'TIM' }
    ];

    beforeEach(() => {
        vi.mocked(usePhoneTopUp).mockReturnValue({
            contacts: mockContacts,
            topUp: mockTopUp,
            loading: false,
            error: null
        });
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    });

    it('renders contacts and form', () => {
        render(<PhoneTopUp />);
        expect(screen.getByText('Mamma')).toBeDefined();
        expect(screen.getByLabelText('Numero di Telefono')).toBeDefined();
    });

    it('selects a contact correctly', () => {
        render(<PhoneTopUp />);
        fireEvent.click(screen.getByText('Mamma'));
        expect(screen.getByLabelText('Numero di Telefono')).toHaveValue('3331234567');
        expect(screen.getByLabelText('Operatore')).toHaveValue('TIM');
    });

    it('submits top up successfully', async () => {
        mockTopUp.mockResolvedValue({ success: true });
        render(<PhoneTopUp />);

        fireEvent.change(screen.getByLabelText('Numero di Telefono'), { target: { value: '3339999999' } });
        fireEvent.change(screen.getByLabelText('Operatore'), { target: { value: 'Vodafone' } });
        fireEvent.click(screen.getByText('€20'));

        fireEvent.click(screen.getByText('Conferma Ricarica'));

        await waitFor(() => {
            expect(mockTopUp).toHaveBeenCalledWith(expect.objectContaining({
                phoneNumber: '3339999999',
                operator: 'Vodafone',
                amount: 20
            }));
            expect(screen.getByText('Ricarica Effettuata!')).toBeDefined();
        });
    });

    it('shows error when top up fails', async () => {
        mockTopUp.mockResolvedValue({ success: false, message: 'Saldo insufficiente' });
        render(<PhoneTopUp />);

        fireEvent.change(screen.getByLabelText('Numero di Telefono'), { target: { value: '3339999999' } });
        fireEvent.change(screen.getByLabelText('Operatore'), { target: { value: 'Vodafone' } });
        fireEvent.click(screen.getByText('€20'));

        fireEvent.click(screen.getByText('Conferma Ricarica'));

        await waitFor(() => {
            expect(screen.getByText('Saldo insufficiente')).toBeDefined();
        });
    });
});
