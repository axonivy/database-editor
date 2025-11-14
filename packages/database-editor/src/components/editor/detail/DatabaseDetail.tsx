import { BasicInscriptionTabs, Flex, SidebarHeader, type InscriptionTabProps } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationTab } from './ConfigurationTab';

export const DatabaseDetail = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState('Configuration');

  const configTab: InscriptionTabProps = {
    content: <ConfigurationTab />,
    name: t('common.label.configuration'),
    id: 'Configuration',
    icon: IvyIcons.Configuration
  };

  return (
    <Flex direction='column'>
      <SidebarHeader title={t('database.connenctionProperties')} icon={IvyIcons.PenEdit} />
      <BasicInscriptionTabs value={tab} onChange={setTab} tabs={[configTab]} />
    </Flex>
  );
};
