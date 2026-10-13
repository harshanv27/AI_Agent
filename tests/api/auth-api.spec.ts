import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

// override is required because Windows defines a built-in USERNAME environment variable,
// which would otherwise shadow the credentials configured in .env
dotenv.config({ override: true });

test.describe('Auth API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const USERNAME = process.env.USERNAME || 'mor_2314';
    const PASSWORD = process.env.PASSWORD || '83r5^_';

    // ---------------------------------------------------------
    // POST - Successful Login
    // ---------------------------------------------------------

    test('POST - Successful login @master @sanity @api', async ({ request }) => {

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: { username: USERNAME, password: PASSWORD },
        });

        expect(response.status(), 'Successful login should return status 201').toBe(201);

        const body = await response.json();

        expect(body.token, 'Response should contain a token').toBeDefined();
        expect(typeof body.token, 'Token should be a string').toBe('string');
        expect(body.token.length, 'Token should be a non-empty string').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // POST - Invalid Login
    // ---------------------------------------------------------

    test('POST - Invalid login @master @regression @api', async ({ request }) => {

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: { username: 'invalid_user', password: 'invalid_password' },
        });

        expect(response.status(), 'Invalid login should return status 401').toBe(401);

        const body = (await response.text()).trim();
        expect(body, 'Response should contain the expected error message').toBe('username or password is incorrect');
    });
});
