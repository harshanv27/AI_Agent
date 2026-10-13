/**
 * Test Case: User Registration Flow
 *
 * Tags: @master @sanity @regression
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account -> Register
 * 3) Verify that the registration page is displayed
 * 4) Generate a unique customer email
 * 5) Enter valid customer details (First Name, Last Name, Email, Telephone, Password, Password Confirmation)
 * 6) Accept the Privacy Policy
 * 7) Submit the registration form
 * 8) Verify that registration succeeds
 * 9) Verify the account-created confirmation message
 * 10) Verify that the newly created account is available through the account navigation
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('User Registration Flow @master @sanity @regression', async ({ homePage, registerPage, accountPage }) => {

    // Randomly generated unique customer data
    const user = RandomDataUtil.generateUserPayload();

    await test.step('1) Open the application', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
    });

    await test.step('2) Navigate to My Account -> Register', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
    });

    await test.step('3) Verify that the registration page is displayed', async () => {
        expect(await registerPage.isRegisterPageExists()).toBeTruthy();
    });

    await test.step('4) Generate a unique customer email', async () => {
        expect(user.email).toContain('@');
    });

    await test.step('5) Enter valid customer details', async () => {
        await registerPage.setFirstName(user.name.firstname);
        await registerPage.setLastName(user.name.lastname);
        await registerPage.setEmail(user.email);
        await registerPage.setTelephone(user.phone);
        await registerPage.setPassword(user.password);
        await registerPage.setConfirmPassword(user.password);
    });

    await test.step('6) Accept the Privacy Policy', async () => {
        await registerPage.acceptPrivacyPolicy();
    });

    await test.step('7) Submit the registration form', async () => {
        await registerPage.submitRegistration();
    });

    await test.step('8) Verify that registration succeeds', async () => {
        expect(await registerPage.isRegistrationSuccess()).toBeTruthy();
    });

    await test.step('9) Verify the account-created confirmation message', async () => {
        expect(await registerPage.getConfirmationMessage()).toContain('Your Account Has Been Created!');
    });

    await test.step('10) Verify that the newly created account is available through the account navigation', async () => {
        await registerPage.clickContinue();
        expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
        expect(await accountPage.isAccountNavigationDisplayed()).toBeTruthy();
    });

    console.log('✅ ✔️ User Registration Flow completed successfully!');
});
