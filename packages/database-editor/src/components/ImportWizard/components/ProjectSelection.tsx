import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useContextProvider } from '../../../util/ContextProvider';

export const ProjectSelection = ({
  projects,
  updateSelection
}: {
  projects: Array<string>;
  updateSelection: (database: string) => void;
}) => {
  const { t } = useTranslation();
  const { context } = useContextProvider();
  return (
    <Select value={context.pmv} onValueChange={updateSelection}>
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
