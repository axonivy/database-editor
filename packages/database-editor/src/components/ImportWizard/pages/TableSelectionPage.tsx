import { BasicField, BasicInput, Flex } from '@axonivy/ui-components';
import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useMeta } from '../../../protocol/use-meta';
import { useContextProvider } from '../../../util/ContextProvider';
import { SelectionList } from '../components/SelectionList';

export type SelectTablesPageProps = {
  selectedDatabase: string;
  setSelectedTables: Dispatch<SetStateAction<string[]>>;
  selectedTables: Array<string>;
};

export const SelectTablesPage = ({ selectedDatabase, setSelectedTables, selectedTables }: SelectTablesPageProps) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const { context } = useContextProvider();
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
    <Flex direction='column' className='import-wizard-page' gap={4}>
      <BasicField label={t('import.filter')}>
        <BasicInput value={filter} onChange={e => setFilter(e.target.value)} />
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
    </Flex>
  );
};
