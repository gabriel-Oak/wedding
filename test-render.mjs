import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  await page.goto('http://localhost:3000/convite?guestPhone=+553891364011', { waitUntil: 'networkidle', timeout: 30000 });
  const title = await page.title();
  console.log('Page title:', title);
  
  // Check for key elements
  const h1 = await page.$('h1');
  if (h1) {
    const text = await h1.textContent();
    console.log('H1 found:', text);
  }
  
  const cards = await page.$$('.card, [data-testid*="card"]');
  console.log('Cards found:', cards.length);
  
  const rsvp = await page.$('[data-testid*="rsvp"], .rsvp-form');
  console.log('RSVP form found:', !!rsvp);
  
  console.log('\n✅ Page rendered successfully!');
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
} finally {
  await browser.close();
}
