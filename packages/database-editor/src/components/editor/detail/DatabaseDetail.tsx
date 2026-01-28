import type { DatabaseConfigurationData } from '@axonivy/database-editor-protocol';
import {
  BasicField,
  BasicInput,
  BasicInscriptionTabs,
  BasicSelect,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  PanelMessage,
  SidebarHeader,
  Spinner,
  TableAddRow,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef, useState } from 'react';
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

  const [value, setValue] = useState('DatabaseConnection');
  const [persistenceUnits, setPersistenceUnits] = useState(persistenceUnitsData);

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
    <BasicInscriptionTabs
      key={databaseConfig.name}
      value={value}
      onChange={setValue}
      tabs={[
        {
          icon: IvyIcons.Database,
          id: 'DatabaseConnection',
          name: 'Database Connection',
          content: (
            <DetailProvider value={{ databaseConfig, updateDatabaseConfig, drivers, selectedDriver }}>
              <Flex direction='column' gap={3} className='database-editor-detail-content'>
                <GeneralCollapsible />
                <PropertyCollapsible />
                <AdditionalCollapsible />
              </Flex>
            </DetailProvider>
          )
        },
        {
          icon: IvyIcons.Persistence,
          id: 'PersistenceUnits',
          name: 'Persistence Units',
          content: (
            <Flex direction='column' gap={3} className='database-editor-detail-content'>
              {persistenceUnits.get(databaseConfig.name)?.map(persistenceUnit => (
                <Collapsible key={persistenceUnit.name} defaultOpen={true}>
                  <CollapsibleTrigger
                    control={() => (
                      <Button
                        icon={IvyIcons.Trash}
                        aria-label='Delete Persistence Unit'
                        onClick={() =>
                          setPersistenceUnits(prev => {
                            const newUnits = structuredClone(prev);
                            newUnits.set(
                              databaseConfig.name,
                              newUnits.get(databaseConfig.name)?.filter(unit => unit.name !== persistenceUnit.name) ?? []
                            );
                            return newUnits;
                          })
                        }
                      />
                    )}
                  >
                    {persistenceUnit.name}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Flex direction='column' gap={4}>
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
                  </CollapsibleContent>
                </Collapsible>
              ))}
              <TableAddRow
                addRow={() =>
                  setPersistenceUnits(prev => {
                    const newUnits = structuredClone(prev);
                    newUnits.set(databaseConfig.name, [
                      ...(newUnits.get(databaseConfig.name) ?? []),
                      {
                        name: 'NewPersistenceUnit',
                        dataSource: databaseConfig.name,
                        description: '',
                        managedClasses: [],
                        properties: new Map()
                      }
                    ]);
                    return newUnits;
                  })
                }
              />
            </Flex>
          )
        }
      ]}
    />
  );
};

type PersistenceUnit = {
  name: string;
  dataSource: string;
  description: string;
  managedClasses: Array<string>;
  properties: Map<string, string>;
};

export const persistenceUnitsData = new Map<string, Array<PersistenceUnit>>([
  ['database0', []],
  [
    'database1',
    [
      {
        name: 'persistenceUnit10',
        dataSource: 'database1',
        description: '',
        managedClasses: ['ch.ivyteam.Entity100', 'ch.ivyteam.Entity101'],
        properties: new Map([
          ['property100', 'value100'],
          ['property101', 'value101']
        ])
      },
      {
        name: 'persistenceUnit11',
        dataSource: 'database1',
        description: '',
        managedClasses: ['ch.ivyteam.Entity110'],
        properties: new Map()
      }
    ]
  ],
  ['database2', [{ name: 'persistenceUnit20', dataSource: 'database2', description: '', managedClasses: [], properties: new Map() }]],
  ['database3', []]
]);
