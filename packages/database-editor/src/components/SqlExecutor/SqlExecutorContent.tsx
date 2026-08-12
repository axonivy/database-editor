import type { DatabaseConfigurationData, ExecuteSqlResponse } from '@axonivy/database-editor-protocol';
import { BasicDialogContent, BasicTooltip, Button, Combobox, Flex, Message, Textarea, toast } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../AppContext';
import { useClient } from '../../protocol/ClientContextProvider';
import { useMeta } from '../../protocol/use-meta';
import { genQueryKey } from '../../query/query-client';
import { SqlResultTable } from './SqlResultTable';
import { useLocalStorage } from './useLocalStorage';

export const SqlExecutorContent = ({ database }: { database: DatabaseConfigurationData }) => {
  const SERVER_CHUNK_SIZE = 100;

  const { t } = useTranslation();
  const client = useClient();
  const { connectionTestResult } = useAppContext();

  const connectionState = connectionTestResult[database.key]?.state ?? connectionTestResult[database.name]?.state;
  const isConnectionFailed = connectionState?.startsWith('CONNECTION_FAILED') ?? false;

  const queryClient = useQueryClient();

  const { context } = useAppContext();
  const storageKey = `sqlExecutor:last-executed:${context.app}:${context.file}:${context.project}:${database.name}`;
  const [lastExecutedSql, setLastExecutedSql] = useLocalStorage<string>(storageKey, '');
  const [sql, setSql] = useState<string | undefined>('');
  const [selectedTable, setSelectedTable] = useState('');
  const [executedSql, setExecutedSql] = useState(lastExecutedSql);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [executionCount, setExecutionCount] = useState(0);

  const source = executedSql ? 'sql' : 'idle';

  const tablesQuery = useMeta('meta/databaseTableNames', { ...context, databaseName: database.name });

  const sqlQuery = useInfiniteQuery({
    queryKey: genQueryKey('function/executeSql', {
      context: { app: context.app, file: context.file, project: context.project },
      databaseConfig: database.name,
      sql: executedSql,
      executionCount
    }),
    queryFn: ({ pageParam }) =>
      client.functions('function/executeSql', {
        context: { app: context.app, file: context.file, project: context.project },
        databaseConfig: database.name,
        sql: executedSql,
        offset: pageParam
      }),
    initialPageParam: 0,
    enabled: hasExecuted && !!executedSql && !isConnectionFailed,
    getNextPageParam: (lastPage, allPages) => (lastPage.rows.length > 0 ? allPages.length * SERVER_CHUNK_SIZE : undefined),
    structuralSharing: false
  });

  const loadedRows = sqlQuery.data?.pages.flatMap(page => page.rows) ?? [];
  const loadedColumns = sqlQuery.data?.pages[0]?.columns ?? [];
  const canLoadMore = sqlQuery.hasNextPage;

  useEffect(() => {
    if (sqlQuery.dataUpdatedAt) {
      queryClient.invalidateQueries({ queryKey: genQueryKey('meta/databaseTableNames') });
    }
  }, [sqlQuery.dataUpdatedAt, queryClient]);

  const loadMoreRows = async () => {
    if (sqlQuery.isFetchingNextPage || !canLoadMore) {
      return;
    }
    await sqlQuery.fetchNextPage();
  };

  const runSql = (query: string) => {
    setHasExecuted(true);
    setExecutionCount(prev => prev + 1);
    setLastExecutedSql(query);
    setExecutedSql(query);
  };

  const selectTable = (tableName: string) => {
    if (tableName.length === 0) {
      setSelectedTable('');
      setSql('');
      return;
    }
    const query = `SELECT * FROM ${tableName}`;
    setSelectedTable(tableName);
    setSql(query);
    runSql(query);
  };

  const executeSql = () => {
    const query = (sql ?? '').trim();
    if (!query) {
      return;
    }
    setSelectedTable('');
    runSql(query);
  };

  return (
    <BasicDialogContent
      title={t('dialog.sqlExecutor.title')}
      description={t('dialog.sqlExecutor.databaseConfiguration', { name: database.name })}
      cancel={undefined}
      submit={undefined}
    >
      <Combobox
        value={selectedTable}
        placeholder={t('dialog.sqlExecutor.tablePlaceholder')}
        onChange={selectTable}
        disabled={tablesQuery.isPending || tablesQuery.isError || sqlQuery.isFetching}
        options={(tablesQuery.data?.tables ?? []).map(table => ({ value: table }))}
      />
      <Textarea
        value={sql}
        onChange={e => setSql(e.target.value)}
        disabled={sqlQuery.isFetching}
        style={{ minHeight: 100, resize: 'vertical' }}
      />
      {isConnectionFailed && <Message variant='error' message={t('dialog.sqlExecutor.connectionFailed')} />}

      <Flex direction='row' justifyContent='space-between' alignItems='center' gap={2} className='w-full min-w-0'>
        <Flex direction='row' alignItems='center' gap={2} className='min-w-0 flex-1 overflow-hidden'>
          <div
            className='min-w-0 flex-1 overflow-hidden rounded-sm border border-n200 bg-n75 px-2 py-1.5 text-sm text-n700'
            title={source === 'sql' && sqlQuery.isError ? t('dialog.sqlExecutor.sqlError') : executedSql}
          >
            <span className='block truncate'>{source === 'sql' && sqlQuery.isError ? '\u00A0' : executedSql || '\u00A0'}</span>
          </div>
          <CopyToClipboardButton script={executedSql} />
        </Flex>

        <Button
          variant='primary'
          icon={sqlQuery.isFetching ? IvyIcons.Spinner : undefined}
          onClick={executeSql}
          disabled={!sql?.trim() || sqlQuery.isFetching || isConnectionFailed}
          spin={sqlQuery.isFetching}
        >
          {t('dialog.sqlExecutor.execute')}
        </Button>
      </Flex>
      <SqlExecutorResult
        loadMoreRows={loadMoreRows}
        isLoadingNextPage={sqlQuery.isFetchingNextPage}
        canLoadMore={canLoadMore}
        result={hasExecuted && source === 'sql' ? { columns: loadedColumns, rows: loadedRows } : undefined}
        isError={hasExecuted && source === 'sql' && sqlQuery.isError}
        error={hasExecuted && source === 'sql' ? sqlQuery.error : undefined}
      />
    </BasicDialogContent>
  );
};

