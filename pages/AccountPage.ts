import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';

export class AccountPage {
    private readonly page: Page;

    // Locators
    private readonly heading: Locator;
    private readonly myAccountToggle: Locator;
    private readonly lnkLogout: Locator;
    private readonly lnkContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.heading = page.locator('#content h1');
        this.myAccountToggle = page.locator('#top span.dropdown-toggle:has-text("My Account")');
        this.lnkLogout = page.locator('#top a[href*="account/logout"]');
        this.lnkContinue = page.locator('#content a:has-text("Continue")');
    }

    /**
     * Verifies the authenticated My Account page is displayed
     * @returns Promise<boolean> - true if the My Account heading is visible
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            const title = (await this.heading.first().innerText()).trim();
            return title === 'My Account';
        } catch (error) {
            console.log(`Error checking My Account page: ${error}`);
            return false;
        }
    }

    /**
     * Verifies the authenticated account navigation is available
     * @returns Promise<boolean> - true if the authenticated My Account navigation (Logout) is present
     */
    async isAccountNavigationDisplayed(): Promise<boolean> {
        try {
            return (await this.lnkLogout.count()) > 0;
        } catch (error) {
            console.log(`Error checking account navigation: ${error}`);
            return false;
        }
    }

    /**
     * Opens the My Account dropdown in the header
     */
    async openMyAccountMenu(): Promise<void> {
        await this.myAccountToggle.click();
    }

    /**
     * Clicks the Logout option and navigates to the logout confirmation page
     */
    async clickLogout(): Promise<void> {
        try {
            await this.lnkLogout.first().click();
            await this.page.waitForURL('**account/logout**');
        } catch (error) {
            console.log(`Error logging out: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the logout confirmation page is displayed
     * @returns Promise<boolean> - true if the Account Logout heading is visible
     */
    async isLogoutPageExists(): Promise<boolean> {
        try {
            const title = (await this.heading.first().innerText()).trim();
            return title === 'Account Logout';
        } catch (error) {
            console.log(`Error checking logout page: ${error}`);
            return false;
        }
    }

    /**
     * Continues from the logout confirmation page back to the home page
     * @returns Promise<HomePage> - Instance of the home page
     */
    async clickContinue(): Promise<HomePage> {
        try {
            await this.lnkContinue.first().click();
            await this.page.waitForURL('**common/home**');
            return new HomePage(this.page);
        } catch (error) {
            console.log(`Error continuing to home page: ${error}`);
            throw error;
        }
    }
}
