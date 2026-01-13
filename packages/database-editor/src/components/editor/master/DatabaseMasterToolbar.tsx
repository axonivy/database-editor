import {
  Button,
  Toolbar,
  ToolbarTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useKnownHotkeys } from '../../../util/hotkeys';

export const DatabaseMasterToolbar = ({ detail, setDetail }: { detail: boolean; setDetail: (value: boolean) => void }) => {
  const { t } = useTranslation();
  const { context } = useAppContext();

  const hotkeys = useKnownHotkeys();
  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusToolbar.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });

  return (
    <Toolbar className='database-editor-toolbar' tabIndex={-1} ref={firstElement}>
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
