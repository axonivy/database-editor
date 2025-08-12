/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { DatabaseData, DatabaseEditorDataContext, DatabaseEditorDBContext, DatabaseInfoData } from './editor';

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
}

export interface Client {
  data(context: DatabaseEditorDataContext): Promise<DatabaseData>;
  databaseInfo(context: DatabaseEditorDBContext): Promise<DatabaseInfoData>;
  onDataChanged: Event<void>;
}

export interface ClientContext {
  client: Client;
}
