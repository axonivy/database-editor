import { BasicDialogContent, BasicField, BasicInput, Button, Dialog, DialogContent, DialogTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
