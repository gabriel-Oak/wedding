import { test, expect } from '@playwright/test';

test.describe('RSVP Form - Disabled State', () => {
  test('should disable buttons when status is Confirmado', async ({ page }) => {
    // Rayane's phone is already "Confirmado" in the database
    await page.goto('/convite?guestPhone=+553891364011');
    
    // Wait for the page to load and RSVP form to render
    await page.waitForSelector('[aria-label="Status: Confirmado"]');
    
    // Check that all RSVP buttons are disabled
    const buttons = page.locator('[aria-label^="Status:"]');
    await expect(buttons).toHaveCount(3); // Pendente, Confirmado, Recusado
    
    // Each button should be disabled
    for (const button of await buttons.all()) {
      await expect(button).toBeDisabled();
    }
    
    // Check that buttons have the disabled styling (opacity-60)
    for (const button of await buttons.all()) {
      await expect(button).toHaveClass(/opacity-60/);
    }
  });

  test('should show correct active status', async ({ page }) => {
    await page.goto('/convite?guestPhone=+553891364011');
    
    // The "Confirmado" button should be active (aria-pressed="true")
    const confirmadoButton = page.locator('[aria-label="Status: Confirmado"]');
    await expect(confirmadoButton).toHaveAttribute('aria-pressed', 'true');
    
    // Other buttons should not be active
    const pendenteButton = page.locator('[aria-label="Status: Pendente"]');
    const recusadoButton = page.locator('[aria-label="Status: Recusado"]');
    await expect(pendenteButton).not.toHaveAttribute('aria-pressed', 'true');
    await expect(recusadoButton).not.toHaveAttribute('aria-pressed', 'true');
  });
});
