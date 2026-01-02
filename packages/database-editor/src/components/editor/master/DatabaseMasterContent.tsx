import type { DatabaseConnectionData } from '@axonivy/database-editor-protocol';
import { Flex } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../AppContext';
import { SelectionListField } from '../../ImportWizard/components/SelectionList';
import { useDatabaseMutation } from '../useDatabaseMutation';

export const DatabaseMasterContext = ({
  setDetail
}: {
  activeConnection?: DatabaseConnectionData;
  setDetail: (state: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { setActiveDb, context } = useAppContext();
  const { databaseQuery } = useDatabaseMutation(context);

  return (
    <Flex direction='row' gap={4} style={{ padding: '50px', height: '90%' }}>
      <SelectionListField
        selectionTitle={t('database.databases')}
        items={databaseQuery.data?.map(d => d.name) ?? []}
        onClick={value => {
          const db = databaseQuery.data?.filter(d => d.name === value)[0];
          if (db) {
            setActiveDb(db);
            setDetail(true);
          }
        }}
        control={undefined}
      />
    </Flex>
  );
};
