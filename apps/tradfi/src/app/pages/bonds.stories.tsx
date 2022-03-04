import { Story, Meta } from '@storybook/react';
import { BondsPage } from './bonds';

export default {
  component: BondsPage,
  title: 'BondsPage',
} as Meta;

const Template: Story = (args) => <BondsPage {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
