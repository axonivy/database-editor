import { Button, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import './SelectionListButton.css';

export const SelectionListButton = ({
  value,
  selected,
  onClick
}: {
  value: string;
  selected: boolean;
  onClick: (table: string) => void;
}) => {
  return (
    <Button className='selection-list-button' onClick={() => onClick(value)}>
      <span className='selection-list-button-text'>{value}</span>
      <IvyIcon icon={selected ? IvyIcons.Close : IvyIcons.Plus} />
    </Button>
  );
};
