import { Page, Locator } from '@playwright/test';

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly heading: Locator;
    private readonly cartRows: Locator;
    private readonly txtQuantity: Locator;
    private readonly totalRows: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.heading = page.locator('#content h1');
        this.cartRows = page.locator('#output-cart table tbody tr');
        this.txtQuantity = page.locator('#output-cart input[name="quantity"]');
        this.totalRows = page.locator('#checkout-total tr');
    }

    /**
     * Verifies the shopping cart page is displayed
     * @returns Promise<boolean> - true if the Shopping Cart heading is visible
     */
    async isCartPageExists(): Promise<boolean> {
        try {
            const title = (await this.heading.first().innerText()).trim();
            return title.startsWith('Shopping Cart');
        } catch (error) {
            console.log(`Error checking cart page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the product name shown in the first cart row
     * @returns Promise<string> - Product name
     */
    async getProductName(): Promise<string> {
        const productCell = this.cartRows.first().locator('td').nth(1);
        return (await productCell.locator('a').first().innerText()).trim();
    }

    /**
     * Gets the quantity shown in the first cart row
     * @returns Promise<string> - Quantity value
     */
    async getQuantity(): Promise<string> {
        return (await this.txtQuantity.first().inputValue()).trim();
    }

    /**
     * Gets the unit price shown in the first cart row
     * @returns Promise<string> - Unit price
     */
    async getProductUnitPrice(): Promise<string> {
        const priceCells = this.cartRows.first().locator('td.text-end');
        return (await priceCells.nth(0).innerText()).trim();
    }

    /**
     * Gets the line total shown in the first cart row
     * @returns Promise<string> - Line total
     */
    async getProductTotal(): Promise<string> {
        const priceCells = this.cartRows.first().locator('td.text-end');
        return (await priceCells.nth(1).innerText()).trim();
    }

    /**
     * Gets the overall cart total from the totals section
     * @returns Promise<string> - Cart total
     */
    async getCartTotal(): Promise<string> {
        const count = await this.totalRows.count();
        for (let i = 0; i < count; i++) {
            const row = this.totalRows.nth(i);
            const label = (await row.locator('td').first().innerText()).trim();
            if (label.toLowerCase() === 'total') {
                return (await row.locator('td').last().innerText()).trim();
            }
        }
        return '';
    }

    /**
     * Verifies the given product is present in the cart
     * @param productName - Product name to look for
     * @returns Promise<boolean> - true if the product is in the cart
     */
    async isProductInCart(productName: string): Promise<boolean> {
        try {
            const productCell = this.cartRows.first().locator('td').nth(1);
            const name = (await productCell.locator('a').first().innerText()).trim();
            return name.includes(productName);
        } catch (error) {
            console.log(`Error checking product '${productName}' in cart: ${error}`);
            return false;
        }
    }
}
