import type { DatabaseEditorContext, DatabaseTable } from '@axonivy/database-editor-protocol';
import { BasicField, Flex } from '@axonivy/ui-components';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useClient } from '../../../protocol/ClientContextProvider';
import { genQueryKey } from '../../../query/query-client';
import { TableMultiSelect } from '../TableMultiSelect';

export type SelectTablesPageProps = {
  context: DatabaseEditorContext;
  selectedDatabase: string;
  updateSelection: (table: DatabaseTable, add: boolean) => void;
  selectedTables: Array<DatabaseTable>;
};

export const SelectTablesPage = ({ context, selectedDatabase, updateSelection, selectedTables }: SelectTablesPageProps) => {
  const { t } = useTranslation();
  const client = useClient();

  const tableContext = useMemo(
    () => ({
      app: context.app,
      pmv: context.pmv,
      file: context.file,
      databaseName: selectedDatabase
    }),
    [context, selectedDatabase]
  );

  const tableQuery = useQuery({
    queryKey: useMemo(() => genQueryKey('datbaseInfo', tableContext), [tableContext]),
    queryFn: async () => {
      const content = await client.databaseInfo(tableContext);
      return { ...content };
    },
    structuralSharing: false
  });

  return (
    <Flex className='import-page table-selection-page' direction='column'>
      <BasicField label={t('import.selectMainTables')}>
        <TableMultiSelect tables={tableQuery.data?.tables ?? []} updateSelection={updateSelection} selection={selectedTables} />
      </BasicField>
    </Flex>
  );
};
