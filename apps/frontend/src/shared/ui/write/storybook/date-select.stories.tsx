import type { Meta, StoryObj } from "@storybook/nextjs";
import React, { useState } from "react";
import DateSelect from "../date-select";

const meta = {
  title: "write/DateSelect",
  component: DateSelect,
  parameters: { layout: "centered" },
  argTypes: {
    value: { control: "date" },
    placeholder: { control: "text" },
    disabledBeforeToday: { control: "boolean" },
    weekStartsOn: { control: { type: "inline-radio" }, options: [0, 1] },
    onChange: { action: "change" },
  },
} satisfies Meta<typeof DateSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const ComponentWithHooks = () => {
      const [v, setV] = useState<Date | null>(null);
      return <DateSelect {...args} value={v} onChange={setV} />;
    };
    return <ComponentWithHooks />;
  },
  args: {
    placeholder: "경기 날짜 선택",
    disabledBeforeToday: true,
    weekStartsOn: 0,
  },
};

export const WithInitialValue: Story = {
  render: (args) => {
    const ComponentWithHooks = () => {
      const [v, setV] = useState<Date | null>(new Date());
      return <DateSelect {...args} value={v} onChange={setV} />;
    };
    return <ComponentWithHooks />;
  },
  args: {
    disabledBeforeToday: true,
    weekStartsOn: 0,
  },
};

export const MondayStart: Story = {
  render: (args) => {
    const ComponentWithHooks = () => {
      const [v, setV] = useState<Date | null>(null);
      return <DateSelect {...args} value={v} onChange={setV} />;
    };
    return <ComponentWithHooks />;
  },
  args: {
    placeholder: "경기 날짜 선택",
    weekStartsOn: 1,
  },
};
