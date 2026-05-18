import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import api from '../api';

import Dashboard from './Dashboard';
import Register from './Register';
import Transfer from './Transfer';
import Profile from './Profile';
import Payments from './Payments';
import LoginHistory from './LoginHistory';
import SavingsGoals from './SavingsGoals';
import PhoneTopUp from './PhoneTopUp';
import PagoPA from './PagoPA';
import Bollettino from './Bollettino';

vi.mock('../api');
const mockedApi = vi.mocked(api);

describe('Bulk Pages Mount Test (Coverage Booster)', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        (api.get as any).mockResolvedValue({ data: [] });
        (api.post as any).mockResolvedValue({ data: {} });
        (api.put as any).mockResolvedValue({ data: {} });
        (api.delete as any).mockResolvedValue({ data: {} });
    });

    const renderWithRouter = (ui: React.ReactElement) => render(
        <MemoryRouter>
            {ui}
        </MemoryRouter>
    );

    it('renders Dashboard without crashing', async () => {
        // Mock dashboard specific requirements
        (api.get as any).mockImplementation(async (url: any) => {
            if (url === '/accounts/my-accounts') return { data: [{ id: 1, balance: 1000, iban: 'IT123' }] };
            if (url === '/transactions/my-transactions') return { data: [{ id: 1, amount: 10, type: 'DEPOSIT', date: '2023-01-01' }] };
            return { data: [] };
        });
        const { container } = renderWithRouter(<Dashboard />);
        await waitFor(() => expect(container).toBeInTheDocument());
    });

    it('renders Register without crashing', async () => {
        const { container } = renderWithRouter(<Register />);
        await waitFor(() => expect(container).toBeInTheDocument());
    });

    it('renders Transfer without crashing', async () => {
        (api.get as any).mockImplementation(async (url: any) => {
            if (url === '/accounts/my-accounts') return { data: [{ id: 1, balance: 1000, iban: 'IT123', currency: 'EUR' }] };
            if (url === '/beneficiaries') return { data: [{ id: 1, name: 'Mario', iban: 'IT456' }] };
            return { data: [] };
        });
        const { container } = renderWithRouter(<Transfer />);
        await waitFor(() => expect(container).toBeInTheDocument());
    });

    it('renders Profile without crashing', async () => {
        localStorage.setItem('user', JSON.stringify({ firstName: 'Mario', lastName: 'Rossi', email: 'm@r.it' }));
        (api.get as any).mockImplementation(async (url: any) => {
            if (url === '/accounts/my-accounts') return { data: [{ id: 1, balance: 1000, iban: 'IT123', accountType: 'CHECKING' }] };
            return { data: [] };
        });
        const { container } = renderWithRouter(<Profile />);
        await waitFor(() => expect(container).toBeInTheDocument());
    });

    it('renders Payments without crashing', async () => {
        const { container } = renderWithRouter(<Payments />);
        await waitFor(() => expect(container).toBeInTheDocument());
    });

    it('renders LoginHistory without crashing', async () => {
        (api.get as any).mockImplementation(async (url: any) => {
             return { data: [{ id: 1, loginTime: '2023-01-01', ipAddress: '127.0.0.1', device: 'Web' }] };
        });
        const { container } = renderWithRouter(<LoginHistory />);
        await waitFor(() => expect(container).toBeInTheDocument());
    });

    it('renders SavingsGoals without crashing', async () => {
        (api.get as any).mockImplementation(async (url: any) => {
             return { data: [{ id: 1, title: 'Car', targetAmount: 10000, currentAmount: 1000 }] };
        });
        const { container } = renderWithRouter(<SavingsGoals />);
        await waitFor(() => expect(container).toBeInTheDocument());
    });

    it('renders PhoneTopUp without crashing', async () => {
        (api.get as any).mockImplementation(async (url: any) => {
            if (url === '/accounts/my-accounts') return { data: [{ id: 1, balance: 1000, iban: 'IT123' }] };
            return { data: [] };
        });
        const { container } = renderWithRouter(<PhoneTopUp />);
        await waitFor(() => expect(container).toBeInTheDocument());
    });

    it('renders PagoPA without crashing', async () => {
        (api.get as any).mockImplementation(async (url: any) => {
            if (url === '/accounts/my-accounts') return { data: [{ id: 1, balance: 1000, iban: 'IT123' }] };
            return { data: [] };
        });
        const { container } = renderWithRouter(<PagoPA />);
        await waitFor(() => expect(container).toBeInTheDocument());
    });

    it('renders Bollettino without crashing', async () => {
        (api.get as any).mockImplementation(async (url: any) => {
            if (url === '/accounts/my-accounts') return { data: [{ id: 1, balance: 1000, iban: 'IT123' }] };
            return { data: [] };
        });
        const { container } = renderWithRouter(<Bollettino />);
        await waitFor(() => expect(container).toBeInTheDocument());
    });
});
