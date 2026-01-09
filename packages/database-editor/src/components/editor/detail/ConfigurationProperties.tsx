import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import { Flex, Message } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useMeta } from '../../../protocol/use-meta';
import { AdditionalCollapsible } from './AdditionalPropertyCollapsible';
import './ConfigurationProperties.css';
import { GeneralCollapsible } from './GeneralCollapsible';
import { PropertyCollapsible } from './PropertyCollapsible';

export const ConfigurationProperties = () => {
  const { t } = useTranslation();
  const { databaseConfigs, setData, selectedDatabase } = useAppContext();
  const jdbcDrivers = useMeta('meta/jdbcDrivers', undefined).data;

  const databaseConfig = selectedDatabase !== undefined ? databaseConfigs[selectedDatabase] : undefined;
  if (!databaseConfig) {
    return <Message variant='info'>{t('database.selectDatabase')}</Message>;
  }

  const jdbcDriver = jdbcDrivers?.find(driver => driver.name === databaseConfig.driver);
  const jdbcProps = Object.keys(jdbcDriver?.properties ?? {});

  const updateDb = (propertyUpdater: (database: DatabaseConfigurationData) => void) => {
    if (selectedDatabase === undefined) return;
    const updateData = structuredClone(databaseConfigs);
    const updateDatabase = updateData[selectedDatabase];
    if (!updateDatabase) return;
    propertyUpdater(updateDatabase);
    setData({ connections: updateData });
  };

  return (
    <Flex direction='column' gap={3} className='configuration-options'>
      <GeneralCollapsible activeDb={databaseConfig} updateDb={updateDb} jdbcDrivers={jdbcDrivers ?? []} />
      <PropertyCollapsible
        activeDb={databaseConfig}
        jdbcDriver={jdbcDriver ?? { name: 'unknown driver', properties: {} }}
        jdbcProps={jdbcProps}
        updateDb={updateDb}
      />
      <AdditionalCollapsible activeDb={databaseConfig} updateDb={updateDb} />
    </Flex>
  );
};
