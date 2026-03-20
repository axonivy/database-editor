import type {
  DatabaseConfigurations,
  DatabaseEditorContext,
  EditorProps,
  MapStringConnectionTestData
} from '@axonivy/database-editor-protocol';
import {
  Flex,
  PanelMessage,
  ResizableGroup,
  ResizableHandle,
  ResizablePanel,
  Spinner,
  toast,
  useDefaultLayout,
  useHistoryData,
  useHotkeys,
  type Unary
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppProvider } from './AppContext';
import { DatabaseDetail } from './components/editor/detail/DatabaseDetail';
import { DatabaseMasterContent } from './components/editor/master/DatabaseMasterContent';
import { DatabaseMasterToolbar } from './components/editor/master/DatabaseMasterToolbar';
import { useClient } from './protocol/ClientContextProvider';
import { useAction } from './protocol/useAction';
import { genQueryKey } from './query/query-client';
import { useKnownHotkeys } from './util/hotkeys';

export const DatabaseEditor = (props: EditorProps) => {
  const [detail, setDetail] = useState(true);
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ groupId: 'database-editor-resize', storage: localStorage });
  const { t } = useTranslation();
  const [selectedDatabase, setSelectedDatabase] = useState<number>();
  const [initialData, setInitalData] = useState<DatabaseConfigurations | undefined>(undefined);
  const history = useHistoryData<DatabaseConfigurations>();

  const context = useMemo<DatabaseEditorContext>(
    () => ({
      file: props.context.file,
      app: props.context.app,
      pmv: props.context.projects[0] ?? ''
    }),
    [props.context.file, props.context.app, props.context.projects]
  );
  const client = useClient();
  const queryClient = useQueryClient();

  const queryKeys = useMemo(
    () => ({
      data: (context: DatabaseEditorContext) => genQueryKey('databaseConnections', context),
      saveData: (context: DatabaseEditorContext) => genQueryKey('saveDatabaseConnections', context)
    }),
    []
  );

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.data(context),
    queryFn: () => client.data(context),
    structuralSharing: false
  });

  useEffect(() => {
    const dataDispose = client.onDataChanged(() => queryClient.invalidateQueries({ queryKey: queryKeys.data(context) }));
    return () => {
      dataDispose.dispose();
    };
  }, [client, context, queryClient, queryKeys]);

  if (data !== undefined && initialData === undefined) {
    setInitalData(data);
    history.push(data);
  }

  const setData = useMutation({
    mutationKey: queryKeys.saveData(context),
    mutationFn: async (data: Unary<DatabaseConfigurations>) => {
      const saveData = queryClient.setQueryData<DatabaseConfigurations>(queryKeys.data(context), prev => {
        if (prev) {
          return data(prev);
        }
        return;
      });
      if (saveData) {
        return client.save({
          context,
          data: saveData,
          directSave: props.directSave ?? false
        });
      }
      return Promise.resolve();
    }
  });

  const [connectionTestResult, setConnectionTestResult] = useState<MapStringConnectionTestData>({});

  const udpateConnectionTestResult = (result: MapStringConnectionTestData) => {
    const resultNames = Object.keys(result);
    const message =
      resultNames.length === 1
        ? t('database.connectionTest.testedFollowing', { connection: resultNames[0] })
        : t('database.connectionTest.testedAll');
    toast.info(t('database.connectionTest.title'), { description: message });
    setConnectionTestResult(prev => {
      const update = structuredClone(prev);
      return Object.assign(update, result);
    });
  };

  const removeConnectionTestResult = (name: string) =>
    setConnectionTestResult(prev => Object.fromEntries(Object.entries(prev).filter(e => e[0] !== name)));

  const emptyResult = { state: 'PENDING', advise: '', exception: '' };
  const setConnectionPending = (name: string) => {
    setConnectionTestResult(prev => {
      const update = structuredClone(prev);
      if (name.trim() === '') {
        data?.connections.forEach(c => (update[c.name] = emptyResult));
        return update;
      }
      if (!update[name]) {
        return prev;
      }
      update[name].state = 'PENDING';
      return update;
    });
  };

  const connectionTestFunction = useMutation({
    mutationKey: genQueryKey('testDatabaseConnection', {
      context: context
    }),
    mutationFn: () => {
      const dbConfig = selectedDatabase !== undefined ? (data?.connections[selectedDatabase]?.name ?? '') : '';
      setConnectionPending(dbConfig);
      return client.functions('function/testDatabaseConnection', {
        context: context,
        databaseConfig: dbConfig
      });
    },
    onSuccess: udpateConnectionTestResult,
    onError: error => toast.error(t('database.connectionTest.failed'), { description: error.message })
  });

  const hotkeys = useKnownHotkeys();
  const openUrl = useAction('openUrl');
  useHotkeys(hotkeys.openHelp.hotkey, () => openUrl(data?.helpUrl), { scopes: ['global'] });
  useHotkeys(hotkeys.testConnection.hotkey, () => connectionTestFunction.mutate(), { scopes: ['global'] });
  const detailRef = useRef<HTMLDivElement>(null);
  useHotkeys(
    hotkeys.focusInscription.hotkey,
    () => {
      setDetail(true);
      detailRef.current?.focus();
    },
    {
      scopes: ['global']
    }
  );

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' className='size-full'>
        <Spinner />
      </Flex>
    );
  }

  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('common.message.errorOccured', { message: error.message })} />;
  }

  return (
    <AppProvider
      value={{
        projects: props.context.projects,
        context,
        databaseConfigs: data.connections,
        setData: setData.mutate,
        selectedDatabase,
        setSelectedDatabase,
        history,
        helpUrl: data.helpUrl,
        connectionTestResult,
        testConnection: connectionTestFunction.mutate,
        removeConnectionTestResult
      }}
    >
      <ResizableGroup orientation='horizontal' defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}>
        <ResizablePanel id='database-editor-main' defaultSize='75%' minSize='50%' className='bg-n75'>
          <Flex direction='column' className='h-full'>
            <DatabaseMasterToolbar detail={detail} setDetail={setDetail} />
            <DatabaseMasterContent detail={detail} setDetail={setDetail} />
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel id='database-editor-detail' defaultSize='25%' minSize='10%'>
              <DatabaseDetail ref={detailRef} />
            </ResizablePanel>
          </>
        )}
      </ResizableGroup>
    </AppProvider>
  );
};
