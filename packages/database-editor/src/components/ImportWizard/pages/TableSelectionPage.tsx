import type { DatabaseEditorContext, DatabaseTable } from '@axonivy/database-editor-protocol';
import { BasicField, Flex, Input } from '@axonivy/ui-components';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClient } from '../../../protocol/ClientContextProvider';
import { genQueryKey } from '../../../query/query-client';
import { TableSelectionButton } from '../components/TableSelectionButton';
import './TableSelectionPage.css';

export type SelectTablesPageProps = {
  context: DatabaseEditorContext;
  selectedDatabase: string;
  updateSelection: (table: DatabaseTable, add: boolean) => void;
  selectedTables: Array<DatabaseTable>;
};

export const SelectTablesPage = ({ context, selectedDatabase, updateSelection, selectedTables }: SelectTablesPageProps) => {
  const { t } = useTranslation();
  const client = useClient();
  const [filter, setFilter] = useState('');

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

  const selectedFirst = (a: DatabaseTable, b: DatabaseTable) => {
    const aSelected = selectedTables.includes(a);
    const bSelected = selectedTables.includes(b);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return a.name.localeCompare(b.name);
  };

  return (
    <Flex className='import-page table-selection-page' direction='column'>
      <BasicField label={t('import.filter')}>
        <Input value={filter} onChange={e => setFilter(e.target.value)}></Input>
      </BasicField>
      <Flex className='table-container' direction='column' gap={2}>
        {tableQuery.data?.tables
          .sort(selectedFirst)
          .filter(t => t.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
          .map(table => (
            <TableSelectionButton
              key={table.name}
              table={table}
              active={selectedTables.some(t => t.name === table.name)}
              onClick={() => updateSelection(table, !selectedTables.includes(table))}
            />
          ))}
      </Flex>
    </Flex>
  );
};
