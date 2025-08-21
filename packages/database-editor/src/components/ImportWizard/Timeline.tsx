import { cn, Flex, Label } from '@axonivy/ui-components';
import { Fragment } from 'react';
import './Timeline.css';
import type { ImportPage } from './WizardContent';

export const Timeline = ({ pages, active, setActive }: { pages: Array<ImportPage>; active: number; setActive: (i: number) => void }) => {
  return (
    <Flex className='timeline' direction='row' justifyContent='center'>
      {pages.map((page, i) => (
        <Fragment key={i}>
          <TimelineItem title={page.title} active={i === active} passed={i < active} index={i} setActive={setActive} />
          {i < pages.length - 1 && <Connector active={i < active} />}
        </Fragment>
      ))}
    </Flex>
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
    <Flex
      className={cn('timeline-item', active && 'active', passed && 'passed')}
      alignItems='center'
      direction='column'
      onClick={() => {
        setActive(index);
      }}
    >
      <Label className='timeline-title'>{title}</Label>
      <div className='timeline-circle'></div>
    </Flex>
  );
};

const Connector = ({ active }: { active: boolean }) => {
  return <hr className={cn('timeline-connector', active && 'active')}></hr>;
};
