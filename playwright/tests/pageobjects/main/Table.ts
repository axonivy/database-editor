import { expect, type Locator } from '@playwright/test';

export class Table {
  readonly locator: Locator;
  readonly headers: Locator;
  readonly rows: Locator;

  constructor(parent: Locator) {
    this.locator = parent.locator('table');
    this.headers = this.locator.locator('th');
    this.rows = this.locator.locator('tbody').getByRole('row');
  }

  header(index: number) {
    return new Header(this.headers, index);
  }

  row(index: number) {
    return new Row(this.rows, index);
  }

  async expectToHaveNoSelection() {
    for (let i = 0; i < (await this.rows.count()); i++) {
      await this.row(i).expectNotToBeSelected();
    }
  }
}

export class Header {
  readonly locator: Locator;
  readonly sort: Locator;

  constructor(headers: Locator, index: number) {
    this.locator = headers.nth(index);
    this.sort = this.locator.getByRole('button');
  }
}

export class Row {
  readonly locator: Locator;

  constructor(rows: Locator, index: number) {
    this.locator = rows.nth(index);
  }

  column(column: number) {
    return new Cell(this.locator, column);
  }

  async expectToBeSelected() {
    await expect(this.locator).toHaveAttribute('data-state', 'selected');
  }

  async expectNotToBeSelected() {
    await expect(this.locator).toHaveAttribute('data-state', 'unselected');
  }
}

export class Cell {
  readonly locator: Locator;

  constructor(rowLocator: Locator, index: number) {
    this.locator = rowLocator.getByRole('cell').nth(index);
  }
}
