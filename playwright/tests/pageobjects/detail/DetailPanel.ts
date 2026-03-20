import type { Locator, Page } from '@playwright/test';
import { AdditionalPropertiesCollapsible } from './AdditionalPropertiesCollapsible';
import { GeneralCollapsible } from './GeneralCollapsible';
import { PropertiesCollapsible } from './PropertiesCollapsible';

export class DetailPanel {
  readonly locator: Locator;
  readonly header: Locator;
  readonly panelMessage: Locator;
  readonly general: GeneralCollapsible;
  readonly properties: PropertiesCollapsible;
  readonly additionalProperties: AdditionalPropertiesCollapsible;

  constructor(page: Page) {
    this.locator = page.locator('#database-editor-detail');
    this.header = this.locator.locator('.ui-sidebar-header');
    this.panelMessage = this.locator.locator('.ui-panel-message');
    this.general = new GeneralCollapsible(page, this.locator);
    this.properties = new PropertiesCollapsible(this.locator);
    this.additionalProperties = new AdditionalPropertiesCollapsible(this.locator);
  }
}
