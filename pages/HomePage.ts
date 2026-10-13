import { Page, Locator } from '@playwright/test';
import { RegisterPage } from './RegisterPage';
import { LoginPage } from './LoginPage';
import { CartPage } from './CartPage';
import { ProductPage } from './ProductPage';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly logo: Locator;
    private readonly myAccountToggle: Locator;
    private readonly lnkRegister: Locator;
    private readonly lnkLogin: Locator;
    private readonly lnkShoppingCart: Locator;
    private readonly txtSearch: Locator;
    private readonly btnSearch: Locator;
    private readonly searchHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.logo = page.locator('#logo img');
        this.myAccountToggle = page.locator('#top span.dropdown-toggle:has-text("My Account")');
        this.lnkRegister = page.locator('#top a[href*="account/register"]');
        this.lnkLogin = page.locator('#top a[href*="account/login"]');
        this.lnkShoppingCart = page.locator('#top a[title="Shopping Cart"]');
        this.txtSearch = page.locator('header input[name="search"]');
        this.btnSearch = page.locator('header button[type="submit"]');
        this.searchHeading = page.locator('#content h1');
    }

    /**
     * Verifies the home page is displayed
     * @returns Promise<boolean> - true if the store logo is visible
     */
    async isHomePageExists(): Promise<boolean> {
        try {
            return await this.logo.first().isVisible();
        } catch (error) {
            console.log(`Error checking home page: ${error}`);
            return false;
        }
    }

    /**
     * Opens the My Account dropdown in the header
     */
    async clickMyAccount(): Promise<void> {
        await this.myAccountToggle.click();
    }

    /**
     * Clicks the Register link in the My Account dropdown
     * @returns Promise<RegisterPage> - Instance of the registration page
     */
    async clickRegister(): Promise<RegisterPage> {
        await this.lnkRegister.click();
        return new RegisterPage(this.page);
    }

    /**
     * Clicks the Login link in the My Account dropdown
     * @returns Promise<LoginPage> - Instance of the login page
     */
    async clickLogin(): Promise<LoginPage> {
        await this.lnkLogin.click();
        return new LoginPage(this.page);
    }

    /**
     * Clicks the Shopping Cart link in the header
     * @returns Promise<CartPage> - Instance of the shopping cart page
     */
    async clickShoppingCart(): Promise<CartPage> {
        await this.lnkShoppingCart.click();
        return new CartPage(this.page);
    }

    /**
     * Verifies the main product search field is displayed
     * @returns Promise<boolean> - true if the header search field is visible
     */
    async isSearchFieldDisplayed(): Promise<boolean> {
        try {
            return await this.txtSearch.isVisible();
        } catch (error) {
            console.log(`Error checking search field: ${error}`);
            return false;
        }
    }

    /**
     * Enters the product name in the search field
     * @param productName - Product name to search for
     */
    async setSearchProduct(productName: string): Promise<void> {
        await this.txtSearch.fill(productName);
    }

    /**
     * Submits the search and waits for the search results page
     */
    async submitSearch(): Promise<void> {
        try {
            await this.btnSearch.click();
            await this.page.waitForURL('**product/search**');
        } catch (error) {
            console.log(`Error submitting search: ${error}`);
            throw error;
        }
    }

    /**
     * Searches for a product using the header search field
     * @param productName - Product name to search for
     */
    async searchProduct(productName: string): Promise<void> {
        try {
            await this.setSearchProduct(productName);
            await this.submitSearch();
        } catch (error) {
            console.log(`Error searching for product '${productName}': ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the search results page is displayed
     * @returns Promise<boolean> - true if the search heading is visible
     */
    async isSearchResultsPageDisplayed(): Promise<boolean> {
        try {
            const heading = (await this.searchHeading.first().innerText()).trim();
            return heading.startsWith('Search');
        } catch (error) {
            console.log(`Error checking search results page: ${error}`);
            return false;
        }
    }

    /**
     * Verifies the given product is listed in the search results
     * @param productName - Product name to look for
     * @returns Promise<boolean> - true if the product is listed
     */
    async isProductDisplayed(productName: string): Promise<boolean> {
        try {
            const product = this.page.locator('#product-list .product-thumb h4').getByRole('link', { name: productName, exact: true });
            return await product.first().isVisible();
        } catch (error) {
            console.log(`Error checking product '${productName}' in results: ${error}`);
            return false;
        }
    }

    /**
     * Gets the displayed name of the given product from the search results
     * @param productName - Product name to look for
     * @returns Promise<string> - Displayed product name
     */
    async getDisplayedProductName(productName: string): Promise<string> {
        const product = this.page.locator('#product-list .product-thumb h4').getByRole('link', { name: productName, exact: true });
        return (await product.first().innerText()).trim();
    }

    /**
     * Opens the details page of the given product from the search results
     * @param productName - Product name to open
     * @returns Promise<ProductPage> - Instance of the product details page
     */
    async openProduct(productName: string): Promise<ProductPage> {
        try {
            const product = this.page.locator('#product-list .product-thumb h4').getByRole('link', { name: productName, exact: true });
            await product.first().click();
            return new ProductPage(this.page);
        } catch (error) {
            console.log(`Error opening product '${productName}': ${error}`);
            throw error;
        }
    }
}
