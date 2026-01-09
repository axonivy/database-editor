import { BasicField, Field, Flex, Label, Switch } from '@axonivy/ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMeta } from '../../../protocol/use-meta';
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
  const [showAll, setShowAll] = useState(false);
  const databaseQuery = useMeta('meta/allDatabaseNames', context);

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
