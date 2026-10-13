/**
 * Test Case: Logout Flow
 *
 * Tags: @master @sanity @regression
 *
 * Steps:
 * 1) Open the application
 * 2) Log in using valid customer credentials
 * 3) Verify that authentication succeeds
 * 4) Navigate to the account logout option
 * 5) Click Logout
 * 6) Verify that the logout confirmation page is displayed
 * 7) Click Continue
 * 8) Verify the expected redirect to the homepage
 * 9) Verify that authenticated account options are no longer available
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Logout Flow @master @sanity @regression', async ({ homePage, loginPage, accountPage, page }) => {

    // Valid customer credentials from the project's configured test data
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Open the application', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
    });

    await test.step('2) Log in using valid customer credentials', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(email, password);
    });

    await test.step('3) Verify that authentication succeeds', async () => {
        expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
        expect(await accountPage.isAccountNavigationDisplayed()).toBeTruthy();
    });

    await test.step('4) Navigate to the account logout option', async () => {
        await accountPage.openMyAccountMenu();
    });

    await test.step('5) Click Logout', async () => {
        await accountPage.clickLogout();
    });

    await test.step('6) Verify that the logout confirmation page is displayed', async () => {
        expect(await accountPage.isLogoutPageExists()).toBeTruthy();
    });

    await test.step('7) Click Continue', async () => {
        await accountPage.clickContinue();
    });

    await test.step('8) Verify the expected redirect to the homepage', async () => {
        await expect(page).toHaveURL(/route=common\/home/);
        expect(await homePage.isHomePageExists()).toBeTruthy();
    });

    await test.step('9) Verify that authenticated account options are no longer available', async () => {
        expect(await accountPage.isAccountNavigationDisplayed()).toBeFalsy();
    });

    console.log('✅ ✔️ Logout Flow completed successfully!');
});
