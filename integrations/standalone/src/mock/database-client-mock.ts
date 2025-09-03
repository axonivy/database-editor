import type { Client, CreationError, DatabaseData, DatabaseInfoData, Event } from '@axonivy/database-editor-protocol';
import { Emitter } from '@axonivy/jsonrpc';
import { creationError, databaseInfoData, databases } from './data';

export class DatabaseClientMock implements Client {
  private databaseData: DatabaseData = databases;
  private databaseInfoData: DatabaseInfoData = databaseInfoData;
  private creationError: CreationError[] = creationError;

  data(): Promise<DatabaseData> {
    return Promise.resolve(this.databaseData);
  }

  databaseInfo(): Promise<DatabaseInfoData> {
    return Promise.resolve(this.databaseInfoData);
  }

  importFromDatabase(): Promise<Array<CreationError>> {
    return Promise.resolve(this.creationError);
  }

  onDataChanged: Event<void> = new Emitter<void>().event;
}
