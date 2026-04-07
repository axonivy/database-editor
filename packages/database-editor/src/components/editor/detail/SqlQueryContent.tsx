import type { DatabaseConfigurationData, ExecuteSqlResponse } from '@axonivy/database-editor-protocol';
import { BasicInput, Button, Combobox, Flex, PanelMessage, Spinner, Textarea } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { SqlResultTable } from './SqlResultTable';
import { useSqlQuery } from './useSqlQuery';

export const SqlQueryContent = ({ database }: { database: DatabaseConfigurationData }) => {
  const { t } = useTranslation();
  const {
    sql,
    setSql,
    executedSql,
    selectedTable,
    selectTable,
    executeSql,
    tables,
    isTablesLoading,
    isTablesError,
    result,
    isResultLoading,
    isResultError,
    isExecuting
  } = useSqlQuery(database);

  return (
    <Flex direction='column' gap={2}>
      <span>{t('dialog.sqlQueryTester.databaseConfiguration', { name: database.name })}</span>
      <Combobox
        value={selectedTable}
        placeholder={t('dialog.sqlQueryTester.tablePlaceholder', { defaultValue: 'Show tables...' })}
        onChange={selectTable}
        disabled={isTablesLoading || isTablesError || isExecuting}
        options={(tables ?? []).map(table => ({ value: table }))}
      />
      <Textarea
        value={sql}
        placeholder={t('dialog.sqlQueryTester.sqlPlaceholder', { defaultValue: 'SELECT * FROM YOUR_TABLE' })}
        onChange={e => setSql(e.target.value)}
        style={{ minHeight: 100, resize: 'vertical' }}
      />
      <Flex direction='row' justifyContent='space-between' alignItems='center' gap={2}>
        <BasicInput
          readOnly
          value={result?.error ? t('dialog.sqlQueryTester.sqlError') : executedSql}
          style={result?.error ? { borderColor: 'red' } : undefined}
        />
        <Button variant='primary' onClick={executeSql} disabled={!sql.trim() || isExecuting}>
          {t('dialog.sqlQueryTester.execute')}
        </Button>
      </Flex>
      <SqlQueryResult result={result} isLoading={isResultLoading} isError={isResultError} />
    </Flex>
  );
};

const SqlQueryResult = ({
  result,
  isLoading,
  isError
}: {
  result: ExecuteSqlResponse | undefined;
  isLoading: boolean;
  isError: boolean;
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Flex alignItems='center' justifyContent='center'>
        <Spinner />
      </Flex>
    );
  }

  if (isError) {
    return (
      <PanelMessage
        icon={IvyIcons.ErrorXMark}
        message={t('dialog.sqlQueryTester.resultError', { defaultValue: 'Could not load results.' })}
      />
    );
  }

  if (!result) {
    return null;
  }

  if (result.error) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={result.error} />;
  }

  if (result.rows.length === 0) {
    return <span>{t('dialog.sqlQueryTester.noResults')}</span>;
  }

  return <SqlResultTable result={result} />;
};
