import { Page, Locator } from '@playwright/test';

export class AdminCustomerPage {
    private readonly page: Page;

    // Locators
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly chkStatus: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtFirstName = page.locator('#input-firstname');
        this.txtLastName = page.locator('#input-lastname');
        this.txtEmail = page.locator('#input-email');
        this.chkStatus = page.locator('#input-status');
    }

    /**
     * Verifies the customer record form is displayed
     * @returns Promise<boolean> - true if the first name field is visible
     */
    async isCustomerFormDisplayed(): Promise<boolean> {
        try {
            return await this.txtFirstName.isVisible();
        } catch (error) {
            console.log(`Error checking admin customer form: ${error}`);
            return false;
        }
    }

    /**
     * Gets the customer's first name from the record
     * @returns Promise<string> - Customer first name
     */
    async getFirstName(): Promise<string> {
        return (await this.txtFirstName.inputValue()).trim();
    }

    /**
     * Gets the customer's last name from the record
     * @returns Promise<string> - Customer last name
     */
    async getLastName(): Promise<string> {
        return (await this.txtLastName.inputValue()).trim();
    }

    /**
     * Gets the customer's email from the record
     * @returns Promise<string> - Customer email address
     */
    async getEmail(): Promise<string> {
        return (await this.txtEmail.inputValue()).trim();
    }

    /**
     * Verifies the customer status is enabled
     * @returns Promise<boolean> - true if the status checkbox is checked
     */
    async isStatusEnabled(): Promise<boolean> {
        return await this.chkStatus.isChecked();
    }
}
