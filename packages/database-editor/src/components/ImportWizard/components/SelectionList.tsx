import { BasicField, Button, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectionListButton } from './SelectionListButton';

export type SelectionListProps = {
  list: Array<string>;
  setSelection: Dispatch<SetStateAction<string[]>>;
  selection: Array<string>;
  filter?: string;
  listTitle: string;
  selectionTitle: string;
  selectionPlaceholder: string;
};

export const SelectionList = ({
  list,
  selection,
  setSelection,
  filter,
  listTitle,
  selectionTitle,
  selectionPlaceholder
}: SelectionListProps) => {
  const { t } = useTranslation();

  const btnSelectAll = (
    <Button icon={IvyIcons.Check} onClick={() => setSelection(list ?? [])} className='text-[12px] text-p300'>
      <span>{t('import.selectAll')}</span>
    </Button>
  );

  const btnDeselectAll = (
    <Button icon={IvyIcons.Close} onClick={() => setSelection([])} className='text-[12px] text-error'>
      {t('import.deselectAll')}
    </Button>
  );

  return (
    <Flex direction='row' gap={4} className='h-full overflow-auto'>
      <SelectionListField
        items={list.filter(item => !selection.includes(item))}
        onClick={value => setSelection(current => [...current, value].sort((v1, v2) => v1.localeCompare(v2)))}
        selectionTitle={listTitle}
        control={btnSelectAll}
        filter={filter}
      />
      <SelectionListField
        items={selection}
        onClick={value => setSelection(current => current.filter(i1 => i1 !== value))}
        selectionTitle={selectionTitle}
        control={btnDeselectAll}
        filter={filter}
        placeholder={selectionPlaceholder}
      />
    </Flex>
  );
};

type SelectionListFieldProps = {
  items: Array<string>;
  selectionTitle: string;
  control: ReactNode;
  filter?: string;
  onClick: (value: string) => void;
  placeholder?: string;
  icon?: IvyIcons;
};

export const SelectionListField = ({ selectionTitle, control, items, filter, onClick, placeholder, icon }: SelectionListFieldProps) => {
  return (
    <BasicField label={selectionTitle} control={control} className='w-full'>
      <Flex
        className='box-border size-full overflow-auto rounded-sm border border-n200 bg-n75 p-4'
        direction='column'
        gap={1}
        role='list'
        aria-label={selectionTitle}
      >
        {items.length > 0 ? (
          items
            .filter(t => t.toLocaleLowerCase().includes(filter ? filter.toLocaleLowerCase() : ''))
            .map(item => <SelectionListButton key={item} value={item} icon={icon} onClick={onClick} />)
        ) : (
          <div className='flex h-full items-center justify-center'>
            <span>{placeholder}</span>
          </div>
        )}
      </Flex>
    </BasicField>
  );
};
