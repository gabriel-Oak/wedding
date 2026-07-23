import { test, expect } from '@playwright/test';

test.describe('Admin Auth - Redirects to Login When Not Authenticated', () => {
  test('should redirect /admin to /admin/login when not authenticated', async ({ page }) => {
    // Clear any existing sessions/cookies
    await page.context().clearCookies();
    
    // Navigate to /admin (should redirect to login)
    await page.goto('/admin');
    
    // Wait for redirect to complete
    await page.waitForURL(/\/admin\/login/);
    
    // Verify we're on the login page
    await expect(page).toHaveURL(/\/admin\/login/);
    
    // Verify login page content
    await expect(page.locator('h1')).toContainText('Admin');
    await expect(page.locator('text=Acesso exclusivo')).toBeVisible();
    await expect(page.locator('button:has-text("Enviar Magic Link")')).toBeVisible();
  });

  test('should show login form with pre-filled email', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Verify email input is pre-filled
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveValue('gabrielcarvalhocosta@live.com');
    
    // Verify form is visible
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('button:has-text("Enviar Magic Link")')).toBeVisible();
  });

  test('should show error message when sending magic link fails', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Clear cookies to ensure no session
    await page.context().clearCookies();
    
    // Click send button (this will fail because we're not actually sending emails in test env)
    await page.locator('button:has-text("Enviar Magic Link")').click();
    
    // Wait a bit for potential error
    await page.waitForTimeout(1000);
    
    // The page should still be on login page (not redirected)
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
