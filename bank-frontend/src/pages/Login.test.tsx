import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import api from '../api';

// Mock the API
vi.mock('../api');

const mockedApi = vi.mocked(api);

describe('Login Component', () => {
    const mockSetIsAuthenticated = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    const renderComponent = () => render(
        <MemoryRouter>
            <Login setIsAuthenticated={mockSetIsAuthenticated} />
        </MemoryRouter>
    );

    it('renders login form correctly', () => {
        renderComponent();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /accedi/i })).toBeInTheDocument();
    });

    it('shows error message on failed login', async () => {
        (api.post as any).mockRejectedValueOnce(new Error('Invalid credentials'));
        const { container } = renderComponent();

        const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
        const passwordInput = container.querySelector('input[type="password"]') as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        
        fireEvent.click(screen.getByRole('button', { name: /accedi/i }));

        await waitFor(() => {
            expect(screen.getByText('Email o password non corretti.')).toBeInTheDocument();
        });
    });

    it('calls login API and updates state on success', async () => {
        (api.post as any).mockResolvedValueOnce({
            data: { token: 'fake-token', email: 'test@example.com' }
        });
        const { container } = renderComponent();

        const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
        const passwordInput = container.querySelector('input[type="password"]') as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        
        fireEvent.click(screen.getByRole('button', { name: /accedi/i }));

        await waitFor(() => {
            expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);
        });
        expect(localStorage.getItem('token')).toBe('fake-token');
    });

    it('toggles password visibility', () => {
        const { container } = renderComponent();
        const passwordInput = container.querySelector('input[type="password"]') as HTMLInputElement;
        expect(passwordInput).toHaveAttribute('type', 'password');
        
        // Find the button (it has the bi-eye class inside)
        const toggleBtn = screen.getAllByRole('button')[0]; // first button is toggle since the second is submit
        fireEvent.click(toggleBtn);
        
        expect(passwordInput).toHaveAttribute('type', 'text');
    });
});
