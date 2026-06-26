import { test, expect } from '@playwright/test';

test.describe('Save the Date Landing Page', () => {

  test('hero section is visible', async ({ page }) => {
    await page.goto('/');
    // Assert hero heading is visible
    await expect(page.getByRole('heading', { name: 'Gabriel & Mariana' })).toBeVisible();
    // Assert date badge is visible
    await expect(page.getByText('08 . 11 . 2026')).toBeVisible();
    // Assert "SAVE THE DATE" label is visible
    await expect(page.getByLabel('Save the Date label')).toBeVisible();
  });

  test('countdown section displays time', async ({ page }) => {
    await page.goto('/');
    // Assert countdown labels are present
    await expect(page.getByText('DIAS')).toBeVisible();
    await expect(page.getByText('HORAS')).toBeVisible();
    await expect(page.getByText('MINUTOS')).toBeVisible();
    await expect(page.getByText('SEGUNDOS')).toBeVisible();
    // Assert countdown numbers are present
    const numbers = page.locator('section.bg-wedding-cream span.font-heading');
    await expect(numbers).toHaveCount(4);
  });

  test('calendar button is visible and clickable', async ({ page }) => {
    await page.goto('/');
    // Assert CTA button is visible
    const button = page.getByRole('button', { name: /salve a data/i });
    await expect(button).toBeVisible();
    // Button should be clickable
    await expect(button).toBeEnabled();
  });

  test('footer contains RSVP message', async ({ page }) => {
    await page.goto('/');
    // Assert footer romantic phrase is visible
    await expect(page.getByText(/nos vemos em 08 de novembro/i)).toBeVisible();
    // Assert RSVP notice is visible
    await expect(page.getByText(/convite oficial/i)).toBeVisible();
  });

  test('page is responsive — mobile viewport', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const page = await context.newPage();
    await page.goto('/');
    
    // Assert all sections are visible on mobile
    await expect(page.getByLabel('Save the Date label')).toBeVisible();
    await expect(page.getByText('08 . 11 . 2026')).toBeVisible();
    await expect(page.getByText('Contagem Regressiva')).toBeVisible();
    await expect(page.getByText(/nos vemos em 08 de novembro/i)).toBeVisible();

    await page.close();
    await context.close();
  });

});
