import { Story, Meta } from '@storybook/react';
import { Root } from './root';

export default {
  component: Root,
  title: 'Root',
} as Meta;

const Template: Story = (args) => <Root {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
