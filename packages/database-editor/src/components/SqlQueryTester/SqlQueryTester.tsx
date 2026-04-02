import { Dialog, DialogContent, DialogTrigger, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../AppContext';
import { SqlQueryContent } from './SqlQueryContent';

export const SqlQueryTester = ({ children, selectedDatabase }: { children: ReactNode; selectedDatabase?: number }) => {
  const { databaseConfigs } = useAppContext();
  const { t } = useTranslation();
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
        <DialogContent style={{ minWidth: 700 }}>
          <SqlQueryContent database={database} />
        </DialogContent>
      )}
    </Dialog>
  );
};
