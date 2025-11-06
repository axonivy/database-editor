import type {
  CreationError,
  DatabaseData,
  DatabaseEditorDataContext,
  DatabaseEditorDBContext,
  DatabaseEditorTableContext,
  DatabaseImportCreationArgs,
  DatabaseTableData,
  DatabaseTableInfoData
} from './editor';

export type ImportWizardContext = {
  app: string;
  file: string;
  projects: Array<string>;
};

export type DatabaseEditorContext = DatabaseEditorDBContext | DatabaseEditorDataContext;

export type EditorProps = { context: ImportWizardContext; directSave?: boolean };

export interface Event<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface RequestTypes extends MetaRequestTypes {
  data: [DatabaseEditorDataContext, DatabaseData];
  databaseTableNames: [DatabaseEditorTableContext, DatabaseTableData];
  databaseTableInfo: [DatabaseEditorDBContext, DatabaseTableInfoData];
  importFromDatabase: [DatabaseImportCreationArgs, Array<CreationError>];
}

export interface Client {
  data(context: DatabaseEditorDataContext): Promise<DatabaseData>;
  importFromDatabase(args: DatabaseImportCreationArgs): Promise<Array<CreationError>>;
  onDataChanged: Event<void>;

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]>;
}

export interface MetaRequestTypes {
  'meta/databaseTableNames': [DatabaseEditorTableContext, DatabaseTableData];
  'meta/databaseTableInfo': [DatabaseEditorDBContext, DatabaseTableInfoData];
}

export interface ClientContext {
  client: Client;
}

export const ImportOptionsLookup = {
  0: 'EntityClass',
  1: 'FormDialog',
  2: 'Repository',
  3: 'Enum'
};
