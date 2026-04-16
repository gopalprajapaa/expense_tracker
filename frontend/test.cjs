const { chromium } = require('playwright');
(async () => {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
        
        await page.goto('http://localhost:5173/app/admin/report', { waitUntil: 'load' });
        await page.waitForTimeout(2000); // wait for data load
        
        console.log('Clicking button...');
        await page.click('button:has-text("Download Report")');
        
        await page.waitForTimeout(2000); // wait to see error
        await browser.close();
    } catch(e) {
        console.error("Test script failed", e);
    }
})();
