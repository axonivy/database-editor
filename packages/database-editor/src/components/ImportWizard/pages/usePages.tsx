import {
  type CreationError,
  type DatabaseEditorContext,
  type DatabaseTable,
  type ImportWizardContext
} from '@axonivy/database-editor-protocol';
import { toast } from '@axonivy/ui-components';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClient } from '../../../protocol/ClientContextProvider';
import { genQueryKey } from '../../../query/query-client';
import { type ImportPage } from '../WizardContent';
import { CreationPage } from './CreationPage';
import { CreationResult } from './CreationResult';
import { DataSourcePage } from './DataSourcePage';
import { SelectTablesPage } from './TableSelectionPage';
import { useCreationTables } from './useCreationTables';

export const usePages = (importContext: ImportWizardContext, setOpen: (forward: boolean) => void, creationCallback?: () => void) => {
  const { t } = useTranslation();
  const [selectedDatabase, setSelectedDatabase] = useState<string>();
  const [selectedTables, setSelectedTables] = useState<Array<DatabaseTable>>([]);
  const [namespace, setNamespace] = useState<string>('');
  const [activePage, setActivePage] = useState(0);
  const [creationErrors, setCreationErrors] = useState<Array<CreationError>>([]);
  const { tablesToCreate, setTablesToCreate, updateTablesToCreate, creationProps } = useCreationTables(namespace);
  const client = useClient();
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
    setTablesToCreate(new Map());
  };

  const updateSelectedTables = (table: DatabaseTable, add: boolean) => {
    if (add) {
      setSelectedTables([...selectedTables, table].sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      setSelectedTables(selectedTables.filter(t => t.name !== table.name));
      setTablesToCreate(prev => {
        const update = new Map(prev);
        update.delete(table.name);
        return update;
      });
    }
  };

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
          updateSelection={updateTablesToCreate}
          parameters={tablesToCreate}
          namespace={namespace}
          updateNamespace={setNamespace}
        />
      ),
      title: t('import.createOptions'),
      requiredData: tablesToCreate.size > 0 && namespace !== undefined && namespace.trim() !== ''
    },
    {
      page: <CreationResult errors={creationErrors} />,
      title: t('import.creationResult'),
      requiredData: true
    }
  ];

  return { pages, activePage, jumpToPage, updateActivePage, creationFunction };
};
