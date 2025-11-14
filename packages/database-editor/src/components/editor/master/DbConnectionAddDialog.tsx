import { BasicField, Button, Dialog, DialogContent, DialogTitle, DialogTrigger, Flex, Input } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDatabaseMutation } from '../useDatabaseMutation';

export const DbConnectionAddDialog = ({ open, setOpen }: { open: boolean; setOpen: (state: boolean) => void }) => {
  const [name, setName] = useState('');
  const { createConnection } = useDatabaseMutation();
  const { t } = useTranslation();

  const changeDialogState = (state: boolean = false) => {
    setName('');
    setOpen(state);
  };

  return (
    <Dialog open={open} onOpenChange={changeDialogState}>
      <DialogTrigger asChild>
        <Button icon={IvyIcons.Plus} />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t('database.createNewConnection')}</DialogTitle>
        <BasicField label={t('common.label.name')}>
          <Input value={name} onChange={event => setName(event.target.value)}></Input>
        </BasicField>
        <Flex direction='row' gap={2} justifyContent='flex-end'>
          <Button variant='outline' onClick={() => changeDialogState()}>
            {t('common.label.cancel')}
          </Button>
          <Button
            disabled={name.trim() === ''}
            variant='primary'
            onClick={() => {
              createConnection(name);
              changeDialogState();
            }}
          >
            {t('common.label.create')}
          </Button>
        </Flex>
      </DialogContent>
    </Dialog>
  );
};
