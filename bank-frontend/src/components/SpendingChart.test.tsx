import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SpendingChart from './SpendingChart';
import React from 'react';

// Mock recharts because it uses SVG and doesn't play well with JSDOM
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
    PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
    Pie: () => <div data-testid="pie" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
}));

describe('SpendingChart Component', () => {
    const mockFullTransactions: any[] = [
        { id: 1, type: 'OUT', amount: 100, category: 'Food', date: '2023-01-01' },
        { id: 2, type: 'OUT', amount: 50, category: 'Transport', date: '2023-01-02' },
        { id: 3, type: 'IN', amount: 1000, category: 'Salary', date: '2023-01-03' },
    ];

    it('renders empty message when no transactions', () => {
        render(<SpendingChart transactions={[]} />);
        expect(screen.getByText(/Nessun dato di spesa disponibile/)).toBeDefined();
    });

    it('renders analysis title when data is present', () => {
        render(<SpendingChart transactions={mockFullTransactions} />);
        expect(screen.getByText(/Analisi Spese/)).toBeDefined();
    });

    it('renders the chart container when data available', () => {
        render(<SpendingChart transactions={mockFullTransactions} />);
        expect(screen.getByTestId('pie-chart')).toBeDefined();
    });
});
