import type { DatabaseConfigurations, EditorProps } from '@axonivy/database-editor-protocol';
import { Flex, PanelMessage, ResizableGroup, ResizableHandle, ResizablePanel, Spinner, useDefaultLayout } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppProvider } from './AppContext';
import './DatabaseEditor.css';
import { DatabaseDetail } from './components/editor/detail/DatabaseDetail';
import { DatabaseMasterContent } from './components/editor/master/DatabaseMasterContent';
import { DatabaseMasterToolbar } from './components/editor/master/DatabaseMasterToolbar';
import { useClient } from './protocol/ClientContextProvider';
import { genQueryKey } from './query/query-client';

export const DatabaseEditor = (props: EditorProps) => {
  const [detail, setDetail] = useState(true);
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ groupId: 'database-editor-resize', storage: localStorage });
  const { t } = useTranslation();

  const [selectedDatabase, setSelectedDatabase] = useState<number>();

  const context = useMemo(
    () => ({
      file: props.context.file,
      app: props.context.app,
      pmv: props.context.projects[0] ?? ''
    }),
    [props.context.file, props.context.app, props.context.projects]
  );
  const client = useClient();

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: useMemo(() => genQueryKey('databaseConnections', context), [context]),
    queryFn: async () => {
      const data = await client.data(context);
      return data;
    },
    structuralSharing: false
  });

  const setData = useMutation({
    mutationKey: genQueryKey('saveDatabaseConnection', {
      context: context,
      data: data
    }),
    mutationFn: (data: DatabaseConfigurations) =>
      client.save({
        context,
        data,
        directSave: true
      }),
    onSuccess: () => refetch(),
    onError: error => console.log('error', error)
  });

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
        <Spinner />
      </Flex>
    );
  }

  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('common.message.errorOccured', { message: error?.message })} />;
  }

  return (
    <AppProvider
      value={{
        projects: props.context.projects,
        context,
        databaseConfigs: data.connections,
        setData: setData.mutate,
        selectedDatabase,
        setSelectedDatabase
      }}
    >
      <ResizableGroup orientation='horizontal' defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}>
        <ResizablePanel id='main' defaultSize='75%' minSize='50%' className='database-editor-main-panel'>
          <Flex direction='column' className='database-editor-panel-content'>
            <DatabaseMasterToolbar detail={detail} setDetail={setDetail} />
            <DatabaseMasterContent detail={detail} setDetail={setDetail} />
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel id='properties' defaultSize='25%' minSize='20%' className='database-editor-detail-panel'>
              <DatabaseDetail />
            </ResizablePanel>
          </>
        )}
      </ResizableGroup>
    </AppProvider>
  );
};
