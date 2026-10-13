/**
 * Test Case: End-to-End Shopping Flow
 *
 * Tags: @master @end-to-end
 *
 * Steps:
 * 1) Open the application
 * 2) Register a new customer using dynamically generated unique data
 * 3) Verify successful registration
 * 4) Log out
 * 5) Log in again using the newly created credentials
 * 6) Verify successful authentication
 * 7) Search for a known product
 * 8) Open the product details page
 * 9) Add the product to the cart
 * 10) Open the shopping cart
 * 11) Verify the correct product
 * 12) Verify the quantity
 * 13) Verify the product price
 * 14) Verify the applicable cart total
 * 15) Verify that the complete journey finishes without errors
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('End-to-End Shopping Flow @master @end-to-end', async ({ homePage, registerPage, loginPage, accountPage, productPage, cartPage }) => {

    // Randomly generated unique customer data
    const user = RandomDataUtil.generateUserPayload();
    // Known/fixed product data (MacBook, quantity 1, price $602.00)
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    await test.step('1) Open the application', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
    });

    await test.step('2) Register a new customer using dynamically generated unique data', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
        expect(await registerPage.isRegisterPageExists()).toBeTruthy();
        await registerPage.completeRegistration(user.name.firstname, user.name.lastname, user.email, user.password);
    });

    await test.step('3) Verify successful registration', async () => {
        expect(await registerPage.isRegistrationSuccess()).toBeTruthy();
    });

    await test.step('4) Log out', async () => {
        await registerPage.clickContinue();
        await accountPage.openMyAccountMenu();
        await accountPage.clickLogout();
        expect(await accountPage.isLogoutPageExists()).toBeTruthy();
        await accountPage.clickContinue();
    });

    await test.step('5) Log in again using the newly created credentials', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
        await loginPage.login(user.email, user.password);
    });

    await test.step('6) Verify successful authentication', async () => {
        expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
    });

    await test.step('7) Search for a known product', async () => {
        await homePage.searchProduct(productName);
        expect(await homePage.isSearchResultsPageDisplayed()).toBeTruthy();
        expect(await homePage.isProductDisplayed(productName)).toBeTruthy();
    });

    await test.step('8) Open the product details page', async () => {
        await homePage.openProduct(productName);
        expect(await productPage.isProductPageExists()).toBeTruthy();
        expect(await productPage.getProductName()).toContain(productName);
    });

    await test.step('9) Add the product to the cart', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.addToCart();
        expect(await productPage.isProductAddedMessageDisplayed()).toBeTruthy();
        expect(await productPage.getAddedMessage()).toContain(productName);
    });

    await test.step('10) Open the shopping cart', async () => {
        await homePage.clickShoppingCart();
        expect(await cartPage.isCartPageExists()).toBeTruthy();
    });

    await test.step('11) Verify the correct product', async () => {
        expect(await cartPage.getProductName()).toContain(productName);
    });

    await test.step('12) Verify the quantity', async () => {
        expect(await cartPage.getQuantity()).toBe(productQuantity);
    });

    await test.step('13) Verify the product price', async () => {
        expect(await cartPage.getProductUnitPrice()).toBe(totalPrice);
        expect(await cartPage.getProductTotal()).toBe(totalPrice);
    });

    await test.step('14) Verify the applicable cart total', async () => {
        expect(await cartPage.getCartTotal()).toBe(totalPrice);
    });

    await test.step('15) Verify that the complete journey finishes without errors', async () => {
        expect(await cartPage.isProductInCart(productName)).toBeTruthy();
    });

    console.log('✅ ✔️ End-to-End Shopping Flow completed successfully!');
});
