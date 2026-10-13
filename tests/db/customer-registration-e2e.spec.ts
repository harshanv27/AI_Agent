/**
 * Test Case: OpenCart UI + Admin + MySQL End-to-End
 *
 * Tags: @master @db @end-to-end
 *
 * Steps:
 * 1) Register a new customer through the frontend
 * 2) Verify the customer in the Admin Portal
 * 3) Verify the customer in MySQL (oc_customer)
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { executeQuery } from '../../utils/dbClient';

test('Registered customer is verified in Admin Portal and MySQL @master @db @end-to-end', async ({
    homePage,
    registerPage,
    adminLoginPage,
    adminCustomersPage,
    adminCustomerPage,
}) => {

    // Dynamically generated customer data (unique per execution)
    const customer = RandomDataUtil.generateUserPayload();
    const email = `dbcustomer${Date.now()}@example.com`;

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin';

    await test.step('1) Register a new customer through the frontend', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();

        await homePage.clickMyAccount();
        await homePage.clickRegister();
        expect(await registerPage.isRegisterPageExists()).toBeTruthy();

        await registerPage.setFirstName(customer.name.firstname);
        await registerPage.setLastName(customer.name.lastname);
        await registerPage.setEmail(email);
        await registerPage.setTelephone(customer.phone);
        await registerPage.setPassword(customer.password);
        await registerPage.setConfirmPassword(customer.password);
        await registerPage.acceptPrivacyPolicy();
        await registerPage.submitRegistration();

        expect(await registerPage.isRegistrationSuccess()).toBeTruthy();
        expect(await registerPage.getConfirmationMessage()).toContain('Your Account Has Been Created!');
    });

    await test.step('2) Verify the customer in the Admin Portal', async () => {
        await adminLoginPage.goto();
        expect(await adminLoginPage.isLoginPageExists()).toBeTruthy();
        await adminLoginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);

        await adminCustomersPage.gotoCustomers();
        await adminCustomersPage.searchCustomer(email);
        expect(await adminCustomersPage.isCustomerExists(email), `Customer '${email}' should exist in the admin portal`).toBeTruthy();

        await adminCustomersPage.openCustomer(email);
        expect(await adminCustomerPage.isCustomerFormDisplayed()).toBeTruthy();
        expect(await adminCustomerPage.getFirstName(), 'Admin first name should match the registered value').toBe(customer.name.firstname);
        expect(await adminCustomerPage.getLastName(), 'Admin last name should match the registered value').toBe(customer.name.lastname);
        expect(await adminCustomerPage.getEmail(), 'Admin email should match the registered value').toBe(email);
        expect(await adminCustomerPage.isStatusEnabled(), 'Admin customer status should be enabled').toBeTruthy();
    });

    await test.step('3) Verify the customer in MySQL', async () => {
        const rows = (await executeQuery(
            'SELECT firstname, lastname, email, status, date_added FROM oc_customer WHERE email = ?',
            [email],
        )) as Array<{ firstname: string; lastname: string; email: string; status: number; date_added: string }>;

        expect(rows.length, `Exactly one oc_customer row should exist for '${email}'`).toBe(1);
        expect(rows[0].firstname, 'DB firstname should match the registered value').toBe(customer.name.firstname);
        expect(rows[0].lastname, 'DB lastname should match the registered value').toBe(customer.name.lastname);
        expect(rows[0].email, 'DB email should match the registered value').toBe(email);
        expect(rows[0].status, 'DB status should indicate an enabled customer').toBe(1);
        expect(rows[0].date_added, 'DB date_added should be present').toBeTruthy();
    });

    console.log('✅ ✔️ Customer verified across Frontend, Admin Portal and MySQL!');
});
