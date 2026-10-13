import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

type User = {
    id: number;
    email: string;
    username: string;
    name: { firstname: string; lastname: string };
    phone: string;
};

test.describe('Users API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Users
    // ---------------------------------------------------------

    test('GET - All users @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);

        expect(response.status(), 'GET all users should return 200').toBe(200);

        const body = (await response.json()) as User[];

        expect(Array.isArray(body), 'Response body should be an array').toBeTruthy();
        expect(body.length, 'Response should contain at least one user').toBeGreaterThan(0);
        expect(typeof body[0].id, 'user.id should be a number').toBe('number');
        expect(typeof body[0].email, 'user.email should be a string').toBe('string');
        expect(typeof body[0].username, 'user.username should be a string').toBe('string');
        expect(typeof body[0].name, 'user.name should be an object').toBe('object');
    });

    // ---------------------------------------------------------
    // GET - User by ID
    // ---------------------------------------------------------

    test('GET - User by ID @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'GET user by ID should return 200').toBe(200);

        const user = (await response.json()) as User;

        expect(user.id, 'Returned user id should match the requested id').toBe(USER_ID);
        expect(typeof user.email, 'user.email should be a string').toBe('string');
        expect(typeof user.username, 'user.username should be a string').toBe('string');
    });

    // ---------------------------------------------------------
    // GET - Users with Limit
    // ---------------------------------------------------------

    test('GET - Users with limit @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;
        const response = await request.get(url);

        expect(response.status(), 'GET users with limit should return 200').toBe(200);

        const body = (await response.json()) as User[];

        expect(Array.isArray(body), 'Response body should be an array').toBeTruthy();
        expect(body.length, `Response should contain exactly ${LIMIT} users`).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Sort Users (Ascending)
    // ---------------------------------------------------------

    test('GET - Users sorted ascending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'asc')}`;
        const response = await request.get(url);

        expect(response.status(), 'GET sorted users should return 200').toBe(200);

        const body = (await response.json()) as User[];
        const ids = body.map((user) => user.id);

        expect(ids, 'User IDs should be in ascending order').toEqual([...ids].sort((a, b) => a - b));
    });

    // ---------------------------------------------------------
    // GET - Sort Users (Descending)
    // ---------------------------------------------------------

    test('GET - Users sorted descending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'desc')}`;
        const response = await request.get(url);

        expect(response.status(), 'GET sorted users should return 200').toBe(200);

        const body = (await response.json()) as User[];
        const ids = body.map((user) => user.id);

        expect(ids, 'User IDs should be in descending order').toEqual([...ids].sort((a, b) => b - a));
    });

    // ---------------------------------------------------------
    // POST - Create User
    // ---------------------------------------------------------

    test('POST - Create user @master @regression @api', async ({ request }) => {

        const payload = {
            email: 'api.test.user@example.com',
            username: 'apitestuser',
            password: 'ApiTest@123',
            name: { firstname: 'Api', lastname: 'Tester' },
            address: {
                city: 'Test City',
                street: 'Test Street',
                number: 100,
                zipcode: '12345',
                geolocation: { lat: '0.0', long: '0.0' },
            },
            phone: '123-456-7890',
        };

        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

        expect(response.status(), 'Create user should return 201').toBe(201);

        const body = await response.json();

        expect(body.id, 'Created user should have a generated id').toBeTruthy();
        expect(typeof body.id, 'Created user id should be a number').toBe('number');
    });

    // ---------------------------------------------------------
    // PUT - Update User
    // ---------------------------------------------------------

    test('PUT - Update user @master @regression @api', async ({ request }) => {

        const payload = {
            email: 'api.test.user.updated@example.com',
            username: 'apitestuser_updated',
            password: 'ApiTest@456',
            name: { firstname: 'ApiUpdated', lastname: 'Tester' },
            address: {
                city: 'Updated City',
                street: 'Updated Street',
                number: 200,
                zipcode: '54321',
                geolocation: { lat: '1.0', long: '1.0' },
            },
            phone: '098-765-4321',
        };

        const url = `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(USER_ID))}`;
        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Update user should return 200').toBe(200);

        const body = await response.json();

        expect(body.email, 'Response should contain the updated email').toBe(payload.email);
        expect(body.username, 'Response should contain the updated username').toBe(payload.username);
        expect(body.name.firstname, 'Response should contain the updated first name').toBe(payload.name.firstname);
        expect(body.phone, 'Response should contain the updated phone').toBe(payload.phone);
    });

    // ---------------------------------------------------------
    // DELETE - Delete User
    // ---------------------------------------------------------

    test('DELETE - Delete user @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(USER_ID))}`;
        const response = await request.delete(url);

        expect(response.status(), 'Delete user should return 200').toBe(200);

        const body = await response.json();
        expect(body.id, 'Deleted user response should match the requested id').toBe(USER_ID);
    });
});
