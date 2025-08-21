import type { DatabaseTable } from '@axonivy/database-editor-protocol';
import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import './TableMultiSelect.css';

export const TableMultiSelect = ({
  tables,
  selection: selectedTables,
  updateSelection
}: {
  tables: Array<DatabaseTable>;
  selection: Array<DatabaseTable>;
  updateSelection: (table: DatabaseTable, add: boolean) => void;
}) => {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='table-select-trigger'>
          <span className='table-trigger-content'>
            {selectedTables.length ? selectedTables.map(t => t.name).join(', ') : t('import.selectTables')}
          </span>
          <IvyIcon icon={IvyIcons.Chevron} rotate={90} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='table-select-content'>
        {tables.map((table, i) => (
          <DropdownMenuCheckboxItem
            className='table-selection-item'
            checked={selectedTables.find(t => t.name === table.name) !== undefined}
            key={i}
            onSelect={e => e.preventDefault()}
            onCheckedChange={inactive => updateSelection(table, inactive)}
          >
            {table.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
