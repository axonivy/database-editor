import type { DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { BasicField, Input } from '@axonivy/ui-components';
import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useMeta } from '../../../protocol/use-meta';
import { SelectionList } from '../components/SelectionList';

export type SelectTablesPageProps = {
  context: DatabaseEditorContext;
  selectedDatabase: string;
  setSelectedTables: Dispatch<SetStateAction<string[]>>;
  selectedTables: Array<string>;
};

export const SelectTablesPage = ({ context, selectedDatabase, setSelectedTables, selectedTables }: SelectTablesPageProps) => {
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

  return (
    <>
      <BasicField label={t('import.filter')}>
        <Input value={filter} onChange={e => setFilter(e.target.value)}></Input>
      </BasicField>
      <SelectionList
        list={metaQuery.data?.tables ?? []}
        selection={selectedTables}
        setSelection={setSelectedTables}
        filter={filter}
        listTitle={t('import.selectTables')}
        selectionTitle={t('import.tableSelection')}
        selectionPlaceholder={t('import.tableSelectionPlaceholder')}
      />
    </>
  );
};
