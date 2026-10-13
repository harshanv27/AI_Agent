import { Page, Locator } from '@playwright/test';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly heading: Locator;
    private readonly priceNew: Locator;
    private readonly txtQuantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly successAlert: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.heading = page.locator('#content h1');
        this.priceNew = page.locator('#content .price-new');
        this.txtQuantity = page.locator('#input-quantity');
        this.btnAddToCart = page.locator('#button-cart');
        this.successAlert = page.locator('.alert-success');
    }

    /**
     * Verifies the product details page is displayed
     * @returns Promise<boolean> - true if the Add to Cart button is visible
     */
    async isProductPageExists(): Promise<boolean> {
        try {
            return await this.btnAddToCart.isVisible();
        } catch (error) {
            console.log(`Error checking product page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the product name from the details page
     * @returns Promise<string> - Product name
     */
    async getProductName(): Promise<string> {
        return (await this.heading.first().innerText()).trim();
    }

    /**
     * Gets the product price from the details page
     * @returns Promise<string> - Product price
     */
    async getProductPrice(): Promise<string> {
        return (await this.priceNew.first().innerText()).trim();
    }

    /**
     * Sets the product quantity
     * @param quantity - Quantity to add to the cart
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.txtQuantity.fill(quantity);
    }

    /**
     * Adds the product to the shopping cart
     */
    async addToCart(): Promise<void> {
        try {
            await this.btnAddToCart.click();
            await this.successAlert.first().waitFor({ state: 'visible' });
        } catch (error) {
            console.log(`Error adding product to cart: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the product-added confirmation message is displayed
     * @returns Promise<boolean> - true if the success alert is visible
     */
    async isProductAddedMessageDisplayed(): Promise<boolean> {
        try {
            return await this.successAlert.first().isVisible();
        } catch (error) {
            console.log(`Error checking product-added message: ${error}`);
            return false;
        }
    }

    /**
     * Gets the product-added confirmation message text
     * @returns Promise<string> - Success message text
     */
    async getAddedMessage(): Promise<string> {
        return (await this.successAlert.first().innerText()).trim();
    }
}
