import { expect, type Page } from '@playwright/test';
import { DetailPanel } from './detail/DetailPanel';
import { MainPanel } from './main/MainPanel';

export const server = process.env.BASE_URL ?? 'http://localhost:8080/';
const ws = process.env.TEST_WS ?? '~Developer-database-editor-test-project';
const app = process.env.TEST_APP ?? 'Developer-database-editor-test-project';
export const project = 'database-editor-test-project';

export class DatabaseEditor {
  readonly page: Page;
  readonly main: MainPanel;
  readonly detail: DetailPanel;

  constructor(page: Page) {
    this.page = page;
    this.main = new MainPanel(page);
    this.detail = new DetailPanel(page);
  }

  static async openEngine(page: Page) {
    const serverUrl = server.replace(/^https?:\/\//, '');
    const url = `?server=${serverUrl}${ws}&app=${app}&project=${project}`;
    return this.openUrl(page, url);
  }

  static async openMock(page: Page, options?: { readonly?: boolean; metaJdbcDriversState?: 'isError' | 'isPending' }) {
    let url = 'mock.html';
    if (options) {
      url += '?';
      url += this.params(options);
    }
    return this.openUrl(page, url);
  }

  private static params(options: Record<string, string | boolean>) {
    let params = '';
    params += Object.entries(options)
      .map(([key, value]) => `&${key}=${value}`)
      .join('');
    return params;
  }

  private static async openUrl(page: Page, url: string) {
    const editor = new DatabaseEditor(page);
    await page.goto(url);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
    return editor;
  }

  async takeScreenshot(fileName: string) {
    const dir = process.env.SCREENSHOT_DIR ?? 'tests/screenshots/target';
    const buffer = await this.page.screenshot({ path: `${dir}/screenshots/${fileName}`, animations: 'disabled' });
    expect(buffer.byteLength).toBeGreaterThan(3000);
  }
}
