import type {
  Client,
  CreationError,
  DatabaseData,
  DatabaseImportCreationArgs,
  DatabaseInfoData,
  Event
} from '@axonivy/database-editor-protocol';
import { Emitter } from '@axonivy/jsonrpc';
import { creationError, databaseInfoData, databases, mockError } from './data';

export class DatabaseClientMock implements Client {
  private databaseData: DatabaseData = databases;
  private databaseInfoData: DatabaseInfoData = databaseInfoData;
  private creationError: CreationError[] = creationError;
  private mockError: CreationError[] = mockError;

  data(): Promise<DatabaseData> {
    return Promise.resolve(this.databaseData);
  }

  databaseInfo(): Promise<DatabaseInfoData> {
    return Promise.resolve(this.databaseInfoData);
  }

  importFromDatabase(args: DatabaseImportCreationArgs): Promise<Array<CreationError>> {
    if (args.options[0]?.name.startsWith('testError')) {
      return Promise.resolve(this.mockError);
    }
    return Promise.resolve(this.creationError);
  }

  onDataChanged: Event<void> = new Emitter<void>().event;
}
