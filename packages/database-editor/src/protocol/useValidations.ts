import type { ValidationResult } from '@axonivy/database-editor-protocol';
import { useAppContext } from '../AppContext';

export function useValidations(path: string): ValidationResult[] {
  const { validations } = useAppContext();
  if (path === '') {
    return [];
  }
  return validations.filter(val => val.path?.toLowerCase()?.startsWith(path.toLowerCase()));
}
