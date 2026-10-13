/**
 * Test Case: Invalid Login Flow
 *
 * Tags: @master @sanity @regression
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account -> Login
 * 3) Enter an invalid email and/or password
 * 4) Submit the form
 * 5) Verify that authentication fails
 * 6) Verify the appropriate warning/error message
 * 7) Verify that the customer is not authenticated
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

const EXPECTED_WARNING = 'Warning: No match for E-Mail Address and/or Password.';

test('Invalid Login Flow @master @sanity @regression', async ({ homePage, loginPage, page }) => {

    // Randomly generated invalid credentials (no matching customer)
    const invalidEmail = RandomDataUtil.getEmail();
    const invalidPassword = RandomDataUtil.getPassword();

    await test.step('1) Open the application', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
    });

    await test.step('2) Navigate to My Account -> Login', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
    });

    await test.step('3) Enter an invalid email and/or password', async () => {
        await loginPage.setEmail(invalidEmail);
        await loginPage.setPassword(invalidPassword);
    });

    await test.step('4) Submit the form', async () => {
        await loginPage.submitLogin();
    });

    await test.step('5) Verify that authentication fails', async () => {
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
        await expect(page).toHaveURL(/route=account\/login/);
    });

    await test.step('6) Verify the appropriate warning/error message', async () => {
        expect(await loginPage.getWarningMessage()).toContain(EXPECTED_WARNING);
    });

    await test.step('7) Verify that the customer is not authenticated', async () => {
        expect(await loginPage.isCustomerAuthenticated()).toBeFalsy();
    });

    console.log('✅ ✔️ Invalid Login Flow completed successfully!');
});
