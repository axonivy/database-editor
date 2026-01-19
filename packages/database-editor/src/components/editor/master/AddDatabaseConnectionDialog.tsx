import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import {
  addRow,
  BasicDialogContent,
  BasicField,
  BasicInput,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  hotkeyText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDialogHotkeys,
  useHotkeys,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { Table } from '@tanstack/react-table';
import { useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useMeta } from '../../../protocol/use-meta';

import { useKnownHotkeys } from '../../../util/hotkeys';

const DIALOG_HOTKEY_IDS = ['addDatabaseConnectionDialog'];

export const AddDatabaseConnectionDialog = ({ table, children }: { table: Table<DatabaseConfigurationData>; children: ReactNode }) => {
  const hotkeys = useKnownHotkeys();
  const { open, onOpenChange } = useDialogHotkeys(DIALOG_HOTKEY_IDS);
  useHotkeys(hotkeys.addDatabaseConnection.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{children}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{hotkeys.addDatabaseConnection.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <AddDatabaseConnectionContent table={table} closeDialog={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

type AddDatabaseConnectionContentProps = {
  table: Table<DatabaseConfigurationData>;
  closeDialog: () => void;
};

const AddDatabaseConnectionContent = ({ table, closeDialog }: AddDatabaseConnectionContentProps) => {
  const { t } = useTranslation();
  const { setData, setSelectedDatabase } = useAppContext();
  const jdbcDrivers = useMeta('meta/jdbcDrivers', undefined).data;

  const [name, setName] = useState('NewDatabaseConnection');
  const nameValidationMessage = useValidateDatabaseConnectionName(name);
  const nameInput = useRef<HTMLInputElement>(null);

  const addDatabaseConnection = (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
    const newDatabaseConnection: DatabaseConfigurationData = {
      name,
      driver: jdbcDrivers?.at(0)?.name ?? '',
      icon: '',
      maxConnections: 0,
      properties: {},
      additionalProperties: {}
    };

    setData(prev => {
      const newConfigs = structuredClone(prev);
      const newDatabaseConfigs = addRow(table, newConfigs.connections, newDatabaseConnection);
      newConfigs.connections = newDatabaseConfigs;
      setSelectedDatabase(newConfigs.connections.findIndex(config => config.name === name));
      return newConfigs;
    });

    if (event.ctrlKey || event.metaKey) {
      setName('');
      nameInput.current?.focus();
    } else {
      closeDialog();
    }
  };

  const allInputsValid = nameValidationMessage === undefined;
  const enter = useHotkeys<HTMLDivElement>(
    ['Enter', 'mod+Enter'],
    event => {
      if (allInputsValid) {
        addDatabaseConnection(event);
      }
    },
    { scopes: DIALOG_HOTKEY_IDS, enableOnFormTags: true }
  );

  return (
    <BasicDialogContent
      title={t('dialog.addDatabaseConnection.title')}
      description={t('dialog.addDatabaseConnection.description')}
      submit={
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='primary' icon={IvyIcons.Plus} disabled={!allInputsValid} onClick={addDatabaseConnection}>
                {t('dialog.addDatabaseConnection.createDatabaseConnection')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {t('dialog.addDatabaseConnection.createDatabaseConnectionTooltip', { modifier: hotkeyText('mod') })}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
      cancel={<Button variant='outline'>{t('common.label.cancel')}</Button>}
      ref={enter}
    >
      <BasicField label={t('common.label.name')} message={nameValidationMessage}>
        <BasicInput value={name} onChange={event => setName(event.target.value)} ref={nameInput} />
      </BasicField>
    </BasicDialogContent>
  );
};

export const useValidateDatabaseConnectionName = (name: string) => {
  const { t } = useTranslation();
  const { databaseConfigs } = useAppContext();
  if (name.trim() === '') {
    return toErrorMessage(t('dialog.addDatabaseConnection.emptyNameError'));
  }
  if (databaseConfigs.some(config => config.name === name)) {
    return toErrorMessage(t('dialog.addDatabaseConnection.nameTakenError'));
  }
  return;
};

const toErrorMessage = (message: string): MessageData => {
  return { message: message, variant: 'error' };
};
