import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

test.describe('End-to-End API Workflows', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const START_DATE = process.env.START_DATE || '2019-12-10';

    // ---------------------------------------------------------
    // Product CRUD Workflow
    // ---------------------------------------------------------

    test('Product CRUD workflow - create, update, delete @master @regression @api', async ({ request }) => {

        // CREATE
        const createPayload = {
            title: 'Workflow Product',
            price: 11.5,
            description: 'Product created during the CRUD workflow',
            image: 'https://i.pravatar.cc',
            category: 'electronics',
        };

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: createPayload });
        expect(createResponse.status(), 'Create product should return 201').toBe(201);

        const created = await createResponse.json();
        const productId = created.id;
        expect(productId, 'Create product should return a product id').toBeTruthy();

        // UPDATE
        const updatePayload = {
            title: 'Workflow Product - Updated',
            price: 22.5,
            description: 'Product updated during the CRUD workflow',
            image: 'https://i.pravatar.cc',
            category: 'electronics',
        };

        const updateUrl = `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(productId))}`;
        const updateResponse = await request.put(updateUrl, { data: updatePayload });
        expect(updateResponse.status(), 'Update product should return 200').toBe(200);

        const updated = await updateResponse.json();
        expect(updated.title, 'Updated product should contain the updated title').toBe(updatePayload.title);
        expect(updated.price, 'Updated product should contain the updated price').toBe(updatePayload.price);

        // DELETE
        const deleteUrl = `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(productId))}`;
        const deleteResponse = await request.delete(deleteUrl);
        expect(deleteResponse.status(), 'Delete product should return 200').toBe(200);
    });

    // ---------------------------------------------------------
    // User CRUD Workflow
    // ---------------------------------------------------------

    test('User CRUD workflow - create, update, delete @master @regression @api', async ({ request }) => {

        // CREATE
        const createPayload = {
            email: 'workflow.user@example.com',
            username: 'workflowuser',
            password: 'Workflow@123',
            name: { firstname: 'Workflow', lastname: 'User' },
            address: {
                city: 'Workflow City',
                street: 'Workflow Street',
                number: 1,
                zipcode: '11111',
                geolocation: { lat: '0.0', long: '0.0' },
            },
            phone: '111-111-1111',
        };

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: createPayload });
        expect(createResponse.status(), 'Create user should return 201').toBe(201);

        const created = await createResponse.json();
        const userId = created.id;
        expect(userId, 'Create user should return a user id').toBeTruthy();

        // UPDATE
        const updatePayload = {
            email: 'workflow.user.updated@example.com',
            username: 'workflowuser_updated',
            password: 'Workflow@456',
            name: { firstname: 'WorkflowUpdated', lastname: 'User' },
            address: {
                city: 'Updated City',
                street: 'Updated Street',
                number: 2,
                zipcode: '22222',
                geolocation: { lat: '1.0', long: '1.0' },
            },
            phone: '222-222-2222',
        };

        const updateUrl = `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(userId))}`;
        const updateResponse = await request.put(updateUrl, { data: updatePayload });
        expect(updateResponse.status(), 'Update user should return 200').toBe(200);

        const updated = await updateResponse.json();
        expect(updated.email, 'Updated user should contain the updated email').toBe(updatePayload.email);
        expect(updated.name.firstname, 'Updated user should contain the updated first name').toBe(updatePayload.name.firstname);

        // DELETE
        const deleteUrl = `${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(userId))}`;
        const deleteResponse = await request.delete(deleteUrl);
        expect(deleteResponse.status(), 'Delete user should return 200').toBe(200);
    });

    // ---------------------------------------------------------
    // Cart CRUD Workflow
    // ---------------------------------------------------------

    test('Cart CRUD workflow - create, update, delete @master @regression @api', async ({ request }) => {

        // CREATE
        const createPayload = {
            userId: USER_ID,
            date: START_DATE,
            products: [{ productId: PRODUCT_ID, quantity: 1 }],
        };

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: createPayload });
        expect(createResponse.status(), 'Create cart should return 201').toBe(201);

        const created = await createResponse.json();
        const cartId = created.id;
        expect(cartId, 'Create cart should return a cart id').toBeTruthy();
        expect(created.userId, 'Created cart should contain the submitted user id').toBe(USER_ID);
        expect(created.products[0].productId, 'Created cart should contain the submitted product').toBe(PRODUCT_ID);

        // UPDATE
        const updatePayload = {
            userId: USER_ID,
            date: START_DATE,
            products: [{ productId: PRODUCT_ID, quantity: 2 }],
        };

        const updateUrl = `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(cartId))}`;
        const updateResponse = await request.put(updateUrl, { data: updatePayload });
        expect(updateResponse.status(), 'Update cart should return 200').toBe(200);

        const updated = await updateResponse.json();
        expect(updated.products[0].quantity, 'Updated cart should reflect the updated quantity').toBe(2);

        // DELETE
        const deleteUrl = `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(cartId))}`;
        const deleteResponse = await request.delete(deleteUrl);
        expect(deleteResponse.status(), 'Delete cart should return 200').toBe(200);
    });
});
