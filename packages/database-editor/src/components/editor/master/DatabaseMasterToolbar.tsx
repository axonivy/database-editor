import {
  Button,
  Flex,
  hotkeyRedoFix,
  hotkeyUndoFix,
  Separator,
  Toolbar,
  ToolbarContainer,
  ToolbarTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys,
  useReadonly
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useKnownHotkeys } from '../../../util/hotkeys';

export const DatabaseMasterToolbar = ({ detail, setDetail }: { detail: boolean; setDetail: (value: boolean) => void }) => {
  const { t } = useTranslation();
  const { context } = useAppContext();
  const readonly = useReadonly();

  const hotkeys = useKnownHotkeys();
  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusToolbar.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });

  return (
    <Toolbar className='database-editor-toolbar' tabIndex={-1} ref={firstElement}>
      <ToolbarTitle>{t('database.databaseEditor', { projectName: context.pmv })}</ToolbarTitle>
      <Flex gap={1}>
        {!readonly && <EditButtons />}
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
      </Flex>
    </Toolbar>
  );
};

const EditButtons = () => {
  const { history, setUnhistorisedDataClass } = useAppContext();
  const hotkeys = useKnownHotkeys();
  const undo = () => history.undo(setUnhistorisedDataClass);
  const redo = () => history.redo(setUnhistorisedDataClass);
  useHotkeys(hotkeys.undo.hotkey, e => hotkeyUndoFix(e, undo), { scopes: ['global'] });
  useHotkeys(hotkeys.redo.hotkey, e => hotkeyRedoFix(e, redo), { scopes: ['global'] });
  return (
    <ToolbarContainer maxWidth={450}>
      <Flex>
        <Flex gap={1}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button aria-label={hotkeys.undo.label} icon={IvyIcons.Undo} size='large' onClick={undo} disabled={!history.canUndo} />
              </TooltipTrigger>
              <TooltipContent>{hotkeys.undo.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button aria-label={hotkeys.redo.label} icon={IvyIcons.Redo} size='large' onClick={redo} disabled={!history.canRedo} />
              </TooltipTrigger>
              <TooltipContent>{hotkeys.redo.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Flex>
        <Separator orientation='vertical' style={{ height: '26px', marginInline: 'var(--size-2)' }} />
      </Flex>
    </ToolbarContainer>
  );
};
