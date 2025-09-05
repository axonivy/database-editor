import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';

export const ProjectSelection = ({
  projects,
  selection,
  updateSelection
}: {
  projects: Array<string>;
  selection?: string;
  updateSelection: (database: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <Select value={selection ?? ''} onValueChange={updateSelection}>
      <SelectTrigger>
        <SelectValue placeholder={t('import.selectProject')} />
      </SelectTrigger>
      <SelectContent>
        {projects.map(project => (
          <SelectItem key={project} value={project}>
            {project}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
