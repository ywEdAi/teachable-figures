import { mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

// Screenshots each lesson's figure pane for the example directory cards, in both languages and color schemes.
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const examples = fileURLToPath(new URL('../examples/', import.meta.url));
const out = fileURLToPath(new URL('../examples/previews/', import.meta.url));
// Crop to the figure where it stands alone; keep the whole pane where readouts are the picture.
// Where the reset state hides the mechanism, a setup step reveals it before the capture.
const stages = {
  'how-it-works': { selector: '#experiment', setup: async page => {
    await page.locator('input[name="prediction"][value="spec"]').check();
    await page.locator('#prediction-form button[type="submit"]').click();
    await page.locator('input[name="request"][value="chest"]').check();
    await page.locator('#skip-renderer').check();
  } },
  'geometry-slices': { selector: '#experiment .stage' },
  'human-anatomy': { selector: '#experiment .stage', setup: page => page.locator('#cutaway').check() },
  'rocket-launch': { selector: '#experiment' },
  'transformer-flow': { selector: '#experiment', setup: page => page.locator('[data-stage="3"]').click() },
  'chinese-clothing': { selector: '#experiment .stage' },
  'gear-ratio': { selector: '#experiment .stage' },
};
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  for (const [name, { selector, setup }] of Object.entries(stages)) {
    for (const lang of ['zh', 'en']) {
      for (const colorScheme of ['light', 'dark']) {
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, colorScheme, reducedMotion: 'reduce' });
        await page.goto(`${pathToFileURL(`${examples}${name}.html`).href}?lang=${lang}`);
        await setup?.(page);
        await page.waitForTimeout(600);
        await page.locator(selector).first().screenshot({ path: `${out}${name}-${lang}-${colorScheme}.jpg`, type: 'jpeg', quality: 80 });
        await page.close();
        console.log(`${name}-${lang}-${colorScheme}.jpg`);
      }
    }
  }
} finally {
  await browser.close();
}
