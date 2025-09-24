import type { DatabaseTable } from '@axonivy/database-editor-protocol';
import { Button, cn, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import './TableSelectionButton.css';

export const TableSelectionButton = ({
  table,
  active,
  onClick: update
}: {
  table: DatabaseTable;
  active: boolean;
  onClick: (table: DatabaseTable) => void;
}) => {
  return (
    <Button
      variant={active ? 'primary-outline' : 'outline'}
      className={cn('table-button', active && 'active')}
      onClick={() => update(table)}
    >
      <span className='table-button-text'>{table.name}</span>
      {active && <IvyIcon icon={IvyIcons.Check} />}
    </Button>
  );
};
