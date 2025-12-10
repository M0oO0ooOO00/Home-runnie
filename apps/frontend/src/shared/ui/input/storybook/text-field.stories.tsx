import type { Meta, StoryObj, Decorator } from "@storybook/react";
import { TextField } from "@/shared/ui/input/text-field";

const Wrapper: Decorator = (Story) => (
  <div className="font-sans grid place-items-center min-h-[60vh] p-8">
    <div className="space-y-4 bg-background p-6 rounded-xl border border-border w-[28.75rem]">
      <Story />
    </div>
  </div>
);

const meta = {
  title: "UI/TextField",
  component: TextField,
  decorators: [Wrapper],
  tags: ["autodocs"],
  argTypes: {
    tone: { control: "select", options: ["default", "error"] },
    size: { control: "select", options: ["md", "sm"] },
    state: { control: "select", options: ["enabled", "disabled"] },
    placeholder: { control: "text" },
    errorMessage: { control: "text" },
    helperText: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    placeholder: "textfield",
    tone: "default",
    size: "md",
    state: "enabled",
    helperText: "",
    errorMessage: "",
    disabled: false,
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { state: "disabled", placeholder: "textfield" },
};

export const Error: Story = {
  args: { tone: "error", errorMessage: "유효하지 않은 값입니다." },
};

export const WithHelper: Story = {
  args: { helperText: "설명 텍스트를 여기에 표시합니다." },
};

export const AllStates: Story = {
  render: (args) => (
    <div className="space-y-4">
      <TextField {...args} placeholder="textfield" />
      <TextField {...args} tone="error" errorMessage="유효하지 않은 값입니다." />
      <TextField {...args} state="disabled" placeholder="textfield" />
    </div>
  ),
};
