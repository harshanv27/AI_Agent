import { Page, Locator } from '@playwright/test';
import { AdminCustomerPage } from './AdminCustomerPage';

export class AdminCustomersPage {
    private readonly page: Page;

    // Locators
    private readonly customerRows: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.customerRows = page.locator('#content table tbody tr');
    }

    /**
     * Navigates to the Customers list in the admin portal
     */
    async gotoCustomers(): Promise<void> {
        const url = new URL(this.page.url());
        url.searchParams.set('route', 'customer/customer');
        url.searchParams.delete('filter_email');
        await this.page.goto(url.toString());
    }

    /**
     * Searches the Customers list for the given email address
     * @param email - Customer email address to search for
     */
    async searchCustomer(email: string): Promise<void> {
        const url = new URL(this.page.url());
        url.searchParams.set('route', 'customer/customer');
        url.searchParams.set('filter_email', email);
        await this.page.goto(url.toString());
    }

    /**
     * Verifies a customer with the given email is listed
     * @param email - Customer email address to look for
     * @returns Promise<boolean> - true if the customer is listed
     */
    async isCustomerExists(email: string): Promise<boolean> {
        try {
            const count = await this.customerRows.count();
            for (let i = 0; i < count; i++) {
                const rowText = await this.customerRows.nth(i).innerText();
                if (rowText.includes(email)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log(`Error checking customer '${email}' in admin: ${error}`);
            return false;
        }
    }

    /**
     * Opens the customer record with the given email
     * @param email - Customer email address to open
     * @returns Promise<AdminCustomerPage> - Instance of the admin customer page
     */
    async openCustomer(email: string): Promise<AdminCustomerPage> {
        try {
            const row = this.customerRows.filter({ hasText: email }).first();
            await row.locator('a[title="Edit"]').first().click();
            await this.page.waitForURL('**route=customer/customer.form**');
            return new AdminCustomerPage(this.page);
        } catch (error) {
            console.log(`Error opening customer '${email}' in admin: ${error}`);
            throw error;
        }
    }
}
