import type {
  Client,
  CreationError,
  DatabaseConnectionData,
  DatabaseConnectionDeleteArgs,
  DatabaseConnectionSaveArgs,
  DatabaseData,
  DatabaseEditorDataContext,
  DatabaseImportCreationArgs,
  Event,
  MetaRequestTypes,
  RequestTypes
} from '@axonivy/database-editor-protocol';
import { BaseRpcClient, createMessageConnection, Emitter, urlBuilder, type Connection, type MessageConnection } from '@axonivy/jsonrpc';

export class ClientJsonRpc extends BaseRpcClient implements Client {
  saveDatabaseConnection(args: DatabaseConnectionSaveArgs): Promise<boolean> {
    return this.sendRequest('saveDatabaseConnection', args);
  }
  deleteDatabaseConnection(args: DatabaseConnectionDeleteArgs): Promise<boolean> {
    return this.sendRequest('deleteDatabaseConnection', args);
  }
  databaseConnections(context: DatabaseEditorDataContext): Promise<Array<DatabaseConnectionData>> {
    return this.sendRequest('databaseConnections', context);
  }
  protected onDataChangedEmitter = new Emitter<void>();
  onDataChanged: Event<void> = this.onDataChangedEmitter.event;
  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onDataChangedEmitter);
  }

  data(context: DatabaseEditorDataContext): Promise<DatabaseData> {
    return this.sendRequest('data', context);
  }

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]> {
    return this.sendRequest(path, args);
  }

  importFromDatabase(args: DatabaseImportCreationArgs): Promise<Array<CreationError>> {
    return this.sendRequest('importFromDatabase', args);
  }

  sendRequest<K extends keyof RequestTypes>(command: K, args: RequestTypes[K][0]): Promise<RequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-database-lsp');
  }

  public static async startClient(connection: Connection): Promise<ClientJsonRpc> {
    return this.startMessageClient(createMessageConnection(connection.reader, connection.writer));
  }

  public static async startMessageClient(connection: MessageConnection): Promise<ClientJsonRpc> {
    const client = new ClientJsonRpc(connection);
    await client.start();
    return client;
  }
}
