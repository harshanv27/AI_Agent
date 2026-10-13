import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

type Product = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
};

test.describe('Products API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const CATEGORY = 'electronics';

    // ---------------------------------------------------------
    // GET - All Products
    // ---------------------------------------------------------

    test('GET - All products @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status(), 'GET all products should return 200').toBe(200);

        const body = (await response.json()) as Product[];

        expect(Array.isArray(body), 'Response body should be an array').toBeTruthy();
        expect(body.length, 'Response should contain at least one product').toBeGreaterThan(0);

        body.forEach((product) => {
            expect(typeof product.id, 'product.id should be a number').toBe('number');
            expect(typeof product.title, 'product.title should be a string').toBe('string');
            expect(typeof product.price, 'product.price should be a number').toBe('number');
            expect(typeof product.category, 'product.category should be a string').toBe('string');
            expect(typeof product.image, 'product.image should be a string').toBe('string');
        });
    });

    // ---------------------------------------------------------
    // GET - Product by ID
    // ---------------------------------------------------------

    test('GET - Product by ID @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'GET product by ID should return 200').toBe(200);

        const product = (await response.json()) as Product;

        expect(product.id, 'Returned product id should match the requested id').toBe(PRODUCT_ID);
        expect(typeof product.title, 'product.title should be a string').toBe('string');
        expect(typeof product.price, 'product.price should be a number').toBe('number');
        expect(typeof product.category, 'product.category should be a string').toBe('string');
        expect(typeof product.image, 'product.image should be a string').toBe('string');
    });

    // ---------------------------------------------------------
    // GET - Products with Limit
    // ---------------------------------------------------------

    test('GET - Products with limit @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;
        const response = await request.get(url);

        expect(response.status(), 'GET products with limit should return 200').toBe(200);

        const body = (await response.json()) as Product[];

        expect(Array.isArray(body), 'Response body should be an array').toBeTruthy();
        expect(body.length, `Response should contain exactly ${LIMIT} products`).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Sort Products (Ascending)
    // ---------------------------------------------------------

    test('GET - Products sorted ascending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc')}`;
        const response = await request.get(url);

        expect(response.status(), 'GET sorted products should return 200').toBe(200);

        const body = (await response.json()) as Product[];
        const ids = body.map((product) => product.id);

        expect(ids, 'Product IDs should be in ascending order').toEqual([...ids].sort((a, b) => a - b));
    });

    // ---------------------------------------------------------
    // GET - Sort Products (Descending)
    // ---------------------------------------------------------

    test('GET - Products sorted descending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc')}`;
        const response = await request.get(url);

        expect(response.status(), 'GET sorted products should return 200').toBe(200);

        const body = (await response.json()) as Product[];
        const ids = body.map((product) => product.id);

        expect(ids, 'Product IDs should be in descending order').toEqual([...ids].sort((a, b) => b - a));
    });

    // ---------------------------------------------------------
    // GET - All Product Categories
    // ---------------------------------------------------------

    test('GET - All product categories @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status(), 'GET all categories should return 200').toBe(200);

        const body = (await response.json()) as string[];

        expect(Array.isArray(body), 'Response body should be an array').toBeTruthy();
        expect(body.length, 'Category list should not be empty').toBeGreaterThan(0);
        body.forEach((category) => {
            expect(typeof category, 'Each category should be a string').toBe('string');
        });
    });

    // ---------------------------------------------------------
    // GET - Products by Category
    // ---------------------------------------------------------

    test('GET - Products by category @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', CATEGORY)}`;
        const response = await request.get(url);

        expect(response.status(), 'GET products by category should return 200').toBe(200);

        const body = (await response.json()) as Product[];

        expect(Array.isArray(body), 'Response body should be an array').toBeTruthy();
        expect(body.length, 'Category should contain at least one product').toBeGreaterThan(0);
        body.forEach((product) => {
            expect(product.category, `Product ${product.id} should belong to '${CATEGORY}'`).toBe(CATEGORY);
        });
    });

    // ---------------------------------------------------------
    // POST - Create Product
    // ---------------------------------------------------------

    test('POST - Create product @master @regression @api', async ({ request }) => {

        const payload = {
            title: 'API Test Product',
            price: 19.99,
            description: 'Product created by the API test suite',
            image: 'https://i.pravatar.cc',
            category: 'electronics',
        };

        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

        expect(response.status(), 'Create product should return 201').toBe(201);

        const body = await response.json();

        expect(body.id, 'Created product should have an id').toBeTruthy();
        expect(typeof body.id, 'Created product id should be a number').toBe('number');
        expect(body.title, 'Response should contain the submitted title').toBe(payload.title);
        expect(body.price, 'Response should contain the submitted price').toBe(payload.price);
        expect(body.description, 'Response should contain the submitted description').toBe(payload.description);
        expect(body.category, 'Response should contain the submitted category').toBe(payload.category);
        expect(body.image, 'Response should contain the submitted image').toBe(payload.image);
    });

    // ---------------------------------------------------------
    // PUT - Update Product
    // ---------------------------------------------------------

    test('PUT - Update product @master @regression @api', async ({ request }) => {

        const payload = {
            title: 'API Test Product - Updated',
            price: 29.99,
            description: 'Product updated by the API test suite',
            image: 'https://i.pravatar.cc',
            category: 'electronics',
        };

        const url = `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`;
        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Update product should return 200').toBe(200);

        const body = await response.json();

        expect(body.id, 'Returned product id should match the requested id').toBe(PRODUCT_ID);
        expect(body.title, 'Response should contain the updated title').toBe(payload.title);
        expect(body.price, 'Response should contain the updated price').toBe(payload.price);
        expect(body.description, 'Response should contain the updated description').toBe(payload.description);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Product
    // ---------------------------------------------------------

    test('DELETE - Delete product @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`;
        const response = await request.delete(url);

        expect(response.status(), 'Delete product should return 200').toBe(200);
        expect(response.ok(), 'Delete product request should succeed').toBeTruthy();
    });
});
