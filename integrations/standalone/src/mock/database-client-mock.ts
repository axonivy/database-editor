import type {
  Client,
  CreationError,
  Databaseconfigs,
  DatabaseData,
  DatabaseEditorDBContext,
  DatabaseTableData,
  DatabaseTableInfoData,
  EditorFileContent,
  Event,
  FunctionRequestTypes,
  JdbcDriverProperties,
  MetaRequestTypes
} from '@axonivy/database-editor-protocol';
import { Emitter } from '@axonivy/jsonrpc';
import { creationError, databases, databaseTableData, databaseTableInfoData, jdbcDrivers, mockError } from './data';

export class DatabaseClientMock implements Client {
  private databaseData: DatabaseData = databases;
  private databaseTableInfoData: DatabaseTableInfoData = databaseTableInfoData;
  private databaseTableData: DatabaseTableData = databaseTableData;
  private creationError: CreationError[] = creationError;
  private mockError: CreationError[] = mockError;
  private jdbcDrivers: Array<JdbcDriverProperties> = jdbcDrivers;

  data(): Promise<Databaseconfigs> {
    return Promise.resolve({ databaseConfigs: [] });
  }

  save(): Promise<EditorFileContent> {
    return Promise.resolve({ content: '' });
  }

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]> {
    switch (path) {
      case 'meta/allDatabaseNames':
        return Promise.resolve(this.databaseData);
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

  functions<TFunction extends keyof FunctionRequestTypes>(
    path: TFunction,
    args: FunctionRequestTypes[TFunction][0]
  ): Promise<FunctionRequestTypes[TFunction][1]> {
    switch (path) {
      case 'function/importFromDatabase':
        if (args.options[0]?.namespace.startsWith('testError')) {
          return Promise.resolve(this.mockError);
        }
        return Promise.resolve(this.creationError);
      default:
        throw Error('mock function path not programmed');
    }
  }
  onDataChanged: Event<void> = new Emitter<void>().event;
}
