import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';

export const DatabaseSelection = ({
  databases,
  selection,
  updateSelection
}: {
  databases: Array<string>;
  selection?: string;
  updateSelection: (database: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <Select value={selection ?? ''} onValueChange={updateSelection}>
      <SelectTrigger>
        <SelectValue placeholder={t('import.selectDatabase')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t('import.ivySystemDatabase')}</SelectLabel>
          <SelectItem value='IvySystemDatabase'>{t('import.ivySystemDatabase')}</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>{t('import.databasesYaml')}</SelectLabel>
          {databases.map(database => (
            <SelectItem key={database} value={database}>
              {database}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
