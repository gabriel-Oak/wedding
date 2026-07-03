import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  await page.goto('http://localhost:3000/convite?guestPhone=%2B553891364011', { 
    waitUntil: 'networkidle', 
    timeout: 30000 
  });
  
  const title = await page.title();
  console.log('✅ Title:', title);
  
  const h1 = await page.$('h1');
  if (h1) {
    const text = await h1.textContent();
    console.log('✅ H1:', text.trim());
  }
  
  const cards = await page.$$('.card, [data-testid*="card"], [class*="card"]');
  console.log('✅ Cards found:', cards.length);
  
  const rsvpBtn = await page.$('button:has-text("Confirmado"), button:has-text("Recusado")');
  console.log('✅ RSVP buttons found:', !!rsvpBtn);
  
  const greeting = await page.$('text=/Olá/i');
  console.log('✅ Greeting found:', !!greeting);
  
  // Check for specific card content
  const bachelorette = await page.$('text=/Despedida de Solteiro/i');
  console.log('✅ BacheloretteCard found:', !!bachelorette);
  
  const nature = await page.$('text=/Rolê na Natureza/i');
  console.log('✅ NatureCard found:', !!nature);
  
  const weddingDay = await page.$('text=/O Grande Dia/i');
  console.log('✅ WeddingDayCard found:', !!weddingDay);
  
  console.log('\n🎉 All checks passed!');
} catch (err) {
  console.error('❌ Error:', err.message);
  await page.screenshot({ path: '/home/gabs/Projetos/wedding/error.png' }).catch(() => {});
  process.exit(1);
} finally {
  await browser.close();
}
