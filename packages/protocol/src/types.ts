import type {
  CreationError,
  DatabaseData,
  DatabaseEditorDataContext,
  DatabaseEditorDBContext,
  DatabaseImportCreationArgs,
  DatabaseInfoData
} from './editor';

export type DatabaseEditorContext = DatabaseEditorDBContext | DatabaseEditorDataContext;

export type EditorProps = { context: DatabaseEditorContext; directSave?: boolean };

export interface Event<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface RequestTypes {
  data: [DatabaseEditorDataContext, DatabaseData];
  databaseInfo: [DatabaseEditorDBContext, DatabaseInfoData];
  importFromDatabase: [DatabaseImportCreationArgs, Array<CreationError>];
}

export interface Client {
  data(context: DatabaseEditorDataContext): Promise<DatabaseData>;
  databaseInfo(context: DatabaseEditorDBContext): Promise<DatabaseInfoData>;
  importFromDatabase(args: DatabaseImportCreationArgs): Promise<Array<CreationError>>;
  onDataChanged: Event<void>;
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
