import type { DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { BasicDialogHeader, Button, Dialog, DialogContent, DialogTrigger, toast } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import './ImportWizard.css';
import { WizardContent } from './WizardContent';

export const ImportWizard = ({ context }: { context: DatabaseEditorContext }) => {
  const { t } = useTranslation();

  return (
    <Dialog modal open>
      <DialogTrigger asChild>
        <Button variant='outline'>{t('import.importWizard')}</Button>
      </DialogTrigger>
      <DialogContent className='import-dialog'>
        <BasicDialogHeader title={t('import.dataImport')} description={''} />
        <WizardContent context={context} />
      </DialogContent>
    </Dialog>
  );
};

export const notImplemented = () => toast.info('not yet implemented');
