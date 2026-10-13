import { test as base } from '@playwright/test';
import dotenv from 'dotenv';
import { AccountPage } from '../pages/AccountPage';
import { AdminCustomerPage } from '../pages/AdminCustomerPage';
import { AdminCustomersPage } from '../pages/AdminCustomersPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { CartPage } from '../pages/CartPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { RegisterPage } from '../pages/RegisterPage';

dotenv.config();

const APP_URL = process.env.WEB_APP_URL ?? 'http://localhost/opencart/upload/';

type PageFixtures = {
    homePage: HomePage;
    registerPage: RegisterPage;
    loginPage: LoginPage;
    accountPage: AccountPage;
    productPage: ProductPage;
    cartPage: CartPage;
    adminLoginPage: AdminLoginPage;
    adminCustomersPage: AdminCustomersPage;
    adminCustomerPage: AdminCustomerPage;
};

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        await page.goto(APP_URL);
        await use(new HomePage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    accountPage: async ({ page }, use) => {
        await use(new AccountPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    adminLoginPage: async ({ page }, use) => {
        await use(new AdminLoginPage(page));
    },
    adminCustomersPage: async ({ page }, use) => {
        await use(new AdminCustomersPage(page));
    },
    adminCustomerPage: async ({ page }, use) => {
        await use(new AdminCustomerPage(page));
    },
});

test.afterEach(async ({ page, context }) => {
    if (!page.isClosed()) {
        await page.close();
    }
    if (context.pages().some((openPage) => !openPage.isClosed())) {
        await context.close();
    }
});

export { expect } from '@playwright/test';
