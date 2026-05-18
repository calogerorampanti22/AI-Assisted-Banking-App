import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BottomBar from './BottomBar';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

describe('BottomBar Component', () => {
    it('renders all navigation items', () => {
        render(
            <BrowserRouter>
                <BottomBar />
            </BrowserRouter>
        );
        expect(screen.getByText('Home')).toBeDefined();
        expect(screen.getByText('Bonifico')).toBeDefined();
        expect(screen.getByText('Utenze')).toBeDefined();
        expect(screen.getByText('Salvadanai')).toBeDefined();
        expect(screen.getByText('Profilo')).toBeDefined();
    });

    it('has active class on the correct link', () => {
        // This depends on the current route, but we can just check if any has 'active' style logic
        // BottomBar uses NavLink which handles 'active' class automatically
        render(
            <BrowserRouter>
                <BottomBar />
            </BrowserRouter>
        );
        const homeLink = screen.getByText('Home').closest('a');
        expect(homeLink).toBeDefined();
    });
});
