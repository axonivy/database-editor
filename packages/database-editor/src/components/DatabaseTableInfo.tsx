import type { DatabaseEditorContext, DatabaseEditorDBContext } from '@axonivy/database-editor-protocol';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClient } from '../protocol/ClientContextProvider';
import { genQueryKey } from '../query/query-client';
import './DatabaseTableInfo.css';
import { TableData } from './TableData';

export const DatabaseTableInfo = ({ context, database }: { context: DatabaseEditorContext; database: string }) => {
  const { t } = useTranslation();
  const client = useClient();
  const [tableContext, setTableContext] = useState<DatabaseEditorDBContext>({
    app: context.app,
    pmv: context.pmv,
    file: context.file,
    databaseName: database
  });

  const tables = useQuery({
    queryKey: useMemo(() => genQueryKey('datbaseInfo', tableContext), [tableContext]),
    queryFn: async () => {
      const content = await client.databaseInfo(tableContext);
      return { ...content };
    },
    structuralSharing: false
  });

  const validResponse = () => !tables.isPending && tables.isSuccess && tables.data.connectionName !== '';

  useEffect(() => {
    setTableContext(() => {
      return {
        app: context.app,
        pmv: context.pmv,
        file: context.file,
        databaseName: database
      };
    });
  }, [database, context]);

  return (
    <div className='table-info'>
      {validResponse() ? <TableData data={tables.data ?? { connectionName: t('import.noData'), tables: [] }} /> : t('import.noData')}
    </div>
  );
};
