import type { MapStringConnectionTestData } from '@axonivy/database-editor-protocol';
import { Flex } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';

export const ConnectionTestResultMessage = ({ result }: { result: MapStringConnectionTestData }) => {
  const { t } = useTranslation();
  const connections = Object.keys(result);
  return (
    <Flex direction='column' className='database-test-toast'>
      <span style={{ fontWeight: 'bold' }}>{t('database.connectionTest.message')}</span>
      {connections.length === 1 ? (
        <>
          <span>{t('database.connectionTest.testedFor')}</span>
          <span>{connections[0]}</span>
        </>
      ) : (
        <span>{t('database.connectionTest.allConnections')}</span>
      )}
    </Flex>
  );
};
