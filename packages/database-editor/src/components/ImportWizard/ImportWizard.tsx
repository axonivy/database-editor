import type { DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@axonivy/ui-components';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../AppContext';
import { ContextProvider } from '../../util/ContextProvider';
import './ImportWizard.css';
import { WizardContent } from './WizardContent';

export const ImportWizard = ({ children, callback }: { children: ReactNode; callback?: () => void }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { context, projects } = useAppContext();

  const [importContext] = useState<DatabaseEditorContext>({
    app: context.app,
    file: context.file,
    pmv: projects.length >= 1 ? (projects[0] as string) : ''
  });

  return (
    <ContextProvider context={importContext}>
      <Dialog open={open} onOpenChange={setOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>{children}</DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>{t('import.generateTooltip')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className='database-editor-import-dialog'>
          <DialogTitle>{t('import.generate')}</DialogTitle>
          <WizardContent projects={projects} setOpen={setOpen} callback={callback} />
        </DialogContent>
      </Dialog>
    </ContextProvider>
  );
};
