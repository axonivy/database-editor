import { type Locator, type Page } from '@playwright/test';
import { Button } from './Button';
import { CreationPage } from './CreationPage';
import { DataSourcePage } from './DataSourcePage';
import { TableSelectionPage } from './TableSelectionPage';
import { Timeline } from './Timeline';

export class ImportDialog {
  readonly trigger: Button;
  readonly next: Button;
  readonly create: Button;
  readonly back: Button;
  readonly locator: Locator;
  readonly timeline: Timeline;
  readonly dataSourcePage: DataSourcePage;
  readonly tableSelectionPage: TableSelectionPage;
  readonly creationPage: CreationPage;

  constructor(page: Page, parent: Locator) {
    this.trigger = new Button(parent, { name: 'Import Wizard' });
    this.locator = parent.getByRole('dialog');
    this.next = new Button(this.locator, { name: 'Go to next step' });
    this.create = new Button(this.locator, { name: 'Create' });
    this.back = new Button(this.locator, { name: 'Back' });
    this.timeline = new Timeline(this.locator);
    this.dataSourcePage = new DataSourcePage(page, this.locator);
    this.tableSelectionPage = new TableSelectionPage(page, this.locator);
    this.creationPage = new CreationPage(page, this.locator);
  }

  async open() {
    await this.trigger.click();
  }
}
