import type { DatabaseConfigurationData, ExecuteSqlResponse } from '@axonivy/database-editor-protocol';
import { BasicDialogContent, BasicTooltip, Button, Combobox, Flex, Message, Textarea, toast } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../AppContext';
import { useMeta } from '../../protocol/use-meta';
import { useFunction } from '../../protocol/useFunction';
import { SqlResultTable } from './SqlResultTable';
import { useLocalStorage } from './useLocalStorage';

export const SqlQueryContent = ({ database }: { database: DatabaseConfigurationData }) => {
  const { t } = useTranslation();
  const { connectionTestResult } = useAppContext();

  const connectionState = connectionTestResult[database.key]?.state ?? connectionTestResult[database.name]?.state;
  const isConnectionFailed = connectionState?.startsWith('CONNECTION_FAILED') ?? false;

  const { context } = useAppContext();
  const storageKey = `sql-query-tester:last-executed:${context.app}:${context.file}:${context.pmv}:${database.name}`;
  const [lastExecutedSql, setLastExecutedSql] = useLocalStorage<string>(storageKey, '');
  const [sql, setSql] = useState<string | undefined>('');
  const [selectedTable, setSelectedTable] = useState('');
  const [executedSql, setExecutedSql] = useState(lastExecutedSql);

  const source = executedSql ? 'sql' : 'idle';

  const tablesQuery = useMeta('meta/databaseTableNames', { ...context, databaseName: database.name });

  const executeSqlMutation = useFunction(
    'function/executeSql',
    {
      context: { app: context.app, file: context.file, pmv: context.pmv },
      databaseConfig: database.name,
      sql: ''
    },
    {
      onSuccess: () => tablesQuery.refetch()
    }
  );

  const runSql = (query: string) => {
    setLastExecutedSql(query);
    setExecutedSql(query);
    executeSqlMutation.mutate({
      context: { app: context.app, file: context.file, pmv: context.pmv },
      databaseConfig: database.name,
      sql: query
    });
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
      title={t('dialog.sqlQueryTester.title')}
      description={t('dialog.sqlQueryTester.databaseConfiguration', { name: database.name })}
      cancel={undefined}
      submit={undefined}
    >
      <Combobox
        value={selectedTable}
        placeholder={t('dialog.sqlQueryTester.tablePlaceholder')}
        onChange={selectTable}
        disabled={tablesQuery.isPending || tablesQuery.isError || executeSqlMutation.isPending}
        options={(tablesQuery.data?.tables ?? []).map(table => ({ value: table }))}
      />
      <Textarea
        value={sql}
        onChange={e => setSql(e.target.value)}
        disabled={executeSqlMutation.isPending}
        style={{ minHeight: 100, resize: 'vertical' }}
      />
      {isConnectionFailed && <Message variant='error' message={t('dialog.sqlQueryTester.connectionFailed')} />}

      <Flex direction='row' justifyContent='space-between' alignItems='center' gap={2} className='w-full min-w-0'>
        <Flex direction='row' alignItems='center' gap={2} className='min-w-0 flex-1 overflow-hidden'>
          <div
            className='min-w-0 flex-1 overflow-hidden rounded-sm border border-n200 bg-n75 px-2 py-1.5 text-sm text-n700'
            title={source === 'sql' && executeSqlMutation.isError ? t('dialog.sqlQueryTester.sqlError') : executedSql}
          >
            <span className='block truncate'>{source === 'sql' && executeSqlMutation.isError ? '\u00A0' : executedSql || '\u00A0'}</span>
          </div>
          <CopyToClipboardButton script={executedSql} />
        </Flex>

        <Button
          variant='primary'
          icon={executeSqlMutation.isPending ? IvyIcons.Spinner : undefined}
          onClick={executeSql}
          disabled={!sql?.trim() || executeSqlMutation.isPending || isConnectionFailed}
          spin={executeSqlMutation.isPending}
        >
          {t('dialog.sqlQueryTester.execute')}
        </Button>
      </Flex>
      <SqlQueryResult
        result={source === 'sql' ? executeSqlMutation.data : undefined}
        isError={source === 'sql' && executeSqlMutation.isError}
        error={source === 'sql' ? executeSqlMutation.error : undefined}
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
      toast.success(t('dialog.sqlQueryTester.copySuccess'));
    } catch (error) {
      toast.error(t('dialog.sqlQueryTester.copyFailed'), {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  return (
    <BasicTooltip content={t('dialog.sqlQueryTester.copySql')}>
      <Button icon={IvyIcons.Copy} onClick={copyScriptToClipboard} disabled={!script} />
    </BasicTooltip>
  );
};

const SqlQueryResult = ({
  result,
  isError,
  error
}: {
  result: ExecuteSqlResponse | undefined;
  isError: boolean;
  error: Error | null | undefined;
}) => {
  const { t } = useTranslation();

  if (isError) {
    return <Message variant='error' message={error?.message || t('dialog.sqlQueryTester.resultError')} />;
  }

  if (!result) {
    return null;
  }

  if (result.rows.length === 0) {
    return <span>{t('dialog.sqlQueryTester.noResults')}</span>;
  }

  return <SqlResultTable result={result} />;
};
