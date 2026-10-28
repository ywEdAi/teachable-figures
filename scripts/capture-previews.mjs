import { mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

// Screenshots each lesson's stage for the example directory cards, in both color schemes.
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const examples = fileURLToPath(new URL('../examples/', import.meta.url));
const out = fileURLToPath(new URL('../examples/previews/', import.meta.url));
// Each entry names the stage to crop and, where the reset view hides the mechanism, the setup that reveals it.
const stages = {
  'geometry-slices': { selector: '#stage' },
  'human-anatomy': { selector: '.viewport', setup: page => page.locator('#cutaway').check() },
  'rocket-launch': { selector: '#rocket-structure' },
  'transformer-flow': { selector: '#experiment', setup: page => page.locator('[data-stage="3"]').click() },
  'chinese-clothing': { selector: '#garment' },
  'gear-ratio': { selector: '#diagram' },
};
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  for (const [name, { selector, setup }] of Object.entries(stages)) {
    for (const colorScheme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1.5, colorScheme, reducedMotion: 'reduce' });
      await page.goto(pathToFileURL(`${examples}${name}.html`).href);
      await setup?.(page);
      await page.waitForTimeout(600);
      await page.locator(selector).first().screenshot({ path: `${out}${name}-${colorScheme}.jpg`, type: 'jpeg', quality: 78 });
      await page.close();
      console.log(`${name}-${colorScheme}.jpg`);
    }
  }
} finally {
  await browser.close();
}
