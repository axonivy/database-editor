import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import {
  Button,
  Flex,
  PanelMessage,
  SidebarHeader,
  Spinner,
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
import { useMeta } from '../../../protocol/use-meta';
import { useAction } from '../../../protocol/useAction';
import { useKnownHotkeys } from '../../../util/hotkeys';
import { AdditionalCollapsible } from './AdditionalPropertyCollapsible';
import './DatabaseDetail.css';
import { DetailProvider } from './DetailContext';
import { GeneralCollapsible } from './GeneralCollapsible';
import { PropertyCollapsible } from './PropertyCollapsible';

export const DatabaseDetail = () => {
  const { t } = useTranslation();
  const { databaseConfigs, selectedDatabase, helpUrl } = useAppContext();

  const hotkeys = useKnownHotkeys();
  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusInscription.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });

  const databaseConfig = selectedDatabase !== undefined ? databaseConfigs[selectedDatabase] : undefined;
  let title = t('database.connectionProperties');
  if (databaseConfig) {
    title = `${title} - ${databaseConfig.name}`;
  }

  const openUrl = useAction('openUrl');
  const { openHelp: helpText } = useKnownHotkeys();

  return (
    <Flex direction='column' className='database-editor-panel-content'>
      <SidebarHeader title={title} icon={IvyIcons.PenEdit} className='database-editor-detail-toolbar' tabIndex={-1} ref={firstElement}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button icon={IvyIcons.Help} onClick={() => openUrl(helpUrl)} aria-label={helpText.label} />
            </TooltipTrigger>
            <TooltipContent>{helpText.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarHeader>
      <DatabaseDetailContent databaseConfig={databaseConfig} />
    </Flex>
  );
};

const DatabaseDetailContent = ({ databaseConfig }: { databaseConfig?: DatabaseConfigurationData }) => {
  const { t } = useTranslation();
  const { setData, context, selectedDatabase, databaseConfigs, removeConnectionTestResult } = useAppContext();
  const { data: drivers, isPending, isError, error } = useMeta('meta/jdbcDrivers', context);

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
    removeConnectionTestResult(databaseConfigs[selectedDatabase]?.name ?? '');
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
    name: 'Other',
    databaseProduct: 'Other',
    properties: Object.fromEntries(Object.entries(databaseConfig.properties).map(([key]) => [key, 'string']))
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
