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
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { Table } from '@tanstack/react-table';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useMeta } from '../../../protocol/use-meta';

export const AddDatabaseConnectionDialog = ({ table, children }: { table: Table<DatabaseConfigurationData>; children: ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <AddDatabaseConnectionContent table={table} />
      </DialogContent>
    </Dialog>
  );
};

const AddDatabaseConnectionContent = ({ table }: { table: Table<DatabaseConfigurationData> }) => {
  const { t } = useTranslation();
  const { setData, setSelectedDatabase } = useAppContext();
  const jdbcDrivers = useMeta('meta/jdbcDrivers', undefined).data;

  const [name, setName] = useState('NewDatabaseConnection');

  const nameValidationMessage = useValidateDatabaseConnectionName(name);

  const addDatabaseConnection = () => {
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
  };

  return (
    <BasicDialogContent
      title={t('dialog.addDatabaseConnection.title')}
      description={t('dialog.addDatabaseConnection.description')}
      submit={
        <Button variant='primary' icon={IvyIcons.Plus} disabled={nameValidationMessage !== undefined} onClick={addDatabaseConnection}>
          {t('dialog.addDatabaseConnection.createDatabaseConnection')}
        </Button>
      }
      cancel={<Button variant='outline'>{t('common.label.cancel')}</Button>}
    >
      <BasicField label={t('common.label.name')} message={nameValidationMessage}>
        <BasicInput value={name} onChange={event => setName(event.target.value)} />
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
