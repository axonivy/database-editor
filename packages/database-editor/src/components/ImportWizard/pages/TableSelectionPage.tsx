import type { DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { BasicField, Flex, Input } from '@axonivy/ui-components';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMeta } from '../../../protocol/use-meta';
import { TableSelectionButton } from '../components/TableSelectionButton';
import './TableSelectionPage.css';

export type SelectTablesPageProps = {
  context: DatabaseEditorContext;
  selectedDatabase: string;
  updateSelection: (table: string, add: boolean) => void;
  selectedTables: Array<string>;
};

export const SelectTablesPage = ({ context, selectedDatabase, updateSelection, selectedTables }: SelectTablesPageProps) => {
  const { t } = useTranslation();
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

  const metaQuery = useMeta('meta/databaseTableNames', tableContext);

  const selectedFirst = (a: string, b: string) => {
    const aSelected = selectedTables.includes(a);
    const bSelected = selectedTables.includes(b);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return a.localeCompare(b);
  };

  return (
    <>
      <BasicField label={t('import.filter')}>
        <Input value={filter} onChange={e => setFilter(e.target.value)}></Input>
      </BasicField>
      <Flex className='table-container' direction='column' gap={2}>
        {metaQuery.data?.tables
          .sort(selectedFirst)
          .filter(t => t.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
          .map(table => (
            <TableSelectionButton
              key={table}
              table={table}
              active={selectedTables.some(t => t === table)}
              onClick={() => updateSelection(table, !selectedTables.includes(table))}
            />
          ))}
      </Flex>
    </>
  );
};
