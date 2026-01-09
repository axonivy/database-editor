import type { Databaseconfigs } from '@axonivy/database-editor-protocol';
import { BasicField, Button, Flex, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { SelectionListField } from '../../ImportWizard/components/SelectionList';
import { ImportWizard } from '../../ImportWizard/ImportWizard';
import { DbConnectionAddDialog } from './DbConnectionAddDialog';

export const DatabaseMasterContent = ({ setDetail }: { setDetail: (state: boolean) => void }) => {
  const { t } = useTranslation();
  const { setActiveDb, data } = useAppContext();

  return (
    <Flex direction='row' gap={4}>
      <BasicField style={{ width: '100%', height: '100%' }} label={t('database.allConnections')} control={<DbConnectionControls />}>
        <SelectionListField
          selectionTitle=''
          items={data?.databaseConfigs.map(d => d.name) ?? []}
          onClick={value => {
            const db = data?.databaseConfigs?.filter(d => d.name === value)[0];
            if (db) {
              setActiveDb(db);
              setDetail(true);
            }
          }}
          control={undefined}
        />
      </BasicField>
    </Flex>
  );
};

const DbConnectionControls = () => {
  const { context, projects, setActiveDb, activeDb, setData, data } = useAppContext();
  const [addDialog, setAddDialog] = useState(false);
  const { t } = useTranslation();
  return (
    <Flex direction='row' gap={2}>
      <DbConnectionAddDialog open={addDialog} setOpen={setAddDialog} />
      <Button
        icon={IvyIcons.Trash}
        onClick={() => {
          if (!data) return;
          const update: Databaseconfigs = { ...data };
          update.databaseConfigs = update.databaseConfigs.filter(c => c.name !== activeDb?.name);
          setData(update);
          setActiveDb(undefined);
        }}
      ></Button>
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
