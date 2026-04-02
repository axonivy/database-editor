import { Dialog, DialogContent, DialogTrigger, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../AppContext';
import { SqlQueryContent } from './SqlQueryContent';

export const SqlQueryTester = ({ children }: { children: ReactNode }) => {
  const { databaseConfigs } = useAppContext();
  const { t } = useTranslation();
  const { selectedDatabase } = useAppContext();
  const database = selectedDatabase !== undefined ? databaseConfigs[selectedDatabase] : undefined;

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild disabled={!database}>
              {children}
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{t('dialog.sqlQueryTester.title')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {database && (
        <DialogContent className='h-auto! max-h-none! w-[clamp(300px,1200px,calc(100%-200px))]! max-w-none!'>
          <SqlQueryContent database={database} />
        </DialogContent>
      )}
    </Dialog>
  );
};
