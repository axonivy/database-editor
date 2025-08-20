import type { DatabaseEditorContext, DatabaseEditorDBContext, DatabaseTable } from '@axonivy/database-editor-protocol';
import { Button, Flex, Label } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClient } from '../../../protocol/ClientContextProvider';
import { genQueryKey } from '../../../query/query-client';
import { notImplemented } from '../ImportWizard';
import { TableDropdown } from '../TableDropdown';

export type SelectTablesPageProps = {
  context: DatabaseEditorContext;
  selectedDatabase: string;
  updateSelection: (table: DatabaseTable, add: boolean) => void;
  selectedTables: Array<DatabaseTable>;
};

export const SelectTablesPage = ({ context, selectedDatabase, updateSelection, selectedTables }: SelectTablesPageProps) => {
  const { t } = useTranslation();
  const client = useClient();
  const [tableContext, setTableContext] = useState<DatabaseEditorDBContext>({
    app: context.app,
    pmv: context.pmv,
    file: context.file,
    databaseName: selectedDatabase
  });

  useEffect(() => {
    setTableContext(() => {
      return {
        app: context.app,
        pmv: context.pmv,
        file: context.file,
        databaseName: selectedDatabase
      };
    });
  }, [selectedDatabase, context]);

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
      <div className='import-grid'>
        <Label className='import-label'>{t('import.selectMainTables')}</Label>
        <TableDropdown tables={tableQuery.data?.tables ?? []} updateSelection={updateSelection} selection={selectedTables} />
        <Button onClick={notImplemented} variant='outline' icon={IvyIcons.Plus}>
          {t('import.add')}
        </Button>
      </div>
    </Flex>
  );
};
