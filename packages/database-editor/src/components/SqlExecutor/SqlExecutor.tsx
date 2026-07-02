import {
  Dialog,
  DialogContent,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDialogHotkeys,
  useHotkeys
} from '@axonivy/ui-components';
import { type ReactNode } from 'react';
import { useAppContext } from '../../AppContext';
import { useKnownHotkeys } from '../../util/hotkeys';
import { SqlExecutorContent } from './SqlExecutorContent';

const DIALOG_HOTKEY_IDS = ['sqlExecutorDialog'];

export const SqlExecutor = ({ children }: { children: ReactNode }) => {
  const { databaseConfigs } = useAppContext();
  const hotkeys = useKnownHotkeys();
  const { open, onOpenChange } = useDialogHotkeys(DIALOG_HOTKEY_IDS);
  const { selectedDatabase } = useAppContext();
  const database = selectedDatabase !== undefined ? databaseConfigs[selectedDatabase] : undefined;

  useHotkeys(hotkeys.sqlExecutor.hotkey, () => onOpenChange(true), {
    scopes: ['global'],
    keyup: true,
    enabled: !open && !!database
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild disabled={!database}>
              {children}
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{hotkeys.sqlExecutor.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {database && (
        <DialogContent className='h-auto! max-h-[calc(100vh-4rem)]! w-[clamp(300px,1200px,calc(100%-200px))]! max-w-none! overflow-y-auto!'>
          <SqlExecutorContent database={database} />
        </DialogContent>
      )}
    </Dialog>
  );
};
