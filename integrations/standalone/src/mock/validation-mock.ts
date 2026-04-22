import type { DatabaseConfigurationData, ValidationResult } from '@axonivy/database-editor-protocol';

export const validateMock = (data: Array<DatabaseConfigurationData>): Array<ValidationResult> => {
  const validations: Array<ValidationResult> = [];
  data.forEach(database => {
    if (database.key.includes('invalid-')) {
      validations.push({
        path: `${database.key}.key`,
        message: `Database ${database.key} contains invalid characters`,
        severity: 'ERROR'
      });
    }
  });
  return validations;
};
