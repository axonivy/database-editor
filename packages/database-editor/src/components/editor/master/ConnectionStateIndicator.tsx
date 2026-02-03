import type { ConnectionTestData, MapStringString } from '@axonivy/database-editor-protocol';
import { cn, Flex, IvyIcon, Spinner, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import './ConnectionStateIndicator.css';

export const ConnectionStateIndicator = ({ state, exception, advise }: ConnectionTestData) => {
  const { t } = useTranslation();

  const stateTranslation: MapStringString = useMemo(
    () => ({
      CONNECTED: t('database.state.connected'),
      CONNECTED_VERSION_NOT_SUPPORTED: t('database.state.versionUnsupported'),
      CONNECTED_VERSION_TOO_OLD: t('database.state.versionTooOld'),
      CONNECTED_VERSION_TOO_NEW: t('database.state.versionTooNew'),
      CONNECTED_NO_DATABASE: t('database.state.noDatabase'),
      CONNECTED_NO_TABLES: t('database.state.noTables'),
      CONNECTION_FAILED: t('database.state.failed'),
      CONNECTION_FAILED_WRONG_CONFIG: t('database.state.wrongConfig'),
      CONNECTION_FAILED_WRONG_HOST: t('database.state.wrongHost'),
      CONNECTION_FAILED_WRONG_LOGIN: t('database.state.wrongLogin'),
      CONNECTION_FAILED_WRONG_PASSWORD: t('database.state.wrongPassword'),
      UNKNOWN: t('database.state.unknown')
    }),
    [t]
  );

  if (state === 'PENDING') {
    return (
      <div className='database-editor-connection-state-indicator-background'>
        <div className={cn('database-editor-connection-state-indicator', 'unknown')}>
          <Spinner size='small' />
        </div>
      </div>
    );
  }

  const variant = state.startsWith('CONNECTED') ? 'working' : state === 'UNKNOWN' ? 'unknown' : 'error';
  const trimmedException = exception?.trim();
  const indicator =
    variant === 'working' ? <IvyIcon icon={IvyIcons.Check} /> : variant === 'unknown' ? '?' : <IvyIcon icon={IvyIcons.Plus} rotate={45} />;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='database-editor-connection-state-indicator-background'>
            <div className={cn('database-editor-connection-state-indicator', variant)}>{indicator}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent className='database-editor-connection-tooltip-content'>
          {variant === 'error' ? (
            <Flex direction='column'>
              <span className='database-editor-state-title'>{stateTranslation[state]}</span>
              {trimmedException && <span style={{ whiteSpace: 'pre-line' }}>{trimmedException}</span>}
              {advise && (
                <>
                  <hr className='database-editor-state-separator' />
                  <span>{t('database.connection.advice')}</span>
                  <span>{advise}</span>
                </>
              )}
            </Flex>
          ) : (
            <span className='database-editor-state-title'>{stateTranslation[variant === 'working' ? 'CONNECTED' : 'UNKNOWN']}</span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
