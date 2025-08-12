import type { Client, DatabaseData, DatabaseInfoData, Event } from '@axonivy/database-editor-protocol';
import { databaseInfoData, databases } from './data';

export class DatabaseClientMock implements Client {
  private databaseData: DatabaseData = databases;
  private databaseInfoData: DatabaseInfoData = databaseInfoData;

  data(): Promise<DatabaseData> {
    return Promise.resolve(this.databaseData);
  }

  databaseInfo(): Promise<DatabaseInfoData> {
    return Promise.resolve(this.databaseInfoData);
  }

  onDataChanged: Event<void>;
}
