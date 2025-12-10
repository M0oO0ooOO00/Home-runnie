import type { Meta, StoryObj } from "@storybook/nextjs";
import { BgmTag } from "../bgm-tag";
import { useState } from "react";

const meta: Meta<typeof BgmTag> = {
  title: "UI/Tag/BgmTag",
  component: BgmTag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["default", "selected"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    selected: {
      control: { type: "boolean" },
    },
    text: {
      control: { type: "text" },
    },
    onClick: { action: "clicked" },
  },
  args: {
    text: "응원가 부르는거 좋아해요",
    state: "default",
    size: "md",
    selected: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-4 p-4">{children}</div>
);

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <BgmTag {...args} />
    </Wrapper>
  ),
};

export const Selected: Story = {
  render: (args) => (
    <Wrapper>
      <BgmTag {...args} selected={true} />
    </Wrapper>
  ),
};

export const States: Story = {
  render: () => (
    <Wrapper>
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">기본 상태</h3>
          <BgmTag text="응원가 부르는거 좋아해요" />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">선택된 상태</h3>
          <BgmTag text="응원가 부르는거 좋아해요" selected={true} />
        </div>
      </div>
    </Wrapper>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Wrapper>
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Small</h3>
          <BgmTag text="응원가 부르는거 좋아해요" size="sm" />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Medium (기본)</h3>
          <BgmTag text="응원가 부르는거 좋아해요" size="md" />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Large</h3>
          <BgmTag text="응원가 부르는거 좋아해요" size="lg" />
        </div>
      </div>
    </Wrapper>
  ),
};

const InteractiveWrapper = () => {
  const [selected, setSelected] = useState(false);

  return (
    <Wrapper>
      <BgmTag
        text="응원가 부르는거 좋아해요"
        selected={selected}
        onClick={() => setSelected(!selected)}
      />
      <p className="text-sm text-gray-600">클릭하여 선택 상태를 토글할 수 있습니다.</p>
    </Wrapper>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveWrapper />,
};

export const LongText: Story = {
  render: () => (
    <Wrapper>
      <BgmTag text="매우 긴 텍스트가 들어가도 잘 처리되는지 확인해보세요" />
    </Wrapper>
  ),
};
