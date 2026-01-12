import type { Client, DatabaseConfigurationData, DatabaseConfigurations, DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import type { Unary } from '@axonivy/ui-components';
import type { RenderHookOptions } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import i18n from 'i18next';
import type { ReactNode } from 'react';
import { initReactI18next } from 'react-i18next';
import { AppProvider } from '../../AppContext';
import { ClientContextProvider } from '../../protocol/ClientContextProvider';
import { initQueryClient } from '../../query/query-client';
import { QueryProvider } from '../../query/QueryProvider';
import enTrans from '../../translation/database-editor/en.json';

type ContextHelperProps = {
  client?: Partial<Client>;
  appContext?: {
    context?: DatabaseEditorContext;
    selectedDatabase?: number;
    setSelectedDatabase?: (index?: number) => void;
    projects?: Array<string>;
    databaseConfigs?: Array<DatabaseConfigurationData>;
    setData?: (data: Unary<DatabaseConfigurations>) => void;
  };
};

const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['database-editor'],
    defaultNS: 'database-editor',
    resources: { en: { 'database-editor': enTrans } }
  });
};

const ContextHelper = (props: ContextHelperProps & { children: ReactNode }) => {
  const client = (props.client ?? new EmptyClient()) as Client;
  initTranslation();

  const appContext = {
    context: props.appContext?.context ?? { app: '', pmv: '', file: '' },
    selectedDatabase: props.appContext?.selectedDatabase,
    setSelectedDatabase: props.appContext?.setSelectedDatabase ?? (() => {}),
    projects: props.appContext?.projects ?? [],
    databaseConfigs: props.appContext?.databaseConfigs ?? [],
    setData: props.appContext?.setData ?? (() => {})
  };

  return (
    <AppProvider value={appContext}>
      <ClientContextProvider client={client}>
        <QueryProvider client={initQueryClient()}>{props.children}</QueryProvider>
      </ClientContextProvider>
    </AppProvider>
  );
};

export const customRenderHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props> & { wrapperProps: ContextHelperProps }
) => {
  return renderHook(render, {
    wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />,
    ...options
  });
};

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class EmptyClient implements Partial<Client> {}
