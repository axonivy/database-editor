import { type CreationError } from '@axonivy/database-editor-protocol';
import { toast } from '@axonivy/ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFunction } from '../../../protocol/useFunction';
import { useContextProvider } from '../../../util/ContextProvider';
import { type ImportPage } from '../WizardContent';
import { CreationPage } from './CreationPage';
import { CreationResult } from './CreationResult';
import { DataSourcePage } from './DataSourcePage';
import { SelectTablesPage } from './TableSelectionPage';
import { useCreationTables } from './useCreationTables';

export const usePages = (projects: Array<string>, closeDialog: () => void, creationCallback?: () => void) => {
  const { t } = useTranslation();
  const { context } = useContextProvider();

  const [selectedDatabase, setSelectedDatabase] = useState<string>();
  const [selectedTables, setSelectedTables] = useState<Array<string>>([]);
  const [activePage, setActivePage] = useState(0);
  const [creationErrors, setCreationErrors] = useState<Array<CreationError>>([]);
  const [namespace, setNamespace] = useState<string>(context.project.replaceAll('-', '.'));
  const { tablesToCreate, setTablesToCreate, updateTablesToCreate, creationProps } = useCreationTables(namespace);

  const resetAll = () => {
    setSelectedDatabase('');
    setSelectedTables([]);
    setTablesToCreate(new Map());
  };

  const resetOnProjectChange = (project: string) => {
    setNamespace(project.replaceAll('-', '.'));
    resetAll();
  };

  const updateSelectedDatabase = (db: string) => {
    resetAll();
    setSelectedDatabase(db);
  };

  const updateActivePage = (forward: boolean = true) => {
    if (forward && activePage < pages.length - 1) {
      setActivePage(activePage + 1);
    } else if (forward) {
      closeDialog();
    }
    if (!forward && activePage > 0) {
      setActivePage(activePage - 1);
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

  const creationFunction = useFunction(
    'function/importFromDatabase',
    {
      context: context,
      options: creationProps(selectedDatabase ?? '')
    },
    {
      onSuccess: data => {
        setCreationErrors(data);
        if (creationCallback) creationCallback();
      },
      onError: error => toast.error(t('import.creationFailed'), { description: error.message })
    }
  );

  const pages: Array<ImportPage> = [
    {
      page: (
        <DataSourcePage
          updateSelection={updateSelectedDatabase}
          selection={selectedDatabase}
          projects={projects.length > 1 ? projects : undefined}
          projectUpdateCallback={resetOnProjectChange}
        />
      ),
      title: t('import.source'),
      identifier: 'data-source',
      requiredData: selectedDatabase != null && selectedDatabase != ''
    },
    {
      page: (
        <SelectTablesPage selectedDatabase={selectedDatabase ?? ''} setSelectedTables={setSelectedTables} selectedTables={selectedTables} />
      ),
      title: t('import.selectTable'),
      identifier: 'table-selection',
      requiredData: selectedTables.length > 0
    },
    {
      page: (
        <CreationPage
          tableNames={selectedTables}
          databaseName={selectedDatabase ?? ''}
          updateSelection={updateTablesToCreate}
          parameters={tablesToCreate}
          namespace={namespace}
          updateNamespace={setNamespace}
        />
      ),
      title: t('import.options'),
      identifier: 'creation',
      requiredData: tablesToCreate.size > 0 && namespace !== undefined && namespace.trim() !== ''
    },
    {
      page: <CreationResult errors={creationErrors} />,
      title: t('import.result'),
      identifier: 'creation-result',
      requiredData: true
    }
  ];

  return { pages, activePage, jumpToPage, updateActivePage, creationFunction };
};
