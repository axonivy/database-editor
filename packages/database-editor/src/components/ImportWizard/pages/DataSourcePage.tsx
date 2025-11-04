import type { DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { BasicField, Flex } from '@axonivy/ui-components';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useClient } from '../../../protocol/ClientContextProvider';
import { genQueryKey } from '../../../query/query-client';
import { DatabaseSelection } from '../components/DatabaseSelection';
import { ProjectSelection } from '../components/ProjectSelection';

export type DataSourcePageProps = {
  context: DatabaseEditorContext;
  selection?: string;
  updateSelection: (value: string) => void;
  projects?: Array<string>;
  updatePmv: (pmv: string) => void;
};

export const DataSourcePage = ({ context, selection, updateSelection, projects, updatePmv }: DataSourcePageProps) => {
  const { t } = useTranslation();
  const client = useClient();

  const databaseQuery = useQuery({
    queryKey: useMemo(() => genQueryKey('data', context), [context]),
    queryFn: async () => {
      const content = await client.data(context);
      return { ...content };
    },
    structuralSharing: false
  });

  return (
    <>
      {projects && (
        <BasicField label={t('import.project')}>
          <ProjectSelection projects={projects} updateSelection={updatePmv} selection={context.pmv} />
        </BasicField>
      )}
      <BasicField label={t('import.database')}>
        <Flex gap={2}>
          <DatabaseSelection
            databases={(databaseQuery.data?.databaseNames as Array<string>) ?? []}
            selection={selection}
            updateSelection={updateSelection}
            disabled={context.pmv === ''}
          />
        </Flex>
      </BasicField>
    </>
  );
};
