import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import {
  BasicField,
  BasicInput,
  BasicSelect,
  Button,
  Flex,
  PanelMessage,
  SidebarHeader,
  Spinner,
  Textarea,
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
import { persistenceUnits, type PersistenceUnit } from '../master/DatabaseMasterContent';
import { AdditionalCollapsible } from './AdditionalPropertyCollapsible';
import './DatabaseDetail.css';
import { DetailProvider } from './DetailContext';
import { GeneralCollapsible } from './GeneralCollapsible';
import { PropertyCollapsible } from './PropertyCollapsible';

export const DatabaseDetail = () => {
  const { t } = useTranslation();
  const { databaseConfigs, selectedDatabase, selectedPersistenceUnit, helpUrl } = useAppContext();

  const hotkeys = useKnownHotkeys();
  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusInscription.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });

  const databaseConfig = selectedDatabase !== undefined ? databaseConfigs[selectedDatabase] : undefined;
  let title = t('database.connectionProperties');
  if (databaseConfig) {
    title = `${title} - ${databaseConfig.name}`;
  }

  let persistenceUnit: PersistenceUnit | undefined;
  if (selectedPersistenceUnit) {
    const [db, pu] = selectedPersistenceUnit.split('.').map(part => Number(part));
    if (db != undefined && pu != undefined) {
      persistenceUnit = persistenceUnits.get(databaseConfigs[db]?.name ?? '')?.[pu];
      title = `Persistence Unit - ${persistenceUnit?.name ?? ''}`;
    }
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
      <DatabaseDetailContent databaseConfig={databaseConfig} persistenceUnit={persistenceUnit} />
    </Flex>
  );
};

const DatabaseDetailContent = ({
  databaseConfig,
  persistenceUnit
}: {
  databaseConfig?: DatabaseConfigurationData;
  persistenceUnit?: PersistenceUnit;
}) => {
  const { t } = useTranslation();
  const { setData, context, selectedDatabase, databaseConfigs, removeConnectionTestResult } = useAppContext();
  const { data: drivers, isPending, isError, error } = useMeta('meta/jdbcDrivers', context);

  if (!databaseConfig && !persistenceUnit) {
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

  if (databaseConfig) {
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
  }

  if (persistenceUnit) {
    return (
      <Flex direction='column' gap={4} className='database-editor-detail-content' key={persistenceUnit?.name}>
        <BasicField label='Data Source'>
          <BasicSelect
            value={persistenceUnit.dataSource}
            items={databaseConfigs.map(config => ({ label: config.name, value: config.name }))}
          />
        </BasicField>
        <BasicField label='Description'>
          <BasicInput value={persistenceUnit.description} />
        </BasicField>
        <BasicField label='Managed Classes'>
          <Textarea value={persistenceUnit.managedClasses.join('\n')} />
        </BasicField>
        <BasicField label='Properties'>
          <Textarea
            value={Array.from(persistenceUnit.properties.entries())
              .map(([key, value]) => `${key}=${value}`)
              .join('\n')}
          />
        </BasicField>
        <Button size='large' variant='primary-outline'>
          Generate Schema
        </Button>
      </Flex>
    );
  }
};
