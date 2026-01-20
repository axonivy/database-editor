import { expect, type Locator, type Page } from '@playwright/test';
import { randomUUID } from 'crypto';
import { DetailPanel } from './detail/DetailPanel';
import { MainPanel } from './main/MainPanel';

export const server = process.env.BASE_URL ?? 'http://localhost:8080/';
const user = 'Developer';
const ws = process.env.TEST_WS ?? '~Developer-database-editor-test-project';
const app = process.env.TEST_APP ?? 'Developer-database-editor-test-project';
export const pmv = 'database-editor-test-project';

const tmpDir = '/tmp';

export class DatabaseEditor {
  readonly page: Page;
  readonly locator: Locator;
  readonly main: MainPanel;
  readonly detail: DetailPanel;
  private readonly pmv?: string;

  constructor(page: Page, pmv?: string) {
    this.page = page;
    this.locator = page.locator(':root');
    this.main = new MainPanel(page);
    this.detail = new DetailPanel(page, this.locator);
    this.pmv = pmv;
  }

  static async openEngine(page: Page, pmv: string) {
    const serverUrl = server.replace(/^https?:\/\//, '');
    const url = `?server=${serverUrl}${ws}&app=${app}&pmv=${pmv}`;
    return this.openUrl(page, url, pmv);
  }

  static async openNewEngine(page: Page) {
    const pmv = 'project' + randomUUID().replaceAll('-', '');
    const result = await fetch(`${server}${ws}/api/web-ide/project/new`, {
      method: 'POST',
      headers: {
        'X-Requested-By': 'database-editor-tests',
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(user + ':' + user).toString('base64')
      },
      body: JSON.stringify({
        name: pmv,
        groupId: `database.test.${pmv}`,
        projectId: `database-test-${pmv}`,
        path: `${tmpDir}/${pmv}`
      })
    });
    if (!result.ok) {
      throw Error(`Failed to create project: ${result.status}`);
    }
    return await this.openEngine(page, pmv);
  }

  static async openMock(page: Page, options?: { readonly?: boolean }) {
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

  private static async openUrl(page: Page, url: string, pmv?: string) {
    const editor = new DatabaseEditor(page, pmv);
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

  async deletePmv() {
    const result = await fetch(`${server}${ws}/api/web-ide/project?app=${app}&pmv=${this.pmv}`, {
      method: 'DELETE',
      headers: {
        'X-Requested-By': 'cms-editor-tests',
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(user + ':' + user).toString('base64')
      }
    });
    if (!result.ok) {
      throw Error(`Failed to delete project: ${result.status}`);
    }
  }
}
