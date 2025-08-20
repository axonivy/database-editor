import type { DatabaseEditorContext, DatabaseTable } from '@axonivy/database-editor-protocol';
import { BasicDialogHeader, Button, Dialog, DialogContent, DialogTrigger, Flex, IvyIcon, toast } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import './ImportWizard.css';
import { CreationPage, type CreationParameter } from './pages/CreationPage';
import { DataSourcePage } from './pages/DataSourcePage';
import { SelectTablesPage } from './pages/TableSelectionPage';
import { Timeline } from './Timeline';

export type ImportPage = {
  page: ReactNode;
  title: string;
  requiredData: boolean;
};

export const ImportWizard = ({ context }: { context: DatabaseEditorContext }) => {
  const { t } = useTranslation();
  const [selectedDatabase, setSelectedDatabase] = useState<string>();
  const [selectedTables, setSelectedTables] = useState<Array<DatabaseTable>>([]);
  const [creationParams, setCreationParams] = useState<Array<CreationParameter>>([]);
  const [activePage, setActivePage] = useState(0);

  const resetAll = () => {
    setActivePage(0);
    setSelectedDatabase('');
    setSelectedTables([]);
    setCreationParams([]);
  };

  const updateSelectedDatabase = (db: string) => {
    setSelectedDatabase(db);
    setSelectedTables([]);
    setCreationParams([]);
  };

  const updateSelectedTables = (table: DatabaseTable, add: boolean) => {
    if (add) {
      setSelectedTables([...selectedTables, table].sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      setSelectedTables(selectedTables.filter(t => t.name !== table.name));
      setCreationParams(creationParams.filter(p => p.tableName !== table.name));
    }
  };

  const updateParameter = (table: string, key: Exclude<keyof CreationParameter, 'tableName'>, value: boolean) => {
    const param = creationParams.find(p => p.tableName === table) ?? { tableName: table };
    param[key] = value;
    const obsolete = Object.keys(param).filter(k => param[k as keyof CreationParameter]).length <= 1;
    setCreationParams([...creationParams.filter(p => p.tableName !== table), ...(obsolete ? [] : [param])]);
  };

  const updateActivePage = (forward: boolean = true) => {
    if (forward) {
      if (activePage < pages.length - 1) {
        setActivePage(activePage + 1);
      }
    } else {
      if (activePage > 0) {
        setActivePage(activePage - 1);
      }
    }
  };

  const jumpToPage = (index: number) => {
    if (index < activePage) {
      setActivePage(index);
    } else {
      let valid = true;
      pages.forEach((p, i) => {
        if (i >= index) return;
        if (!p.requiredData) valid = false;
      });
      if (valid) {
        setActivePage(index);
      }
    }
  };

  const pages: Array<ImportPage> = [
    {
      page: <DataSourcePage context={context} updateSelection={updateSelectedDatabase} selection={selectedDatabase} />,
      title: t('import.source'),
      requiredData: selectedDatabase != null && selectedDatabase != ''
    },
    {
      page: (
        <SelectTablesPage
          selectedDatabase={selectedDatabase ?? ''}
          context={context}
          updateSelection={updateSelectedTables}
          selectedTables={selectedTables}
        />
      ),
      title: t('import.selectTable'),
      requiredData: selectedTables.length > 0
    },
    {
      page: <CreationPage tables={selectedTables} updateSelection={updateParameter} parameters={creationParams} />,
      title: t('import.createOptions'),
      requiredData: creationParams.length >= selectedTables.length
    }
  ];

  return (
    <Dialog modal onOpenChange={resetAll}>
      <DialogTrigger asChild>
        <Button variant='outline'>{t('import.importWizard')}</Button>
      </DialogTrigger>
      <DialogContent className='import-dialog'>
        <BasicDialogHeader title={t('import.dataImport')} description={''} />
        <Flex className='import-dialog-content' direction='column' justifyContent='space-between'>
          <Timeline pages={pages} active={activePage} setActive={jumpToPage} />
          {pages[activePage].page}
          <Flex direction='row' justifyContent='flex-end' gap={1}>
            <Button
              disabled={activePage <= 0}
              variant='outline'
              className='import-button-back'
              size='xl'
              onClick={() => updateActivePage(false)}
            >
              {t('import.back')}
            </Button>
            {activePage !== pages.length - 1 ? (
              <Button disabled={!pages[activePage].requiredData} variant='primary' size='xl' onClick={() => updateActivePage()}>
                {t('import.next')}
                <IvyIcon icon={IvyIcons.Chevron} />
              </Button>
            ) : (
              <Button disabled={!pages[activePage].requiredData} variant='primary' size='xl' onClick={notImplemented}>
                {t('import.create')}
              </Button>
            )}
          </Flex>
        </Flex>
      </DialogContent>
    </Dialog>
  );
};

export const notImplemented = () => toast.info('not yet implemented');
