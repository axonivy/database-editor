import type { DatabaseConfigurationData, Severity, ValidationResult } from '@axonivy/database-editor-protocol';
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
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { useMeta } from '../../../protocol/use-meta';
import { useAction } from '../../../protocol/useAction';
import { useKnownHotkeys } from '../../../util/hotkeys';
import { AdditionalCollapsible } from './AdditionalPropertyCollapsible';
import { DetailProvider } from './DetailContext';
import { GeneralCollapsible } from './GeneralCollapsible';
import { PropertyCollapsible } from './PropertyCollapsible';

export const DatabaseDetail = ({ ref }: { ref: React.Ref<HTMLDivElement> }) => {
  const { t } = useTranslation();
  const { databaseConfigs, selectedDatabase, helpUrl } = useAppContext();

  const databaseConfig = selectedDatabase !== undefined ? databaseConfigs[selectedDatabase] : undefined;
  let title = t('database.connectionProperties');
  if (databaseConfig) {
    title = `${title} - ${databaseConfig.name}`;
  }

  const openUrl = useAction('openUrl');
  const { openHelp: helpText } = useKnownHotkeys();

  return (
    <Flex direction='column' className='h-full'>
      <SidebarHeader title={title} icon={IvyIcons.PenEdit} tabIndex={-1} ref={ref}>
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
        <Spinner />
      </Flex>
    );
  }

  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('common.message.errorOccured', { message: error.message })} />;
  }

  const updateDatabaseConfig = (propertyUpdater: (database: DatabaseConfigurationData) => void) => {
    if (selectedDatabase === undefined) return;
    removeConnectionTestResult(databaseConfigs[selectedDatabase]?.key ?? '');
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
      <Flex direction='column' gap={3} className='min-h-0 overflow-auto p-3' key={databaseConfig.key}>
        <GeneralCollapsible />
        <PropertyCollapsible />
        <AdditionalCollapsible />
      </Flex>
    </DetailProvider>
  );
};

export const fieldMessage = (
  validations: Array<ValidationResult>,
  database: DatabaseConfigurationData,
  field: keyof DatabaseConfigurationData
) =>
  validations
    .filter(v => v.path.toLowerCase() === `${database.key}.${field}`.toLowerCase())
    .map<MessageData>(v => ({
      message: v.message,
      variant: v.severity.toLowerCase() as Lowercase<Severity>
    }))[0];
