import type {
  Client,
  CreationError,
  DatabaseActionArgs,
  DatabaseConfigurations,
  DatabaseData,
  DatabaseEditorDBContext,
  DatabaseEditorSaveArgs,
  DatabaseTableData,
  DatabaseTableInfoData,
  EditorFileContent,
  Event,
  FunctionRequestTypes,
  JdbcDriverProperties,
  MetaRequestTypes
} from '@axonivy/database-editor-protocol';
import { Emitter } from '@axonivy/jsonrpc';
import { creationError, databaseConnections, databases, databaseTableData, databaseTableInfoData, jdbcDrivers, mockError } from './data';

export class DatabaseClientMock implements Client {
  private databaseData: DatabaseData = databases;
  private databaseTableInfoData: DatabaseTableInfoData = databaseTableInfoData;
  private databaseTableData: DatabaseTableData = databaseTableData;
  private creationError: CreationError[] = creationError;
  private mockError: CreationError[] = mockError;
  private jdbcDrivers: Array<JdbcDriverProperties> = jdbcDrivers;
  private databaseConnections: DatabaseConfigurations = databaseConnections;

  private readonly metaJdbcDriversState: string;

  constructor(metaJdbcDriversState: string) {
    this.metaJdbcDriversState = metaJdbcDriversState;
  }

  data(): Promise<DatabaseConfigurations> {
    return Promise.resolve(this.databaseConnections);
  }

  save(args: DatabaseEditorSaveArgs): Promise<EditorFileContent> {
    this.databaseConnections = args.data;
    return Promise.resolve({ content: '' });
  }

  async meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]> {
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
        if (this.metaJdbcDriversState === 'isPending') {
          await new Promise(res => setTimeout(res, 1000));
        } else if (this.metaJdbcDriversState === 'isError') {
          throw Error('error message');
        }
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

  action(action: DatabaseActionArgs): void {
    console.log(`Action: ${JSON.stringify(action)}`);
  }

  onDataChanged: Event<void> = new Emitter<void>().event;
}