const CopyToClipboardButton = ({ script }: { script?: string }) => {
  const { t } = useTranslation();

  const copyScriptToClipboard = async () => {
    if (!script) return;

    try {
      await navigator.clipboard.writeText(script);
      toast.success(t('dialog.sqlExecutor.copySuccess'));
    } catch (error) {
      toast.error(t('dialog.sqlExecutor.copyFailed'), {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  return (
    <BasicTooltip content={t('dialog.sqlExecutor.copySql')}>
      <Button icon={IvyIcons.Copy} onClick={copyScriptToClipboard} disabled={!script} />
    </BasicTooltip>
  );
};

const SqlExecutorResult = ({
  loadMoreRows,
  isLoadingNextPage,
  canLoadMore,
  result,
  isError,
  error
}: {
  loadMoreRows: () => Promise<void>;
  isLoadingNextPage: boolean;
  canLoadMore: boolean;
  result: Pick<ExecuteSqlResponse, 'columns' | 'rows'> | undefined;
  isError: boolean;
  error: Error | null | undefined;
}) => {
  const { t } = useTranslation();

  if (isError) {
    return <Message variant='error' message={error?.message || t('dialog.sqlExecutor.resultError')} />;
  }

  if (!result) {
    return null;
  }

  if (result.rows.length === 0) {
    return <span>{t('dialog.sqlExecutor.noResults')}</span>;
  }

  return <SqlResultTable result={result} loadMoreRows={loadMoreRows} isLoadingNextPage={isLoadingNextPage} canLoadMore={canLoadMore} />;
};
