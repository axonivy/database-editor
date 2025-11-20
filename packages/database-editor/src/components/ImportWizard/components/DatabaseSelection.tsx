import type { MapStringListString } from '@axonivy/database-editor-protocol';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';

export const DatabaseSelection = ({
  databases,
  selection,
  updateSelection,
  disabled = false,
  pmv,
  showAll
}: {
  databases: MapStringListString;
  selection?: string;
  updateSelection: (database: string) => void;
  disabled: boolean;
  pmv: string;
  showAll: boolean;
}) => {
  const { t } = useTranslation();

  const requiredProjects = Object.keys(databases).filter(p => p !== pmv && databases[p] && databases[p].length > 0);

  return (
    <Select value={selection ?? ''} onValueChange={updateSelection} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={t('import.selectDatabase')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {showAll && <SelectLabel>{pmv}</SelectLabel>}
          {(databases[pmv] ?? []).map(database => (
            <SelectItem key={database} value={database}>
              {database}
            </SelectItem>
          ))}
        </SelectGroup>
        {showAll &&
          requiredProjects.map(p => (
            <SelectGroup key={p}>
              <SelectLabel>{p}</SelectLabel>
              {(databases[p] ?? []).map(database => (
                <SelectItem key={database} value={database}>
                  {database}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
      </SelectContent>
    </Select>
  );
};
