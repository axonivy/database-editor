import type { DatabaseConfig } from '@axonivy/database-editor-protocol';
import {
  Button,
  deleteFirstSelectedRow,
  Flex,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { Table } from '@tanstack/react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { ImportWizard } from '../../ImportWizard/ImportWizard';
import { DbConnectionAddDialog } from './DbConnectionAddDialog';

export const MasterControl = ({ table }: { table: Table<DatabaseConfig> }) => {
  const { context, projects, databaseConfigs, setData } = useAppContext();
  const [addDialog, setAddDialog] = useState(false);
  const { t } = useTranslation();
  return (
    <Flex direction='row' gap={2} className='database-editor-main-control'>
      <DbConnectionAddDialog open={addDialog} setOpen={setAddDialog} />
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <Button
        icon={IvyIcons.Trash}
        onClick={() => {
          const { newData } = deleteFirstSelectedRow(table, databaseConfigs);
          setData({ databaseConfigs: newData });
        }}
      />
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <TooltipProvider>
        <Tooltip>
          <TooltipContent>{t('import.generateTooltip')}</TooltipContent>
          <ImportWizard context={{ file: context.file, app: context.app, projects }}>
            <TooltipTrigger asChild>
              <Button aria-label={t('import.generate')} icon={IvyIcons.SettingsCog} />
            </TooltipTrigger>
          </ImportWizard>
        </Tooltip>
      </TooltipProvider>
    </Flex>
  );
};
