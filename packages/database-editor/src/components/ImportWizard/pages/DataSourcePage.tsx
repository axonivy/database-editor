import type { DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import { BasicField, Button, Flex, ToggleGroup, ToggleGroupItem } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClient } from '../../../protocol/ClientContextProvider';
import { genQueryKey } from '../../../query/query-client';
import { DatabaseSelection } from '../DatabaseSelection';
import { notImplemented } from '../ImportWizard';
import './DataSourcePage.css';

export type DataSourcePageProps = {
  context: DatabaseEditorContext;
  selection?: string;
  updateSelection: (value: string) => void;
};

export const DataSourcePage = ({ context, selection, updateSelection }: DataSourcePageProps) => {
  const { t } = useTranslation();
  const [sourceType, setSourceType] = useState('database');
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
    <Flex className='import-page data-source-page' direction='column'>
      <SourceTypeToggle sourceType={sourceType} setSourceType={setSourceType} />
      <BasicField label={t('import.database')}>
        <Flex gap={2}>
          <DatabaseSelection
            databases={(databaseQuery.data?.databaseNames as Array<string>) ?? []}
            selection={selection}
            updateSelection={updateSelection}
          />
          <Button variant='outline' icon={IvyIcons.Plus} onClick={notImplemented}>
            {t('import.add')}
          </Button>
        </Flex>
      </BasicField>
    </Flex>
  );
};

const SourceTypeToggle = ({ sourceType, setSourceType }: { sourceType: string; setSourceType: (type: string) => void }) => {
  const { t } = useTranslation();
  return (
    <ToggleGroup
      className='source-group'
      type='single'
      value={sourceType}
      onValueChange={value => {
        setSourceType(value);
        notImplemented();
      }}
    >
      <ToggleGroupItem asChild value='database'>
        <Button className='source-button' variant='primary'>
          {t('import.database')}
        </Button>
      </ToggleGroupItem>
      <ToggleGroupItem asChild value='csv'>
        <Button className='source-button' variant='primary'>
          {t('import.csv')}
        </Button>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
