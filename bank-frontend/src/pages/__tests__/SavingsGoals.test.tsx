import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SavingsGoals from '../SavingsGoals';
import React from 'react';
import { useSavingsGoals } from '../../hooks/useSavingsGoals';

// Mock hooks
vi.mock('../../hooks/useSavingsGoals');

describe('SavingsGoals Page', () => {
    const mockCreateGoal = vi.fn();
    const mockDeposit = vi.fn();
    const mockWithdraw = vi.fn();
    const mockDeleteGoal = vi.fn();
    const mockGoals = [
        { id: 1, name: 'Vacanza', currentAmount: 100, targetAmount: 1000 }
    ];

    beforeEach(() => {
        vi.mocked(useSavingsGoals).mockReturnValue({
            goals: mockGoals,
            loading: false,
            error: null,
            createGoal: mockCreateGoal,
            deposit: mockDeposit,
            withdraw: mockWithdraw,
            deleteGoal: mockDeleteGoal
        });
        // Mock window.confirm
        globalThis.confirm = vi.fn(() => true);
    });

    it('renders goals correctly', () => {
        render(<SavingsGoals />);
        expect(screen.getByText('Vacanza')).toBeDefined();
        expect(screen.getByText('10,0%')).toBeDefined();
    });

    it('opens create modal and submits new goal', async () => {
        mockCreateGoal.mockResolvedValue(true);
        render(<SavingsGoals />);
        
        fireEvent.click(screen.getByText('Nuovo Obiettivo'));
        
        fireEvent.change(screen.getByLabelText('Nome Obiettivo'), { target: { value: 'Auto' } });
        fireEvent.change(screen.getByLabelText('Somma da Raggiungere (€)'), { target: { value: '5000' } });
        
        fireEvent.click(screen.getByText('Crea'));
        
        expect(mockCreateGoal).toHaveBeenCalledWith('Auto', 5000);
    });

    it('deposits funds into a goal', async () => {
        mockDeposit.mockResolvedValue(true);
        render(<SavingsGoals />);
        
        fireEvent.click(screen.getByText('Deposita'));
        
        fireEvent.change(screen.getByLabelText('Importo (€)'), { target: { value: '50' } });
        fireEvent.click(screen.getByText('Conferma Deposito'));
        
        expect(mockDeposit).toHaveBeenCalledWith(1, 50);
    });

    it('deletes a goal after confirmation', async () => {
        render(<SavingsGoals />);
        
        // Find the trash button
        const deleteBtn = screen.getByRole('button', { name: '' }); // Trash icon button
        // Wait, the button has no text, let's find it by the span class or just the first button with trash icon
        const trashBtn = screen.container.querySelector('.bi-trash')?.parentElement;
        if (trashBtn) fireEvent.click(trashBtn);
        
        expect(globalThis.confirm).toHaveBeenCalled();
        expect(mockDeleteGoal).toHaveBeenCalledWith(1);
    });
});
