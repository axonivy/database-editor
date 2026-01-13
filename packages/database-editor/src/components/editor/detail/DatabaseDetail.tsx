import { Flex, SidebarHeader, useHotkeys } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelectedDatabaseConfig } from '../../../util/database';
import { useKnownHotkeys } from '../../../util/hotkeys';
import { ConfigurationProperties } from './ConfigurationProperties';

export const DatabaseDetail = () => {
  const { t } = useTranslation();

  const hotkeys = useKnownHotkeys();
  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusInscription.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });

  let title = t('database.connectionProperties');
  const databaseConfig = useSelectedDatabaseConfig();
  if (databaseConfig) {
    title = `${title} - ${databaseConfig.name}`;
  }

  return (
    <Flex direction='column' className='database-editor-panel-content'>
      <SidebarHeader title={title} icon={IvyIcons.PenEdit} className='database-editor-detail-toolbar' tabIndex={-1} ref={firstElement} />
      <ConfigurationProperties />
    </Flex>
  );
};
