import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import { Button, Flex, PanelMessage, Separator, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useKnownHotkeys } from '../../../util/hotkeys';
import { ImportWizard } from '../../ImportWizard/ImportWizard';
import { AddDatabaseConnectionDialog } from './AddDatabaseConnectionDialog';

type MasterControlProps = {
  table: Table<DatabaseConfigurationData>;
  deleteDatabaseConnection: () => void;
};

export const MasterControl = ({ table, deleteDatabaseConnection }: MasterControlProps) => {
  const hotkeys = useKnownHotkeys();
  const { context, projects, testConnection } = useAppContext();

  return (
    <Flex direction='row' gap={2} className='database-editor-main-control'>
      <AddDatabaseConnectionDialog table={table}>
        <Button icon={IvyIcons.Plus} aria-label={hotkeys.addDatabaseConnection.label} />
      </AddDatabaseConnectionDialog>
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              icon={IvyIcons.Trash}
              onClick={deleteDatabaseConnection}
              disabled={table.getSelectedRowModel().flatRows.length === 0}
              aria-label={hotkeys.deleteDatabaseConnection.label}
            />
          </TooltipTrigger>
          <TooltipContent>{hotkeys.deleteDatabaseConnection.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button icon={IvyIcons.DatabaseLink} onClick={testConnection} aria-label={hotkeys.testConnection.label} />
          </TooltipTrigger>
          <TooltipContent>{hotkeys.testConnection.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <ImportWizard context={{ app: context.app, file: context.file, projects: projects }}>
        <Button aria-label={hotkeys.generate.label} icon={IvyIcons.SettingsCog} />
      </ImportWizard>
    </Flex>
  );
};

export const EmptyMasterControl = ({ table }: { table: Table<DatabaseConfigurationData> }) => {
  const { t } = useTranslation();
  return (
    <Flex direction='column' alignItems='center' justifyContent='center' style={{ height: '100%' }}>
      <PanelMessage icon={IvyIcons.Tool} message={t('main.addFirstDbConnection')} mode='column'>
        <Flex gap={2}>
          <AddDatabaseConnectionDialog table={table}>
            <Button size='large' variant='primary' icon={IvyIcons.Plus}>
              {t('dialog.addDatabaseConnection.title')}
            </Button>
          </AddDatabaseConnectionDialog>
        </Flex>
      </PanelMessage>
    </Flex>
  );
};
