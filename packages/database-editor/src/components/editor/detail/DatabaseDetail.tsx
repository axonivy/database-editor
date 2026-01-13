import { Flex, SidebarHeader } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useSelectedDatabaseConfig } from '../../../util/database';
import { ConfigurationProperties } from './ConfigurationProperties';

export const DatabaseDetail = () => {
  const { t } = useTranslation();

  let title = t('database.connectionProperties');
  const databaseConfig = useSelectedDatabaseConfig();
  if (databaseConfig) {
    title = `${title} - ${databaseConfig.name}`;
  }

  return (
    <Flex direction='column' className='database-editor-panel-content'>
      <SidebarHeader title={title} icon={IvyIcons.PenEdit} className='database-editor-detail-toolbar' />
      <ConfigurationProperties />
    </Flex>
  );
};
