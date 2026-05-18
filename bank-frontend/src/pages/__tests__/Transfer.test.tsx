import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Transfer from '../Transfer';
import React from 'react';
import { useBeneficiaries } from '../../hooks/useBeneficiaries';
import api from '../../api';
import { BrowserRouter } from 'react-router-dom';

// Mock mocks
vi.mock('../../hooks/useBeneficiaries');
vi.mock('../../api');

describe('Transfer Page', () => {
    const mockAddBeneficiary = vi.fn();
    const mockDeleteBeneficiary = vi.fn();
    const mockBeneficiaries = [
        { id: 1, firstName: 'Mario', lastName: 'Rossi', iban: 'IT001' }
    ];

    beforeEach(() => {
        vi.mocked(useBeneficiaries).mockReturnValue({
            beneficiaries: mockBeneficiaries,
            addBeneficiary: mockAddBeneficiary,
            deleteBeneficiary: mockDeleteBeneficiary,
            loading: false,
            error: null
        });
    });

    it('renders beneficiaries list and form', () => {
        render(
            <BrowserRouter>
                <Transfer />
            </BrowserRouter>
        );
        expect(screen.getByText('Mario Rossi')).toBeDefined();
        expect(screen.getByLabelText('Importo (€)')).toBeDefined();
    });

    it('prefills form when beneficiary is clicked', () => {
        render(
            <BrowserRouter>
                <Transfer />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText('Mario Rossi'));
        expect(screen.getByLabelText('Nome Beneficiario')).toHaveValue('Mario');
        expect(screen.getByLabelText('Cognome Beneficiario')).toHaveValue('Rossi');
        expect(screen.getByLabelText('IBAN Destinatario')).toHaveValue('IT001');
    });

    it('submits transfer successfully', async () => {
        vi.mocked(api.post).mockResolvedValue({ data: {} });
        render(
            <BrowserRouter>
                <Transfer />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Importo (€)'), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText('Nome Beneficiario'), { target: { value: 'Luigi' } });
        fireEvent.change(screen.getByLabelText('Cognome Beneficiario'), { target: { value: 'Verdi' } });
        fireEvent.change(screen.getByLabelText('IBAN Destinatario'), { target: { value: 'IT002' } });

        fireEvent.click(screen.getByText('Conferma Bonifico'));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/transactions/transfer', expect.objectContaining({
                amount: '100',
                recipientFirstName: 'Luigi'
            }));
            expect(screen.getByText('Bonifico effettuato correttamente')).toBeDefined();
        });
    });

    it('saves beneficiary to address book', async () => {
        render(
            <BrowserRouter>
                <Transfer />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Nome Beneficiario'), { target: { value: 'Luigi' } });
        fireEvent.change(screen.getByLabelText('Cognome Beneficiario'), { target: { value: 'Verdi' } });
        fireEvent.change(screen.getByLabelText('IBAN Destinatario'), { target: { value: 'IT002' } });

        fireEvent.click(screen.getByText('📋 Salva in rubrica'));

        expect(mockAddBeneficiary).toHaveBeenCalledWith('Luigi', 'Verdi', 'IT002');
    });
});
