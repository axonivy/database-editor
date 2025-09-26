import type { MessageData } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';

export const useNamespaceValidation = (namespace: string): MessageData | undefined => {
  const { t } = useTranslation();
  if (namespace.trim() === '') {
    return { message: t('import.namespaceRequired'), variant: 'warning' };
  }
  if (!namespace.match('^\\w+(?:\\.\\w+)*$')) {
    return { message: t('import.invalidNamespace'), variant: 'error' };
  }
};
