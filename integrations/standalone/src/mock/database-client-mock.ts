import type {
  Client,
  CreationError,
  DatabaseConnectionData,
  DatabaseData,
  DatabaseEditorDBContext,
  DatabaseImportCreationArgs,
  DatabaseTableData,
  DatabaseTableInfoData,
  Event,
  JdbcDriverProperties,
  MetaRequestTypes
} from '@axonivy/database-editor-protocol';
import { Emitter } from '@axonivy/jsonrpc';
import { conenctions, creationError, databases, databaseTableData, databaseTableInfoData, jdbcDrivers, mockError } from './data';

export class DatabaseClientMock implements Client {
  private databaseData: DatabaseData = databases;
  private databaseTableInfoData: DatabaseTableInfoData = databaseTableInfoData;
  private databaseTableData: DatabaseTableData = databaseTableData;
  private creationError: CreationError[] = creationError;
  private mockError: CreationError[] = mockError;
  private databaseConnectionData: Array<DatabaseConnectionData> = conenctions;
  private jdbcDrivers: Array<JdbcDriverProperties> = jdbcDrivers;

  databaseConnections(): Promise<Array<DatabaseConnectionData>> {
    return Promise.resolve(this.databaseConnectionData);
  }
  saveDatabaseConnection(): Promise<boolean> {
    return Promise.resolve(true);
  }
  deleteDatabaseConnection(): Promise<boolean> {
    return Promise.resolve(true);
  }

  data(): Promise<DatabaseData> {
    return Promise.resolve(this.databaseData);
  }

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]> {
    switch (path) {
      case 'meta/databaseTableNames':
        return Promise.resolve(this.databaseTableData);
      case 'meta/databaseTableInfo':
        return Promise.resolve({
          ...this.databaseTableInfoData,
          tables: this.databaseTableInfoData.tables.filter(t => (args as DatabaseEditorDBContext).tableNames.includes(t.name))
        });
      case 'meta/jdbcDrivers':
        return Promise.resolve(this.jdbcDrivers);
      default:
        throw Error('mock meta path not programmed');
    }
  }

  importFromDatabase(args: DatabaseImportCreationArgs): Promise<Array<CreationError>> {
    if (args.options[0]?.namespace.startsWith('testError')) {
      return Promise.resolve(this.mockError);
    }
    return Promise.resolve(this.creationError);
  }

  onDataChanged: Event<void> = new Emitter<void>().event;
}
