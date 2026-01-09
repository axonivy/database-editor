import type { Databaseconfigs, EditorProps } from '@axonivy/database-editor-protocol';
import { Flex, PanelMessage, ResizableHandle, ResizablePanel, ResizablePanelGroup, Spinner } from '@axonivy/ui-components';
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
import { useMeta } from './protocol/use-meta';
import { genQueryKey } from './query/query-client';

export const DatabaseEditor = (props: EditorProps) => {
  const [detail, setDetail] = useState(false);
  const { t } = useTranslation();
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
    mutationFn: (data: Databaseconfigs) =>
      client.save({
        context,
        data,
        directSave: true
      }),
    onSuccess: () => refetch(),
    onError: error => console.log('error', error)
  });

  const jdbcDrivers = useMeta('meta/jdbcDrivers', undefined);

  if (isPending || jdbcDrivers.isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
        <Spinner />
      </Flex>
    );
  }

  if (isError || jdbcDrivers.isError) {
    return (
      <PanelMessage
        icon={IvyIcons.ErrorXMark}
        message={t('common.message.errorOccured', { message: error?.message ?? jdbcDrivers.error?.message })}
      />
    );
  }

  return (
    <AppProvider projects={props.context.projects} context={context} data={data} setData={setData.mutate} jdbcDrivers={jdbcDrivers.data}>
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel>
          <DatabaseMasterToolbar detail={detail} setDetail={setDetail} />
          <DatabaseMasterContent setDetail={setDetail} />
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={10}>
              <DatabaseDetail />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </AppProvider>
  );
};
