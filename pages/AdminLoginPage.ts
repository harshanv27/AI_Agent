import { Page, Locator } from '@playwright/test';

export class AdminLoginPage {
    private readonly page: Page;

    // Locators
    private readonly txtUsername: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtUsername = page.locator('#input-username');
        this.txtPassword = page.locator('#input-password');
        this.btnLogin = page.getByRole('button', { name: 'Login' });
    }

    /**
     * Navigates to the OpenCart admin portal login page
     */
    async goto(): Promise<void> {
        const baseUrl = process.env.WEB_APP_URL ?? 'http://localhost/opencart/upload/';
        await this.page.goto(`${baseUrl}admin/index.php`);
    }

    /**
     * Verifies the admin login page is displayed
     * @returns Promise<boolean> - true if the username field is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            return await this.txtUsername.isVisible();
        } catch (error) {
            console.log(`Error checking admin login page: ${error}`);
            return false;
        }
    }

    /**
     * Enters the administrator username
     * @param username - Administrator username
     */
    async setUsername(username: string): Promise<void> {
        await this.txtUsername.fill(username);
    }

    /**
     * Enters the administrator password
     * @param password - Administrator password
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    /**
     * Logs in to the admin portal with the given credentials
     * @param username - Administrator username
     * @param password - Administrator password
     */
    async login(username: string, password: string): Promise<void> {
        try {
            await this.setUsername(username);
            await this.setPassword(password);
            await this.btnLogin.click();
            await this.page.waitForURL('**route=common/dashboard**');
        } catch (error) {
            console.log(`Error logging into admin portal: ${error}`);
            throw error;
        }
    }
}
