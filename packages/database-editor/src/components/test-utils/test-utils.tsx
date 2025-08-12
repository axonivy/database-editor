import type { Client, DatabaseEditorContext } from '@axonivy/database-editor-protocol';
import type { RenderHookOptions } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import i18n from 'i18next';
import type { ReactNode } from 'react';
import { initReactI18next } from 'react-i18next';
import { ClientContextProvider } from '../../protocol/ClientContextProvider';
import { initQueryClient } from '../../query/query-client';
import { QueryProvider } from '../../query/QueryProvider';
import enTrans from '../../translation/database-editor/en.json';

type ContextHelperProps = {
  client?: Partial<Client>;
  appContext?: {
    context?: DatabaseEditorContext;
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

  return (
    <ClientContextProvider client={client}>
      <QueryProvider client={initQueryClient()}>{props.children}</QueryProvider>
    </ClientContextProvider>
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
