import { Button, Toolbar, ToolbarTitle, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';

export const DatabaseMasterToolbar = ({ detail, setDetail }: { detail: boolean; setDetail: (value: boolean) => void }) => {
  const { t } = useTranslation();
  const { context } = useAppContext();

  return (
    <Toolbar className='database-editor-toolbar'>
      <ToolbarTitle>{t('database.databaseEditor', { projectName: context.pmv })}</ToolbarTitle>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              icon={IvyIcons.LayoutSidebarRightCollapse}
              size='large'
              onClick={() => setDetail(!detail)}
              aria-label={t('common.label.details')}
            />
          </TooltipTrigger>
          <TooltipContent>{t('common.label.details')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Toolbar>
  );
};
