import { Button, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';

export const SelectionListButton = ({ value, onClick, icon }: { value: string; onClick: (table: string) => void; icon?: IvyIcons }) => {
  return (
    <Button className='border border-n200 bg-n25' onClick={() => onClick(value)}>
      <span className='w-full text-left'>{value}</span>
      {icon && <IvyIcon icon={icon} className='content-center' />}
    </Button>
  );
};
