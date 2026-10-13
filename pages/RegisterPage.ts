import { Page, Locator } from '@playwright/test';
import { AccountPage } from './AccountPage';

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly txtTelephone: Locator;
    private readonly txtPassword: Locator;
    private readonly txtConfirmPassword: Locator;
    private readonly chkAgree: Locator;
    private readonly btnContinue: Locator;
    private readonly heading: Locator;
    private readonly successHeading: Locator;
    private readonly lnkContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtFirstName = page.locator('#input-firstname');
        this.txtLastName = page.locator('#input-lastname');
        this.txtEmail = page.locator('#input-email');
        this.txtTelephone = page.locator('#input-telephone');
        this.txtPassword = page.locator('#input-password');
        this.txtConfirmPassword = page.locator('#input-confirm');
        this.chkAgree = page.locator('input[name="agree"]');
        this.btnContinue = page.locator('#form-register button[type="submit"]');
        this.heading = page.locator('#content h1');
        this.successHeading = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
        this.lnkContinue = page.locator('#content a:has-text("Continue")');
    }

    /**
     * Verifies the registration page is displayed
     * @returns Promise<boolean> - true if the Register Account heading is visible
     */
    async isRegisterPageExists(): Promise<boolean> {
        try {
            const title = (await this.heading.first().innerText()).trim();
            return title === 'Register Account';
        } catch (error) {
            console.log(`Error checking register page: ${error}`);
            return false;
        }
    }

    /**
     * Enters the first name
     * @param firstName - Customer first name
     */
    async setFirstName(firstName: string): Promise<void> {
        await this.txtFirstName.fill(firstName);
    }

    /**
     * Enters the last name
     * @param lastName - Customer last name
     */
    async setLastName(lastName: string): Promise<void> {
        await this.txtLastName.fill(lastName);
    }

    /**
     * Enters the email address
     * @param email - Customer email address
     */
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    /**
     * Enters the telephone number
     * @param telephone - Customer telephone number
     * @remarks The telephone field is optional and only filled when the store renders it
     */
    async setTelephone(telephone: string): Promise<void> {
        if (await this.txtTelephone.count() > 0) {
            await this.txtTelephone.fill(telephone);
        }
    }

    /**
     * Enters the password
     * @param password - Customer password
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    /**
     * Confirms the password
     * @param password - Password confirmation value
     * @remarks The confirmation field is optional and only filled when the store renders it
     */
    async setConfirmPassword(password: string): Promise<void> {
        if (await this.txtConfirmPassword.count() > 0) {
            await this.txtConfirmPassword.fill(password);
        }
    }

    /**
     * Accepts the privacy policy
     */
    async acceptPrivacyPolicy(): Promise<void> {
        await this.chkAgree.check();
    }

    /**
     * Submits the registration form
     */
    async submitRegistration(): Promise<void> {
        try {
            await this.btnContinue.click();
            await this.page.waitForURL('**account/success**');
        } catch (error) {
            console.log(`Error submitting registration: ${error}`);
            throw error;
        }
    }

    /**
     * Registers a new customer with the given details
     * @param firstName - Customer first name
     * @param lastName - Customer last name
     * @param email - Customer email address
     * @param password - Customer password
     */
    async completeRegistration(firstName: string, lastName: string, email: string, password: string): Promise<void> {
        try {
            await this.setFirstName(firstName);
            await this.setLastName(lastName);
            await this.setEmail(email);
            await this.setPassword(password);
            await this.acceptPrivacyPolicy();
            await this.submitRegistration();
        } catch (error) {
            console.log(`Error completing registration: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the account-created confirmation is displayed
     * @returns Promise<boolean> - true if the success heading is visible
     */
    async isRegistrationSuccess(): Promise<boolean> {
        try {
            return await this.successHeading.isVisible();
        } catch (error) {
            console.log(`Error checking registration success: ${error}`);
            return false;
        }
    }

    /**
     * Gets the account-created confirmation message
     * @returns Promise<string> - Confirmation message text
     */
    async getConfirmationMessage(): Promise<string> {
        return (await this.successHeading.innerText()).trim();
    }

    /**
     * Continues from the registration success page to the account page
     * @returns Promise<AccountPage> - Instance of the account page
     */
    async clickContinue(): Promise<AccountPage> {
        try {
            await this.lnkContinue.first().click();
            await this.page.waitForURL('**account/account**');
            return new AccountPage(this.page);
        } catch (error) {
            console.log(`Error continuing to account page: ${error}`);
            throw error;
        }
    }
}
