import { Page, Locator } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly formLogin: Locator;
    private readonly txtEmail: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly alertDanger: Locator;
    private readonly lnkLogout: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.formLogin = page.locator('#form-login');
        this.txtEmail = page.locator('#input-email');
        this.txtPassword = page.locator('#input-password');
        this.btnLogin = page.locator('#form-login button[type="submit"]');
        this.alertDanger = page.locator('.alert-danger');
        this.lnkLogout = page.locator('#top a[href*="account/logout"]');
    }

    /**
     * Verifies the login page is displayed
     * @returns Promise<boolean> - true if the login form is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            return await this.formLogin.isVisible();
        } catch (error) {
            console.log(`Error checking login page: ${error}`);
            return false;
        }
    }

    /**
     * Enters the login email address
     * @param email - Customer email address
     */
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    /**
     * Enters the login password
     * @param password - Customer password
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    /**
     * Submits the login form
     */
    async submitLogin(): Promise<void> {
        await this.btnLogin.click();
    }

    /**
     * Logs in with the given credentials
     * @param email - Customer email address
     * @param password - Customer password
     */
    async login(email: string, password: string): Promise<void> {
        try {
            await this.setEmail(email);
            await this.setPassword(password);
            await this.submitLogin();
            await this.page.waitForURL('**account/account**');
        } catch (error) {
            console.log(`Error logging in: ${error}`);
            throw error;
        }
    }

    /**
     * Gets the warning/error message shown after a failed login
     * @returns Promise<string> - Warning message text
     */
    async getWarningMessage(): Promise<string> {
        return (await this.alertDanger.first().innerText()).trim();
    }

    /**
     * Verifies the login warning/error message is displayed
     * @returns Promise<boolean> - true if the warning alert is visible
     */
    async isWarningMessageDisplayed(): Promise<boolean> {
        try {
            await this.alertDanger.first().waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking login warning message: ${error}`);
            return false;
        }
    }

    /**
     * Verifies the customer is authenticated
     * @returns Promise<boolean> - true if the authenticated account navigation (Logout) is present
     */
    async isCustomerAuthenticated(): Promise<boolean> {
        try {
            return (await this.lnkLogout.count()) > 0;
        } catch (error) {
            console.log(`Error checking authentication state: ${error}`);
            return false;
        }
    }
}
