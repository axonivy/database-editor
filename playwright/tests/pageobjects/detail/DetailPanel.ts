import type { Locator } from '@playwright/test';

export class DetailPanel {
  readonly locator: Locator;
  readonly title: Locator;
  readonly collapsibles: Locator;

  constructor(parent: Locator) {
    this.locator = parent.locator('.database-editor-detail-panel');
    this.title = this.locator.locator('.database-editor-detail-toolbar');
    this.collapsibles = this.locator.locator('.ui-collapsible');
  }
}
