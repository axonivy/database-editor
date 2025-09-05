import type { ImportWizardContext } from '@axonivy/database-editor-protocol';
import { BasicDialogHeader, Dialog, DialogContent, DialogTrigger, toast } from '@axonivy/ui-components';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import './ImportWizard.css';
import { WizardContent } from './WizardContent';

export const ImportWizard = ({
  context,
  children,
  callback
}: {
  context: ImportWizardContext;
  children: ReactNode;
  callback?: () => void;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='import-dialog'>
        <BasicDialogHeader title={t('import.dataImport')} description={''} />
        <WizardContent context={context} setOpen={setOpen} callback={callback} />
      </DialogContent>
    </Dialog>
  );
};

export const notImplemented = () => toast.info('not yet implemented');
