import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PaymentForm from './PaymentForm';
import React from 'react';
import api from '../api';
import { BrowserRouter } from 'react-router-dom';

// Mock the API and Router
vi.mock('../api');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('PaymentForm Component', () => {
    const defaultProps: any = {
        type: 'BOLLETTINO',
        title: 'Test Payment',
        descriptionPlaceholder: 'Desc',
        billerLabel: 'Biller',
        billerPlaceholder: 'Biller Place',
        referenceLabel: 'Ref',
        referencePlaceholder: 'Ref Place',
        scanButtonLabel: 'Scan Me',
        successMessage: 'Success!',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders form fields correctly', () => {
        render(
            <BrowserRouter>
                <PaymentForm {...defaultProps} />
            </BrowserRouter>
        );
        expect(screen.getByText('Test Payment')).toBeDefined();
        expect(screen.getByLabelText('Biller')).toBeDefined();
        expect(screen.getByLabelText('Ref')).toBeDefined();
    });

    it('submits form correctly', async () => {
        vi.mocked(api.post).mockResolvedValue({ data: {} });

        render(
            <BrowserRouter>
                <PaymentForm {...defaultProps} />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Biller'), { target: { value: 'Test Biller' } });
        fireEvent.change(screen.getByLabelText('Ref'), { target: { value: '12345' } });
        fireEvent.change(screen.getByLabelText('Importo (€)'), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText('Causale'), { target: { value: 'Test Reason' } });

        fireEvent.click(screen.getByRole('button', { name: /Paga/ }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/transactions/pay-bill', expect.objectContaining({
                amount: 100,
                billerName: 'Test Biller',
                type: 'BOLLETTINO'
            }));
        });
    });
});
