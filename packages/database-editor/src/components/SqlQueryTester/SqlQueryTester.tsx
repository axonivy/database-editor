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
import { SqlQueryContent } from './SqlQueryContent';

const DIALOG_HOTKEY_IDS = ['sqlQueryTesterDialog'];

export const SqlQueryTester = ({ children }: { children: ReactNode }) => {
  const { databaseConfigs } = useAppContext();
  const hotkeys = useKnownHotkeys();
  const { open, onOpenChange } = useDialogHotkeys(DIALOG_HOTKEY_IDS);
  const { selectedDatabase } = useAppContext();
  const database = selectedDatabase !== undefined ? databaseConfigs[selectedDatabase] : undefined;

  useHotkeys(hotkeys.sqlQueryTester.hotkey, () => onOpenChange(true), {
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
          <TooltipContent>{hotkeys.sqlQueryTester.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {database && (
        <DialogContent className='h-auto! max-h-[calc(100vh-4rem)]! w-[clamp(300px,1200px,calc(100%-200px))]! max-w-none! overflow-y-auto!'>
          <SqlQueryContent database={database} />
        </DialogContent>
      )}
    </Dialog>
  );
};
