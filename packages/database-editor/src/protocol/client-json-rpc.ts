import type {
  Client,
  Databaseconfigs,
  DatabaseEditorDataContext,
  DatabaseEditorSaveArgs,
  EditorFileContent,
  Event,
  FunctionRequestTypes,
  MetaRequestTypes,
  RequestTypes
} from '@axonivy/database-editor-protocol';
import { BaseRpcClient, createMessageConnection, Emitter, urlBuilder, type Connection, type MessageConnection } from '@axonivy/jsonrpc';

export class ClientJsonRpc extends BaseRpcClient implements Client {
  protected onDataChangedEmitter = new Emitter<void>();
  onDataChanged: Event<void> = this.onDataChangedEmitter.event;
  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onDataChangedEmitter);
  }

  data(context: DatabaseEditorDataContext): Promise<Databaseconfigs> {
    return this.sendRequest('data', context);
  }

  save(args: DatabaseEditorSaveArgs): Promise<EditorFileContent> {
    return this.sendRequest('save', args);
  }

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]> {
    return this.sendRequest(path, args);
  }

  functions<TFunction extends keyof FunctionRequestTypes>(
    path: TFunction,
    args: FunctionRequestTypes[TFunction][0]
  ): Promise<FunctionRequestTypes[TFunction][1]> {
    return this.sendRequest(path, args);
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
