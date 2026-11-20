import type { DatabaseConfigurationData, ValidationResult } from '@axonivy/database-editor-protocol';

export const validateMock = (data: Array<DatabaseConfigurationData>): Array<ValidationResult> => {
  const validations: Array<ValidationResult> = [];
  data.forEach(database => {
    if (database.key.includes('invalid-')) {
      validations.push({
        path: `${database.key}.key`,
        message: `Database ${database.key} contains invalid characters`,
        severity: 'ERROR',
        code: 'ivy.database.key-not-unique',
        url: 'https://developer.axonivy.com/doc/14.0/en/reference/validation/codes/ivy.database.key-not-unique.html'
      });
    }
  });
  return validations;
};
