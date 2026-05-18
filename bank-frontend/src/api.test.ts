import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';

describe('API Interceptor', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('adds Authorization header if token exists', async () => {
        localStorage.setItem('token', 'my-fake-token');
        const req = { headers: {} };
        // Any explicitly typed version handles the interceptor differently in tests, so we simulate the handler
        const handler: any = (api.interceptors.request as any).handlers[0].fulfilled;
        const config = handler(req);
        expect(config.headers.Authorization).toBe('Bearer my-fake-token');
    });

    it('does not add Authorization header if token is absent', async () => {
        const req = { headers: {} };
        const handler: any = (api.interceptors.request as any).handlers[0].fulfilled;
        const config = handler(req);
        expect(config.headers.Authorization).toBeUndefined();
    });
});
