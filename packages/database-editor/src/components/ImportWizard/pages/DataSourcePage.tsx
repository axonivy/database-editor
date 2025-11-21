import { BasicField, Field, Flex, Label, Switch } from '@axonivy/ui-components';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClient } from '../../../protocol/ClientContextProvider';
import { genQueryKey } from '../../../query/query-client';
import { useContextProvider } from '../../../util/ContextProvider';
import { DatabaseSelection } from '../components/DatabaseSelection';
import { ProjectSelection } from '../components/ProjectSelection';
import './DataSourcePage.css';

export type DataSourcePageProps = {
  selection?: string;
  updateSelection: (value: string) => void;
  projects?: Array<string>;
  pmvUpdateCallback: (value: string) => void;
};

export const DataSourcePage = ({ selection, updateSelection, projects, pmvUpdateCallback }: DataSourcePageProps) => {
  const { context, updatePmv } = useContextProvider();
  const { t } = useTranslation();
  const client = useClient();
  const [showAll, setShowAll] = useState(false);

  const databaseQuery = useQuery({
    queryKey: useMemo(() => genQueryKey('data', context), [context]),
    queryFn: async () => {
      const content = await client.data(context);
      return { ...content };
    },
    structuralSharing: false
  });

  const requiredProjectToggle = (
    <Field direction='row' alignItems='center' gap={2}>
      <Label>{t('import.requiredProjects')}</Label>
      <Switch checked={showAll} onCheckedChange={() => setShowAll(p => !p)} />
    </Field>
  );

  return (
    <Flex direction='column' gap={4} className='import-wizard-page'>
      {projects && (
        <BasicField label={t('import.project')} className='source-selection-field'>
          <ProjectSelection projects={projects} updateSelection={value => updatePmv(value, pmvUpdateCallback)} />
        </BasicField>
      )}
      <BasicField label={t('import.database')} className='source-selection-field' control={requiredProjectToggle}>
        <DatabaseSelection
          databases={databaseQuery.data?.databaseNames ?? {}}
          selection={selection}
          updateSelection={updateSelection}
          showAll={showAll}
          disabled={context.pmv === ''}
        />
      </BasicField>
    </Flex>
  );
};
