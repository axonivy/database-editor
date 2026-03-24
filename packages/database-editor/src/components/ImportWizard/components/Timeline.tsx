import { cn, Flex, Label } from '@axonivy/ui-components';
import { Fragment } from 'react';
import type { ImportPage } from '../WizardContent';

export const Timeline = ({ pages, active, setActive }: { pages: Array<ImportPage>; active: number; setActive: (i: number) => void }) => {
  return (
    <ol className='flex list-none items-end justify-center p-0'>
      {pages.map((page, i) => (
        <Fragment key={i}>
          <li className='list-none'>
            <TimelineItem title={page.title} active={i === active} passed={i < active} index={i} setActive={setActive} />
          </li>
          {i < pages.length - 1 && (
            <li aria-hidden='true' className='flex-1'>
              <Connector active={i < active} />
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
};

const TimelineItem = ({
  title,
  active,
  passed,
  index,
  setActive
}: {
  title: string;
  active: boolean;
  passed: boolean;
  index: number;
  setActive: (i: number) => void;
}) => {
  return (
    <button
      type='button'
      className='cursor-pointer border-0 bg-transparent p-0'
      aria-current={active ? 'step' : undefined}
      onClick={() => {
        setActive(index);
      }}
    >
      <Flex alignItems='center' direction='column' className='w-3.75 cursor-pointer gap-4 border-0 bg-transparent p-0'>
        <Label className={cn('font-semibold whitespace-nowrap text-n700', active && 'text-p300')}>{title}</Label>
        <div
          className={cn(
            'z-1 size-3.75 rounded-full border-2 border-n400 bg-background',
            active && 'border-p300 bg-p300',
            passed && 'border-p300'
          )}
        ></div>
      </Flex>
    </button>
  );
};

const Connector = ({ active }: { active: boolean }) => {
  return <hr className={cn('m-0 h-0.5 flex-1 -translate-y-[7.5px] border-0 bg-n400', active && 'bg-p300')}></hr>;
};
