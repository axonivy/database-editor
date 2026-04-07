import type { DatabaseConfigurationData, ExecuteSqlResponse } from '@axonivy/database-editor-protocol';
import { BasicInput, Button, Flex, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Textarea } from '@axonivy/ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useClient } from '../../../protocol/ClientContextProvider';

export const SqlQueryContent = ({ database }: { database: DatabaseConfigurationData }) => {
  const { t } = useTranslation();
  const { context } = useAppContext();
  const client = useClient();
  const [sql, setSql] = useState('');
  const [executedSql, setExecutedSql] = useState('');
  const [result, setResult] = useState<ExecuteSqlResponse | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleExecuteSql = async () => {
    setIsLoading(true);
    setExecutedSql(sql);
    setResult(undefined);
    try {
      const response = await client.functions('function/executeSql', {
        context: { app: context.app, file: context.file, pmv: context.pmv },
        dataSourceId: database.name,
        sql
      });
      setResult(response);
    } finally {
      setIsLoading(false);
    }
  };

  const hasError = result?.error;
  const hasRows = result && !hasError && result.rows.length > 0;
  const hasNoRows = result && !hasError && result.rows.length === 0;

  return (
    <Flex direction='column' gap={2}>
      <span>{t('dialog.sqlQueryTester.databaseConfiguration', { name: database.name })}</span>
      <Textarea value={sql} onChange={e => setSql(e.target.value)} style={{ minHeight: 100, resize: 'vertical' }} />
      <Flex direction='row' justifyContent='space-between' alignItems='center' gap={2}>
        <BasicInput
          readOnly
          value={hasError ? t('dialog.sqlQueryTester.sqlError') : executedSql}
          style={hasError ? { borderColor: 'red' } : undefined}
        />
        <Button variant='primary' onClick={handleExecuteSql} disabled={!sql.trim() || isLoading}>
          {t('dialog.sqlQueryTester.execute')}
        </Button>
      </Flex>
      {hasError && <span>{result?.error}</span>}
      {hasNoRows && <span>{t('dialog.sqlQueryTester.noResults')}</span>}
      {hasRows && (
        <Flex direction='column' gap={1}>
          <Table>
            <TableHeader>
              <TableRow>
                {result.columns.map(col => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.rows.map((row, i) => (
                <TableRow key={i}>
                  {result.columns.map(col => (
                    <TableCell key={col}>{row[col]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Flex>
      )}
    </Flex>
  );
};
