/**
 * Test Case: Valid Login Flow
 *
 * Tags: @master @sanity @regression
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account -> Login
 * 3) Verify that the login page is displayed
 * 4) Enter valid customer credentials from the project's configured test data
 * 5) Submit the login form
 * 6) Verify successful authentication
 * 7) Verify that the user is redirected to the My Account section
 * 8) Verify that the authenticated account navigation is visible
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Valid Login Flow @master @sanity @regression', async ({ homePage, loginPage, accountPage, page }) => {

    // Valid customer credentials from the project's configured test data
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Open the application', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
    });

    await test.step('2) Navigate to My Account -> Login', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
    });

    await test.step('3) Verify that the login page is displayed', async () => {
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
    });

    await test.step('4) Enter valid customer credentials from the configured test data', async () => {
        await loginPage.setEmail(email);
        await loginPage.setPassword(password);
    });

    await test.step('5) Submit the login form', async () => {
        await loginPage.submitLogin();
    });

    await test.step('6) Verify successful authentication', async () => {
        expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
    });

    await test.step('7) Verify that the user is redirected to the My Account section', async () => {
        await expect(page).toHaveURL(/route=account\/account/);
    });

    await test.step('8) Verify that the authenticated account navigation is visible', async () => {
        expect(await accountPage.isAccountNavigationDisplayed()).toBeTruthy();
    });

    console.log('✅ ✔️ Valid Login Flow completed successfully!');
});
