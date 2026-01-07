import { Flex, SidebarHeader } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { ConfigurationProperties } from './ConfigurationProperties';

export const DatabaseDetail = () => {
  const { t } = useTranslation();

  return (
    <Flex direction='column' className='database-detail-view'>
      <SidebarHeader title={t('database.connenctionProperties')} icon={IvyIcons.PenEdit} className='detail-view-header' />
      <ConfigurationProperties />
    </Flex>
  );
};
