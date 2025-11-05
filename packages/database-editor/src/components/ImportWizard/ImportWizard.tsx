import type { ImportWizardContext } from '@axonivy/database-editor-protocol';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@axonivy/ui-components';
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
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='database-editor-import-dialog'>
        <DialogTitle className='databse-editor-import-title'>{t('import.generate')}</DialogTitle>
        <WizardContent context={context} setOpen={setOpen} callback={callback} />
      </DialogContent>
    </Dialog>
  );
};
