/**
 * Test Case: Product Search Flow
 *
 * Tags: @master @sanity @regression
 *
 * Steps:
 * 1) Open the application
 * 2) Locate the main product search field
 * 3) Enter a valid known product name
 * 4) Submit the search
 * 5) Verify that the search results page is displayed
 * 6) Verify that the expected product appears in the results
 * 7) Verify that the displayed product name matches the search criteria
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Product Search Flow @master @sanity @regression', async ({ homePage }) => {

    // Known product from the project's configured test data
    const { productName } = Helper.getProductDetails();

    await test.step('1) Open the application', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
    });

    await test.step('2) Locate the main product search field', async () => {
        expect(await homePage.isSearchFieldDisplayed()).toBeTruthy();
    });

    await test.step('3) Enter a valid known product name', async () => {
        await homePage.setSearchProduct(productName);
    });

    await test.step('4) Submit the search', async () => {
        await homePage.submitSearch();
    });

    await test.step('5) Verify that the search results page is displayed', async () => {
        expect(await homePage.isSearchResultsPageDisplayed()).toBeTruthy();
    });

    await test.step('6) Verify that the expected product appears in the results', async () => {
        expect(await homePage.isProductDisplayed(productName)).toBeTruthy();
    });

    await test.step('7) Verify that the displayed product name matches the search criteria', async () => {
        expect(await homePage.getDisplayedProductName(productName)).toBe(productName);
    });

    console.log('✅ ✔️ Product Search Flow completed successfully!');
});
