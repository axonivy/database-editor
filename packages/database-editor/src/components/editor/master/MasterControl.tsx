import type { DatabaseConfig } from '@axonivy/database-editor-protocol';
import { Button, deleteFirstSelectedRow, Flex, PanelMessage, Separator } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { ImportWizard } from '../../ImportWizard/ImportWizard';
import { DbConnectionAddDialog } from './DbConnectionAddDialog';

export const MasterControl = ({ table }: { table: Table<DatabaseConfig> }) => {
  const { databaseConfigs, setData } = useAppContext();
  const { t } = useTranslation();
  return (
    <Flex direction='row' gap={2} className='database-editor-main-control'>
      <DbConnectionAddDialog>
        <Button icon={IvyIcons.Plus} aria-label={t('database.createNewConnection')} />
      </DbConnectionAddDialog>
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <Button
        icon={IvyIcons.Trash}
        onClick={() => {
          const { newData } = deleteFirstSelectedRow(table, databaseConfigs);
          setData({ databaseConfigs: newData });
        }}
        aria-label={t('database.deleteConnection')}
      />
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <ImportWizard>
        <Button aria-label={t('import.generate')} icon={IvyIcons.SettingsCog} />
      </ImportWizard>
    </Flex>
  );
};

export const EmptyMasterControl = () => {
  const { t } = useTranslation();
  return (
    <Flex direction='column' alignItems='center' justifyContent='center' style={{ height: '100%' }}>
      <PanelMessage icon={IvyIcons.Tool} message={t('main.addFirstDbConnection')} mode='column'>
        <Flex gap={2}>
          <DbConnectionAddDialog>
            <Button size='large' variant='primary' icon={IvyIcons.Plus}>
              {t('database.createNewConnection')}
            </Button>
          </DbConnectionAddDialog>
        </Flex>
      </PanelMessage>
    </Flex>
  );
};
