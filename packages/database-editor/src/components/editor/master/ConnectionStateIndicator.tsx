import type { ConnectionTestData } from '@axonivy/database-editor-protocol';
import { Badge, Flex, IvyIcon, Separator, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

export const ConnectionStateIndicator = ({ state, exception, advise }: ConnectionTestData) => {
  const { t } = useTranslation();

  const stateTranslation = useMemo<Record<string, string>>(
    () => ({
      CONNECTED: t('database.state.connected'),
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
      <Badge size='s' variant='secondary' className='size-5'>
        <IvyIcon icon={IvyIcons.Spinner} spin />
      </Badge>
    );
  }

  const variant: ComponentProps<typeof Badge>['variant'] = state === 'CONNECTED' ? 'green' : state === 'UNKNOWN' ? 'secondary' : 'red';
  const trimmedException = exception?.trim();
  const indicator =
    variant === 'green' ? <IvyIcon icon={IvyIcons.Check} /> : variant === 'secondary' ? '?' : <IvyIcon icon={IvyIcons.Close} />;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge size='s' variant={variant} className='size-5'>
            {indicator}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {variant === 'red' ? (
            <Flex direction='column'>
              <span className='font-bold'>{stateTranslation[state]}</span>
              {trimmedException && <span style={{ whiteSpace: 'pre-line' }}>{trimmedException}</span>}
              {advise && (
                <>
                  <Separator orientation='horizontal' className='m-0!' />
                  <span>{t('database.connection.advice')}</span>
                  <span>{advise}</span>
                </>
              )}
            </Flex>
          ) : (
            <span className='font-bold'>{stateTranslation[state]}</span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
