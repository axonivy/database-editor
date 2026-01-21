import type { DatabaseEditorContext, ImportWizardContext } from '@axonivy/database-editor-protocol';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDialogHotkeys,
  useHotkeys
} from '@axonivy/ui-components';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ContextProvider } from '../../util/ContextProvider';
import { useKnownHotkeys } from '../../util/hotkeys';
import './ImportWizard.css';
import { WizardContent } from './WizardContent';

const DIALOG_HOTKEY_IDS = ['importWizardDialog'];

export const ImportWizard = ({
  children,
  callback,
  context
}: {
  children: ReactNode;
  callback?: () => void;
  context: ImportWizardContext;
}) => {
  const { t } = useTranslation();

  const hotkeys = useKnownHotkeys();
  const { open, onOpenChange } = useDialogHotkeys(DIALOG_HOTKEY_IDS);
  useHotkeys(hotkeys.generate.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });

  const [importContext] = useState<DatabaseEditorContext>({
    app: context.app,
    file: context.file,
    pmv: context.projects.length >= 1 ? (context.projects[0] as string) : ''
  });

  return (
    <ContextProvider context={importContext}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>{children}</DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>{hotkeys.generate.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className='database-editor-import-dialog'>
          <DialogTitle>{t('import.generate')}</DialogTitle>
          <WizardContent projects={context.projects} closeDialog={() => onOpenChange(false)} callback={callback} />
        </DialogContent>
      </Dialog>
    </ContextProvider>
  );
};
