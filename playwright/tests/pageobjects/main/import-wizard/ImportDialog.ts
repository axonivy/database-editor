import { type Locator, type Page } from '@playwright/test';
import { CreationPage } from './CreationPage';
import { DataSourcePage } from './DataSourcePage';
import { ResultPage } from './ResultPage';
import { TableSelectionPage } from './TableSelectionPage';
import { Timeline } from './Timeline';

export class ImportDialog {
  readonly trigger: Locator;
  readonly next: Locator;
  readonly create: Locator;
  readonly back: Locator;
  readonly locator: Locator;
  readonly timeline: Timeline;
  readonly dataSourcePage: DataSourcePage;
  readonly tableSelectionPage: TableSelectionPage;
  readonly creationPage: CreationPage;
  readonly resultPage: ResultPage;

  constructor(page: Page, parent: Locator) {
    this.locator = page.getByRole('dialog', { name: 'Generate' });
    this.trigger = parent.getByRole('button', { name: 'Generate' });
    this.next = this.locator.getByRole('button', { name: 'Next' });
    this.create = this.locator.getByRole('button', { name: 'Generate' });
    this.back = this.locator.getByRole('button', { name: 'Back' });
    this.timeline = new Timeline(this.locator);
    this.dataSourcePage = new DataSourcePage(page, this.locator);
    this.tableSelectionPage = new TableSelectionPage(page, this.locator);
    this.creationPage = new CreationPage(page, this.locator);
    this.resultPage = new ResultPage(page, this.locator);
  }
}
