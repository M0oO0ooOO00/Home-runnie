import type { Meta, StoryObj, Decorator } from "@storybook/nextjs";
import { ToggleSwitch } from "../toggle-switch";
import { useState } from "react";

/** 컨테이너: 이미지처럼 토글 스위치들을 나열 */
const Wrapper: Decorator = (Story) => (
  <div className="font-sans grid place-items-center min-h-[60vh] p-8">
    <div className="space-y-6 bg-background p-6 rounded-xl border border-border w-fit">
      <Story />
    </div>
  </div>
);

const meta = {
  title: "UI/Switch/Toggle",
  component: ToggleSwitch,
  decorators: [Wrapper],
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
  },
  args: {
    variant: "primary",
    size: "md",
    disabled: false,
  },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 토글 스위치 */
export const Default: Story = {};

/** 라벨이 있는 토글 스위치 */
export const WithLabel: Story = {
  args: {
    label: "알림 설정",
  },
};

/** 라벨과 설명이 있는 토글 스위치 */
export const WithDescription: Story = {
  args: {
    label: "알림 설정",
    description: "새로운 메시지 알림을 받습니다",
  },
};

/** 켜진 상태 */
export const Checked: Story = {
  args: {
    defaultChecked: true,
    label: "켜진 상태",
  },
};

/** 꺼진 상태 */
export const Unchecked: Story = {
  args: {
    defaultChecked: false,
    label: "꺼진 상태",
  },
};

/** 비활성화 상태 */
export const Disabled: Story = {
  args: {
    disabled: true,
    label: "비활성화",
  },
};

/** 작은 크기 */
export const Small: Story = {
  args: {
    size: "sm",
    label: "작은 토글",
  },
};

/** 큰 크기 */
export const Large: Story = {
  args: {
    size: "lg",
    label: "큰 토글",
  },
};

/** 기본 변형 (회색) */
export const DefaultVariant: Story = {
  args: {
    variant: "default",
    label: "기본 변형",
  },
};

/** 성공 변형 (녹색) */
export const SuccessVariant: Story = {
  args: {
    variant: "success",
    label: "성공 변형",
  },
};

/** 이미지와 동일한 두 상태 */
const ImageStatesWrapper = () => {
  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(false);

  return (
    <div className="space-y-4">
      <ToggleSwitch checked={checked1} onCheckedChange={setChecked1} variant="primary" size="md" />
      <ToggleSwitch checked={checked2} onCheckedChange={setChecked2} variant="primary" size="md" />
    </div>
  );
};

export const ImageStates: Story = {
  render: () => <ImageStatesWrapper />,
};

/** 모든 크기 비교 */
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <ToggleSwitch size="sm" label="작은 크기" />
      <ToggleSwitch size="md" label="중간 크기" />
      <ToggleSwitch size="lg" label="큰 크기" />
    </div>
  ),
};

/** 모든 변형 비교 */
export const VariantComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <ToggleSwitch variant="default" label="기본 변형" />
      <ToggleSwitch variant="primary" label="Primary 변형" />
      <ToggleSwitch variant="success" label="Success 변형" />
    </div>
  ),
};
