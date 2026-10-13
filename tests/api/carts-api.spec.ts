import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

type Cart = {
    id: number;
    userId: number;
    date: string;
    products: { productId: number; quantity: number }[];
};

test.describe('Carts API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const CART_ID = Number(process.env.CART_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const START_DATE = process.env.START_DATE || '2019-12-10';
    const END_DATE = process.env.END_DATE || '2020-10-10';

    // ---------------------------------------------------------
    // GET - All Carts
    // ---------------------------------------------------------

    test('GET - All carts @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status(), 'GET all carts should return 200').toBe(200);

        const body = (await response.json()) as Cart[];

        expect(Array.isArray(body), 'Response body should be an array').toBeTruthy();
        expect(body.length, 'Response should contain at least one cart').toBeGreaterThan(0);
        expect(typeof body[0].id, 'cart.id should be a number').toBe('number');
        expect(typeof body[0].userId, 'cart.userId should be a number').toBe('number');
        expect(Array.isArray(body[0].products), 'cart.products should be an array').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Cart by ID
    // ---------------------------------------------------------

    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'GET cart by ID should return 200').toBe(200);

        const cart = (await response.json()) as Cart;

        expect(cart.id, 'Returned cart id should match the requested id').toBe(CART_ID);
        expect(typeof cart.userId, 'cart.userId should be a number').toBe('number');
        expect(Array.isArray(cart.products), 'cart.products should be an array').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Carts by Date Range
    // ---------------------------------------------------------

    test('GET - Carts by date range @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', START_DATE)
            .replace('{enddate}', END_DATE)}`;
        const response = await request.get(url);

        expect(response.status(), 'GET carts by date range should return 200').toBe(200);

        const body = (await response.json()) as Cart[];

        expect(Array.isArray(body), 'Response body should be an array').toBeTruthy();

        const startTime = new Date(START_DATE).getTime();
        const endTime = new Date(END_DATE).getTime();

        body.forEach((cart) => {
            const cartTime = new Date(cart.date).getTime();
            expect(cartTime, `Cart ${cart.id} date should be on/after the start date`).toBeGreaterThanOrEqual(startTime);
            expect(cartTime, `Cart ${cart.id} date should be on/before the end date`).toBeLessThanOrEqual(endTime);
        });
    });

    // ---------------------------------------------------------
    // GET - Carts for a User
    // ---------------------------------------------------------

    test('GET - User cart @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_CART.replace('{userId}', String(USER_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'GET user cart should return 200').toBe(200);

        const body = (await response.json()) as Cart[];

        expect(Array.isArray(body), 'Response body should be an array').toBeTruthy();
        expect(body.length, 'User should have at least one cart').toBeGreaterThan(0);
        body.forEach((cart) => {
            expect(cart.userId, `Cart ${cart.id} should belong to user ${USER_ID}`).toBe(USER_ID);
        });
    });

    // ---------------------------------------------------------
    // GET - Carts with Limit
    // ---------------------------------------------------------

    test('GET - Carts with limit @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;
        const response = await request.get(url);

        expect(response.status(), 'GET carts with limit should return 200').toBe(200);

        const body = (await response.json()) as Cart[];

        expect(Array.isArray(body), 'Response body should be an array').toBeTruthy();
        expect(body.length, `Response should contain exactly ${LIMIT} carts`).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Sort Carts (Ascending)
    // ---------------------------------------------------------

    test('GET - Carts sorted ascending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'asc')}`;
        const response = await request.get(url);

        expect(response.status(), 'GET sorted carts should return 200').toBe(200);

        const body = (await response.json()) as Cart[];
        const ids = body.map((cart) => cart.id);

        expect(ids, 'Cart IDs should be in ascending order').toEqual([...ids].sort((a, b) => a - b));
    });

    // ---------------------------------------------------------
    // GET - Sort Carts (Descending)
    // ---------------------------------------------------------

    test('GET - Carts sorted descending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'desc')}`;
        const response = await request.get(url);

        expect(response.status(), 'GET sorted carts should return 200').toBe(200);

        const body = (await response.json()) as Cart[];
        const ids = body.map((cart) => cart.id);

        expect(ids, 'Cart IDs should be in descending order').toEqual([...ids].sort((a, b) => b - a));
    });

    // ---------------------------------------------------------
    // POST - Create Cart
    // ---------------------------------------------------------

    test('POST - Create cart @master @regression @api', async ({ request }) => {

        const payload = {
            userId: USER_ID,
            date: START_DATE,
            products: [{ productId: PRODUCT_ID, quantity: 1 }],
        };

        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

        expect(response.status(), 'Create cart should return 201').toBe(201);

        const body = await response.json();

        expect(body.id, 'Created cart should have an id').toBeTruthy();
        expect(typeof body.id, 'Created cart id should be a number').toBe('number');
        expect(body.userId, 'Response should contain the submitted user id').toBe(USER_ID);
        expect(body.products[0].productId, 'Response should contain the submitted product id').toBe(PRODUCT_ID);
        expect(body.products[0].quantity, 'Response should contain the submitted quantity').toBe(1);
    });

    // ---------------------------------------------------------
    // PUT - Update Cart
    // ---------------------------------------------------------

    test('PUT - Update cart @master @regression @api', async ({ request }) => {

        const payload = {
            userId: USER_ID,
            date: START_DATE,
            products: [{ productId: PRODUCT_ID, quantity: 2 }],
        };

        const url = `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(CART_ID))}`;
        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Update cart should return 200').toBe(200);

        const body = await response.json();

        expect(body.id, 'Returned cart id should match the requested id').toBe(CART_ID);
        expect(body.products[0].quantity, 'Response should reflect the updated quantity').toBe(2);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Cart
    // ---------------------------------------------------------

    test('DELETE - Delete cart @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(CART_ID))}`;
        const response = await request.delete(url);

        expect(response.status(), 'Delete cart should return 200').toBe(200);
        expect(response.ok(), 'Delete cart request should succeed').toBeTruthy();
    });
});
