import { Story, Meta } from '@storybook/react';
import { HomePage } from './home-page';

export default {
  component: HomePage,
  title: 'HomePage',
} as Meta;

const Template: Story = (args) => <HomePage {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
