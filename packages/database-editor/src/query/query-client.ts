import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';

export const initQueryClient = (config?: QueryClientConfig) => {
  return new QueryClient(config);
};

export const genQueryKey = (...args: unknown[]) => {
  return ['database-editor', ...args];
};
