import type {
  Client,
  CreationError,
  DatabaseData,
  DatabaseEditorDBContext,
  DatabaseImportCreationArgs,
  DatabaseTableData,
  DatabaseTableInfoData,
  Event
} from '@axonivy/database-editor-protocol';
import { Emitter } from '@axonivy/jsonrpc';
import { creationError, databases, databaseTableData, databaseTableInfoData, mockError } from './data';

export class DatabaseClientMock implements Client {
  private databaseData: DatabaseData = databases;
  private databaseTableInfoData: DatabaseTableInfoData = databaseTableInfoData;
  private databaseTableData: DatabaseTableData = databaseTableData;
  private creationError: CreationError[] = creationError;
  private mockError: CreationError[] = mockError;

  data(): Promise<DatabaseData> {
    return Promise.resolve(this.databaseData);
  }

  databaseTableNames(): Promise<DatabaseTableData> {
    return Promise.resolve(this.databaseTableData);
  }

  databaseTableInfo(context: DatabaseEditorDBContext): Promise<DatabaseTableInfoData> {
    const data: DatabaseTableInfoData = {
      connectionName: this.databaseTableInfoData.connectionName,
      tables: this.databaseTableInfoData.tables.filter(t => context.tableNames.includes(t.name))
    };
    return Promise.resolve(data);
  }

  importFromDatabase(args: DatabaseImportCreationArgs): Promise<Array<CreationError>> {
    if (args.options[0]?.namespace.startsWith('testError')) {
      return Promise.resolve(this.mockError);
    }
    return Promise.resolve(this.creationError);
  }

  onDataChanged: Event<void> = new Emitter<void>().event;
}
