import { UNDEFINED_CONNECTION, type DatabaseConfigurationData, type DatabaseConfigurations } from '@axonivy/database-editor-protocol';
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
  const { activeDb, setActiveDb, data, setData } = useAppContext();
  const jdbcDrivers = useMeta('meta/jdbcDrivers', undefined).data;
  const jdbcDriver = jdbcDrivers?.filter(d => d.name === activeDb?.driver)[0];
  const jdbcProps = Object.keys(jdbcDriver?.properties ?? {});

  const updateData = (update: DatabaseConfigurationData) => {
    const updateData: DatabaseConfigurations = { connections: data?.connections ?? [], ...data };
    const index = updateData.connections.findIndex(c => c.name === update.name);
    updateData.connections[index] = update;
    setData(updateData);
  };

  const updateDb = (key: string, value: string) => {
    setActiveDb(prev => {
      if (!prev) return prev;
      let update: DatabaseConfigurationData;
      if (key in UNDEFINED_CONNECTION) {
        update = { ...prev, [key]: value };
      } else {
        update = {
          ...prev,
          properties: {
            ...prev.properties,
            [key]: value
          }
        };
      }
      updateData(update);
      return update;
    });
  };

  return (
    <Flex direction='column' gap={3} className='configuration-options'>
      {activeDb ? (
        <>
          <GeneralCollapsible updateDb={updateDb} jdbcDrivers={jdbcDrivers ?? []} />
          <PropertyCollapsible
            jdbcDriver={jdbcDriver ?? { name: 'unknown driver', properties: {} }}
            jdbcProps={jdbcProps}
            updateDb={updateDb}
          />
          <AdditionalCollapsible updateData={updateData} />
        </>
      ) : (
        <Message variant='info'>{t('database.selectDatabase')}</Message>
      )}
    </Flex>
  );
};
