import type { DatabaseEditorContext, ImportWizardContext } from '@axonivy/database-editor-protocol';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@axonivy/ui-components';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ContextProvider } from '../../util/ContextProvider';
import './ImportWizard.css';
import { WizardContent } from './WizardContent';

export const ImportWizard = ({
  context: importContext,
  children,
  callback
}: {
  context: ImportWizardContext;
  children: ReactNode;
  callback?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const [context] = useState<DatabaseEditorContext>({
    app: importContext.app,
    file: importContext.file,
    pmv: importContext.projects.length >= 1 ? (importContext.projects[0] as string) : ''
  });

  return (
    <ContextProvider context={context}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className='database-editor-import-dialog'>
          <DialogTitle>{t('import.generate')}</DialogTitle>
          <WizardContent projects={importContext.projects} setOpen={setOpen} callback={callback} />
        </DialogContent>
      </Dialog>
    </ContextProvider>
  );
};
