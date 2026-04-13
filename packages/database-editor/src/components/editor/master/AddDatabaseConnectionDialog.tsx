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
  selectRow,
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

import { configKeySanitize } from '@axonivy/ui-components';
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
  const { context, databaseConfigs, setData, setSelectedDatabase } = useAppContext();
  const jdbcDrivers = useMeta('meta/jdbcDrivers', context).data;

  const [name, setName] = useState('NewDatabaseConnection');
  const nameValidationMessage = useValidateDatabaseConnectionKey(name);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const sanitizedKey = configKeySanitize(name);
  const sanitizeMessage: MessageData = { variant: 'info', message: t('dialog.addDatabaseConnection.sanitizedKey', { key: sanitizedKey }) };

  const addDatabaseConnection = (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
    const newDatabaseConnection: DatabaseConfigurationData = {
      key: sanitizedKey,
      name: name,
      driver: jdbcDrivers?.at(0)?.name ?? '',
      icon: '',
      maxConnections: 5,
      properties: {},
      additionalProperties: {}
    };

    setData(prev => {
      const newConfigs = structuredClone(prev);
      const newDatabaseConfigs = addRow(table, newConfigs.connections, newDatabaseConnection);
      newConfigs.connections = newDatabaseConfigs;
      return newConfigs;
    });

    if (event.ctrlKey || event.metaKey) {
      setName('');
      nameInputRef.current?.focus();
    } else {
      closeDialog();
    }
    selectRow(table, databaseConfigs.length.toString());
    setSelectedDatabase(databaseConfigs.length);
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
      <BasicField label={t('common.label.name')} message={nameValidationMessage || sanitizeMessage}>
        <BasicInput value={name} onChange={event => setName(event.target.value)} ref={nameInputRef} />
      </BasicField>
    </BasicDialogContent>
  );
};

export const useValidateDatabaseConnectionKey = (key: string) => {
  const { t } = useTranslation();
  const { databaseConfigs } = useAppContext();
  const sanitizedKey = configKeySanitize(key);
  if (sanitizedKey === '') {
    return toErrorMessage(t('dialog.addDatabaseConnection.emptyNameError'));
  }
  if (databaseConfigs.some(config => config.key.toLowerCase() === sanitizedKey.toLowerCase())) {
    return toErrorMessage(t('dialog.addDatabaseConnection.nameTakenError'));
  }
  return;
};

const toErrorMessage = (message: string): MessageData => {
  return { message: message, variant: 'error' };
};
