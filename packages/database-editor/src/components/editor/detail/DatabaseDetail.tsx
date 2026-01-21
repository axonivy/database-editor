import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import { Flex, PanelMessage, SidebarHeader, Spinner, useHotkeys } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DetailProvider, useAppContext } from '../../../AppContext';
import { useMeta } from '../../../protocol/use-meta';
import { useKnownHotkeys } from '../../../util/hotkeys';
import { AdditionalCollapsible } from './AdditionalPropertyCollapsible';
import './DatabaseDetail.css';
import { GeneralCollapsible } from './GeneralCollapsible';
import { PropertyCollapsible } from './PropertyCollapsible';

export const DatabaseDetail = () => {
  const { t } = useTranslation();
  const { databaseConfigs, selectedDatabase } = useAppContext();

  const hotkeys = useKnownHotkeys();
  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusInscription.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });

  const databaseConfig = selectedDatabase !== undefined ? databaseConfigs[selectedDatabase] : undefined;
  let title = t('database.connectionProperties');
  if (databaseConfig) {
    title = `${title} - ${databaseConfig.name}`;
  }

  return (
    <Flex direction='column' className='database-editor-panel-content'>
      <SidebarHeader title={title} icon={IvyIcons.PenEdit} className='database-editor-detail-toolbar' tabIndex={-1} ref={firstElement} />
      <DatabaseDetailContent databaseConfig={databaseConfig} />
    </Flex>
  );
};

const DatabaseDetailContent = ({ databaseConfig }: { databaseConfig?: DatabaseConfigurationData }) => {
  const { t } = useTranslation();
  const { setData, selectedDatabase } = useAppContext();
  const { data: drivers, isPending, isError, error } = useMeta('meta/jdbcDrivers', undefined);

  if (!databaseConfig) {
    return <PanelMessage message={t('detail.noSelection')} />;
  }

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
        <Spinner className='database-editor-detail-spinner' />
      </Flex>
    );
  }

  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('common.message.errorOccured', { message: error.message })} />;
  }

  const updateDatabaseConfig = (propertyUpdater: (database: DatabaseConfigurationData) => void) => {
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

  const selectedDriver = drivers.find(driver => driver.name === databaseConfig.driver) ?? {
    name: 'unkown',
    databaseProduct: 'unkown',
    properties: {}
  };

  return (
    <DetailProvider value={{ databaseConfig, updateDatabaseConfig, drivers, selectedDriver }}>
      <Flex direction='column' gap={3} className='database-editor-detail-content' key={databaseConfig.name}>
        <GeneralCollapsible />
        <PropertyCollapsible />
        <AdditionalCollapsible />
      </Flex>
    </DetailProvider>
  );
};
