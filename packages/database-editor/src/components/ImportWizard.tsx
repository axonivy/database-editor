import type { DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { BasicDialogContent, BasicField, Button, Dialog, DialogContent, DialogTrigger } from '@axonivy/ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DatabaseSelection } from './DatabaseSelection';
import { DatabaseTableInfo } from './DatabaseTableInfo';
import './ImportWizard.css';

export const ImportWizard = ({ context }: { context: DatabaseEditorContext }) => {
  const { t } = useTranslation();
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button variant='outline'>{t('importWizard')}</Button>
      </DialogTrigger>
      <DialogContent className='import-wizard-dialog'>
        <BasicDialogContent
          className='import-wizard-dialog-content'
          cancel={<Button>{t('close')}</Button>}
          description=''
          submit={<></>}
          title={t('importWizard')}
        >
          <BasicField label={t('database')}>
            <DatabaseSelection updateSelection={setSelectedDatabase} context={context} />
          </BasicField>
          <DatabaseTableInfo context={context} database={selectedDatabase} />
        </BasicDialogContent>
      </DialogContent>
    </Dialog>
  );
};
