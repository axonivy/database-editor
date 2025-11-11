import { Button, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import './SelectionListButton.css';

export const SelectionListButton = ({ value, onClick, icon }: { value: string; onClick: (table: string) => void; icon?: IvyIcons }) => {
  return (
    <Button className='selection-list-button' onClick={() => onClick(value)}>
      <span className='selection-list-button-text'>{value}</span>
      {icon && <IvyIcon icon={icon} />}
    </Button>
  );
};
