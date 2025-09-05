import {
  type CreationError,
  type DatabaseEditorContext,
  type DatabaseTable,
  type ImportOptions,
  type ImportWizardContext,
  type TableOptions
} from '@axonivy/database-editor-protocol';
import { toast } from '@axonivy/ui-components';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClient } from '../../../protocol/ClientContextProvider';
import { genQueryKey } from '../../../query/query-client';
import { type ImportPage } from '../WizardContent';
import { CreationPage, type CreationParameter } from './CreationPage';
import { CreationResult } from './CreationResult';
import { DataSourcePage } from './DataSourcePage';
import { SelectTablesPage } from './TableSelectionPage';

export const usePages = (importContext: ImportWizardContext, setOpen: (forward: boolean) => void, creationCallback?: () => void) => {
  const { t } = useTranslation();
  const [selectedDatabase, setSelectedDatabase] = useState<string>();
  const [selectedTables, setSelectedTables] = useState<Array<DatabaseTable>>([]);
  const [creationParams, setCreationParams] = useState<Array<CreationParameter>>([]);
  const [namespace, setNamespace] = useState<string>('');
  const [activePage, setActivePage] = useState(0);
  const [creationErrors, setCreationErrors] = useState<Array<CreationError>>([]);
  const [context, setContext] = useState<DatabaseEditorContext>({
    app: importContext.app,
    file: importContext.file,
    pmv: importContext.projects.length === 1 ? (importContext.projects[0] as string) : ''
  });

  const updatePmv = (pmv: string) => {
    setContext({
      app: context.app,
      file: context.file,
      pmv: pmv
    });
  };

  const updateActivePage = (forward: boolean = true) => {
    if (forward && activePage < pages.length - 1) {
      setActivePage(activePage + 1);
    } else if (forward) {
      setOpen(false);
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

  const updateParameter = (table: string, key: ImportOptions, value: boolean) => {
    const param = creationParams.find(p => p.tableName === table) ?? { tableName: table };
    param[key] = value;
    const obsolete = Object.keys(param).filter(k => param[k as keyof CreationParameter]).length <= 1;
    setCreationParams([...creationParams.filter(p => p.tableName !== table), ...(obsolete ? [] : [param])]);
  };

  const creationProps = (): Array<TableOptions> => {
    const tableOptions: Array<TableOptions> = [];
    creationParams.forEach(c => {
      const name = namespace + '.' + c.tableName;
      Object.keys(c).forEach(key => {
        if (c[key as keyof typeof c]) {
          if (key === 'tableName') return;
          tableOptions.push({
            name: name,
            type: key as ImportOptions,
            attributes: selectedTables.find(t => t.name === c.tableName)?.columns ?? []
          });
        }
      });
    });
    return tableOptions;
  };

  const client = useClient();
  const creationFunction = useMutation({
    mutationKey: genQueryKey('importFromDatabase', {
      context: context,
      options: creationProps()
    }),
    mutationFn: () =>
      client.importFromDatabase({
        context: context,
        options: creationProps()
      }),
    onSuccess: data => {
      setCreationErrors(data);
      if (creationCallback) creationCallback();
    },
    onError: error => toast.error(t('import.creationFailed'), { description: error.message })
  });

  const pages: Array<ImportPage> = [
    {
      page: (
        <DataSourcePage
          context={context}
          updateSelection={updateSelectedDatabase}
          selection={selectedDatabase}
          projects={importContext.projects.length > 1 ? importContext.projects : undefined}
          updatePmv={updatePmv}
        />
      ),
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
      page: (
        <CreationPage
          tables={selectedTables}
          updateSelection={updateParameter}
          parameters={creationParams}
          namespace={namespace}
          updateNamespace={setNamespace}
        />
      ),
      title: t('import.createOptions'),
      requiredData: creationParams.length >= selectedTables.length && namespace !== undefined && namespace.trim() !== ''
    },
    {
      page: <CreationResult errors={creationErrors} />,
      title: t('import.creationResult'),
      requiredData: true
    }
  ];

  return { pages, activePage, jumpToPage, updateActivePage, creationFunction };
};
