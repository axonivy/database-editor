import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';

export const DatabaseSelection = ({
  databases,
  selection,
  updateSelection,
  disabled = false
}: {
  databases: Array<string>;
  selection?: string;
  updateSelection: (database: string) => void;
  disabled: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Select value={selection ?? ''} onValueChange={updateSelection} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={t('import.selectDatabase')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='IvySystemDatabase'>{t('import.ivySystemDatabase')}</SelectItem>
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
