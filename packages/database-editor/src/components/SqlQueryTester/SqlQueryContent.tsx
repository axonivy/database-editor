import type { DatabaseConfigurationData, ExecuteSqlResponse } from '@axonivy/database-editor-protocol';
import { BasicDialogContent, Button, Combobox, Flex, Input, Message, Textarea } from '@axonivy/ui-components';
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
  const [sql, setSql] = useState<string | undefined>(lastExecutedSql);
  const [selectedTable, setSelectedTable] = useState('');
  const [executedSql, setExecutedSql] = useState(lastExecutedSql);

  const source = selectedTable ? 'table' : executedSql ? 'sql' : 'idle';

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

  const selectTable = (tableName: string) => {
    if (tableName.length === 0) {
      setSelectedTable('');
      setSql(undefined);
      setExecutedSql('');
      return;
    }
    const query = `SELECT * FROM ${tableName}`;
    setSelectedTable(tableName);
    setSql(query);
    setExecutedSql(query);
  };

  const executeSql = () => {
    const query = (sql ?? '').trim();
    if (!query) {
      return;
    }
    setSelectedTable('');
    setExecutedSql(query);
    setLastExecutedSql(query);
    executeSqlMutation.mutate({
      context: { app: context.app, file: context.file, pmv: context.pmv },
      databaseConfig: database.name,
      sql: query
    });
  };

  return (
    <BasicDialogContent
      title={t('dialog.sqlQueryTester.title')}
      description={t('dialog.sqlQueryTester.databaseConfiguration', { name: database.name })}
      cancel={<Button variant='outline'>{t('common.label.cancel')}</Button>}
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
        placeholder={t('dialog.sqlQueryTester.sqlPlaceholder')}
        onChange={e => setSql(e.target.value)}
        disabled={executeSqlMutation.isPending}
        style={{ minHeight: 100, resize: 'vertical' }}
      />
      {isConnectionFailed && <Message variant='error' message={t('dialog.sqlQueryTester.connectionFailed')} />}

      <Flex direction='row' justifyContent='space-between' alignItems='center' gap={2}>
        <Input
          readOnly
          disabled={executeSqlMutation.isPending}
          value={source === 'sql' && executeSqlMutation.isError ? t('dialog.sqlQueryTester.sqlError') : executedSql.replace(/\n/g, ' ')}
          title={source === 'sql' && executeSqlMutation.isError ? undefined : executedSql}
          className='truncate'
        />

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
      />
    </BasicDialogContent>
  );
};

const SqlQueryResult = ({ result, isError }: { result: ExecuteSqlResponse | undefined; isError: boolean }) => {
  const { t } = useTranslation();

  if (isError) {
    return <Message variant='error' message={t('dialog.sqlQueryTester.resultError')} />;
  }

  if (!result) {
    return null;
  }

  if (result.rows.length === 0) {
    return <span>{t('dialog.sqlQueryTester.noResults')}</span>;
  }

  return <SqlResultTable result={result} />;
};
