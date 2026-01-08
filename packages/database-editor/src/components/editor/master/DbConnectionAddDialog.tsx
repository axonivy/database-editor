import { UNDEFINED_CONNECTION, type DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import { BasicDialogContent, BasicField, BasicInput, Button, Dialog, DialogContent, DialogTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useMeta } from '../../../protocol/use-meta';

export const DbConnectionAddDialog = ({ open, setOpen }: { open: boolean; setOpen: (state: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button icon={IvyIcons.Plus} />
      </DialogTrigger>
      <DialogContent>
        <AddConnectionDialog setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

const AddConnectionDialog = ({ setOpen }: { setOpen: (state: boolean) => void }) => {
  const [name, setName] = useState('');
  const { data, setData } = useAppContext();
  const { t } = useTranslation();
  const jdbcDrivers = useMeta('meta/jdbcDrivers', undefined).data;

  const addConfig = () => {
    if (!data) {
      return;
    }
    const newConnection: DatabaseConfigurationData = {
      ...UNDEFINED_CONNECTION
    };
    newConnection.driver = jdbcDrivers?.at(0)?.name ?? '';
    newConnection.name = name;
    const update = { ...data };
    update.connections?.push(newConnection);
    setData(update);
  };

  return (
    <BasicDialogContent
      title={t('database.createNewConnection')}
      description=''
      cancel={
        <Button variant='outline' onClick={() => setOpen(false)}>
          {t('common.label.cancel')}
        </Button>
      }
      submit={
        <Button
          disabled={name.trim() === ''}
          variant='primary'
          onClick={() => {
            addConfig();
            setOpen(false);
          }}
        >
          {t('common.label.create')}
        </Button>
      }
    >
      <BasicField label={t('common.label.name')}>
        <BasicInput value={name} onChange={event => setName(event.target.value)} />
      </BasicField>
    </BasicDialogContent>
  );
};
