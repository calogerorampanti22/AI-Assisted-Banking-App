import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '../hooks/useAccounts';

interface SpendingChartProps {
    transactions: Transaction[];
}

const COLORS = ['#ea580c', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const SpendingChart: React.FC<SpendingChartProps> = ({ transactions }) => {

    const chartData = useMemo(() => {
        // 1. Filter only OUT transactions (Expenses)
        const expenses = transactions.filter(t => t.type === 'OUT');

        // 2. Group expenses by Category
        const expensesByCategory = expenses.reduce((acc, t) => {
            // Logica di fallback se la transazione non ha categoria esplicita dal DB
            let category = t.category;
            if (!category) {
                const descText = ((t.description || '') + ' ' + (t.recipientLastName || '')).toUpperCase();
                if (descText.includes('PAGOPA')) category = 'PAGOPA';
                else if (descText.includes('BOLLETTINO')) category = 'BOLLETTINO';
                else if (descText.includes('BONIFICO')) category = 'BONIFICO';
                else category = 'ALTRO';
            }
            category = category.toUpperCase();

            acc[category] = (acc[category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

        // 3. Format data for Recharts
        return Object.entries(expensesByCategory).map(([name, value]) => ({
            name,
            value
        })).sort((a, b) => b.value - a.value); // Order by highest expense

    }, [transactions]);

    if (chartData.length === 0) {
        return (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                <p>Nessun dato di spesa disponibile per questo periodo.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ width: '100%', textAlign: 'left', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                <i className="bi bi-pie-chart-fill" style={{ marginRight: '10px', color: 'var(--primary-light)' }}></i>
                Analisi Spese
            </h3>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: any) => `€${Number(value || 0).toFixed(2)}`}
                            contentStyle={{ background: 'rgba(35,35,40,0.9)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
                            itemStyle={{ color: 'var(--text-primary)' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
};

export default SpendingChart;
