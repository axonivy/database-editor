import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

const dir = process.env.SCREENSHOT_DIR ?? './target';

export const screenshot = async (page: Page, name: string) => {
  await page.setViewportSize({ width: 700, height: 550 });
  const buffer = await page.screenshot({ path: `${dir}/screenshots/${name}.png`, animations: 'disabled' });
  expect(buffer.byteLength).toBeGreaterThan(3000);
};

export const screenshotElement = async (element: Locator, name: string) => {
  const buffer = await element.screenshot({ path: `${dir}/screenshots/${name}.png`, animations: 'disabled' });
  expect(buffer.byteLength).toBeGreaterThan(3000);
};
