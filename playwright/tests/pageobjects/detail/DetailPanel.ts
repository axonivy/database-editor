import type { Locator, Page } from '@playwright/test';
import { AdditionalPropertiesCollapsible } from './AdditionalPropertiesCollapsible';
import { GeneralCollapsible } from './GeneralCollapsible';
import { PropertiesCollapsible } from './PropertiesCollapsible';

export class DetailPanel {
  readonly locator: Locator;
  readonly toolbar: Locator;
  readonly panelMessage: Locator;
  readonly general: GeneralCollapsible;
  readonly properties: PropertiesCollapsible;
  readonly additionalProperties: AdditionalPropertiesCollapsible;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.database-editor-detail-panel');
    this.toolbar = this.locator.locator('.database-editor-detail-toolbar');
    this.panelMessage = this.locator.locator('.ui-panel-message');
    this.general = new GeneralCollapsible(page, this.locator);
    this.properties = new PropertiesCollapsible(this.locator);
    this.additionalProperties = new AdditionalPropertiesCollapsible(this.locator);
  }
}
