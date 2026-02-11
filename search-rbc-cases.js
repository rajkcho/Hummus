const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Go to Ontario Courts Public Portal
    console.log('Navigating to Ontario Courts Portal...');
    await page.goto('https://courts.ontario.ca/portal/home', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait a moment for page to load
    await page.waitForTimeout(2000);
    
    // Look for party search option
    console.log('Looking for search options...');
    const pageContent = await page.content();
    
    // Try to find and click party search
    const partySearchLink = await page.$('text=Party Search');
    if (partySearchLink) {
      console.log('Found Party Search link, clicking...');
      await partySearchLink.click();
      await page.waitForTimeout(2000);
    }
    
    // Try alternative selectors
    const searchLink = await page.$('a[href*="party"]');
    if (searchLink) {
      await searchLink.click();
      await page.waitForTimeout(2000);
    }
    
    // Get current URL and content
    console.log('Current URL:', page.url());
    
    // Try to fill in search for Royal Bank of Canada
    const nameInput = await page.$('input[name*="party"], input[placeholder*="name"], input[id*="party"], input[type="text"]');
    if (nameInput) {
      console.log('Found name input, entering Royal Bank of Canada...');
      await nameInput.fill('Royal Bank of Canada');
    }
    
    // Look for defendant/respondent role selector
    const roleSelect = await page.$('select[name*="role"], select[id*="role"]');
    if (roleSelect) {
      console.log('Found role selector...');
      await roleSelect.selectOption({ label: 'Defendant' }).catch(() => {});
      await roleSelect.selectOption({ label: 'Respondent' }).catch(() => {});
    }
    
    // Look for case type selector for employment
    const caseTypeSelect = await page.$('select[name*="type"], select[id*="type"], select[name*="classification"]');
    if (caseTypeSelect) {
      console.log('Found case type selector...');
      const options = await caseTypeSelect.$$eval('option', opts => opts.map(o => ({ value: o.value, text: o.textContent })));
      console.log('Available case types:', JSON.stringify(options, null, 2));
    }
    
    // Take screenshot
    await page.screenshot({ path: '/home/openclaw/.openclaw/workspace/courts-portal.png', fullPage: true });
    console.log('Screenshot saved to courts-portal.png');
    
    // Get page text content
    const text = await page.evaluate(() => document.body.innerText);
    console.log('\n--- Page Content ---\n');
    console.log(text.substring(0, 5000));
    
  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({ path: '/home/openclaw/.openclaw/workspace/courts-error.png', fullPage: true });
  }
  
  await browser.close();
})();
