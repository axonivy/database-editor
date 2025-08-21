import { Flex, Label } from '@axonivy/ui-components';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Timeline } from './Timeline';
import type { ImportPage } from './WizardContent';

const pages: Array<ImportPage> = [
  {
    page: (
      <Flex>
        <Label>Test</Label>
      </Flex>
    ),
    requiredData: true,
    title: 'TestPage'
  },
  {
    page: (
      <Flex>
        <Label>Test</Label>
      </Flex>
    ),
    requiredData: true,
    title: 'TestPage'
  }
];

describe('Timeline', () => {
  it('renders timeline', async () => {
    render(<Timeline pages={pages} active={0} setActive={() => {}} />);
    const elements = await screen.findAllByText('TestPage');
    expect(elements).toHaveLength(2);
  });
});
