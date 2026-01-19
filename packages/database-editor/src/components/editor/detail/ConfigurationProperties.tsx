import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import { Flex, PanelMessage } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useMeta } from '../../../protocol/use-meta';
import { useSelectedDatabaseConfig } from '../../../util/database';
import { AdditionalCollapsible } from './AdditionalPropertyCollapsible';
import './ConfigurationProperties.css';
import { GeneralCollapsible } from './GeneralCollapsible';
import { PropertyCollapsible } from './PropertyCollapsible';

export const ConfigurationProperties = () => {
  const { t } = useTranslation();
  const { setData, selectedDatabase } = useAppContext();
  const jdbcDrivers = useMeta('meta/jdbcDrivers', undefined).data;

  const databaseConfig = useSelectedDatabaseConfig();
  if (!databaseConfig) {
    return <PanelMessage message={t('detail.noSelection')} />;
  }

  const jdbcDriver = jdbcDrivers?.find(driver => driver.name === databaseConfig.driver);
  const jdbcProps = Object.keys(jdbcDriver?.properties ?? {});

  const updateDb = (propertyUpdater: (database: DatabaseConfigurationData) => void) => {
    if (selectedDatabase === undefined) return;
    setData(prev => {
      const newConfigs = structuredClone(prev);
      const updateDatabase = newConfigs.connections[selectedDatabase];
      if (!updateDatabase) {
        return prev;
      }
      propertyUpdater(updateDatabase);
      return newConfigs;
    });
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
