import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import dotenv from 'dotenv';

dotenv.config();

test.describe('JSON Schema Validation API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const CART_ID = Number(process.env.CART_ID ?? 1);

    const ajv = new Ajv({ allErrors: true });

    // ---------------------------------------------------------
    // Product Response Schema
    // ---------------------------------------------------------

    test('GET - Product response schema @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'GET product by ID should return 200').toBe(200);

        const body = await response.json();
        const schema = DataProvider.readJson('./api/schemas/product_api_schema.json');
        const validate = ajv.compile(schema);
        const isValid = validate(body);

        expect(isValid, `Product response should match the schema: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });

    // ---------------------------------------------------------
    // User Response Schema
    // ---------------------------------------------------------

    test('GET - User response schema @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'GET user by ID should return 200').toBe(200);

        const body = await response.json();
        const schema = DataProvider.readJson('./api/schemas/user_api_schema.json');
        const validate = ajv.compile(schema);
        const isValid = validate(body);

        expect(isValid, `User response should match the schema: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });

    // ---------------------------------------------------------
    // Cart Response Schema
    // ---------------------------------------------------------

    test('GET - Cart response schema @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'GET cart by ID should return 200').toBe(200);

        const body = await response.json();
        const schema = DataProvider.readJson('./api/schemas/cart_api_schema.json');
        const validate = ajv.compile(schema);
        const isValid = validate(body);

        expect(isValid, `Cart response should match the schema: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });
});
