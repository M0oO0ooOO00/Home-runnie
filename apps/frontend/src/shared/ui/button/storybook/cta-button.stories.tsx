import type { Meta, StoryObj, Decorator } from "@storybook/react";
import { CtaButton } from "@/shared/ui/button/cta-button";

/** 컨테이너: 디자인 시안처럼 카드 위에 버튼들을 나열 */
const Wrapper: Decorator = (Story) => (
  <div className="font-sans grid place-items-center min-h-[60vh] p-8">
    <div className="space-y-3 bg-background p-6 rounded-xl border border-border w-[28.75rem]">
      <Story />
    </div>
  </div>
);

const meta = {
  title: "UI/Button/CTA",
  component: CtaButton,
  decorators: [Wrapper],
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "subtle", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "default"],
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "회원가입 완료",
    variant: "primary",
    size: "md",
    disabled: false,
  },
} satisfies Meta<typeof CtaButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 개별 상태들 */
export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const SubtleDisabled: Story = {
  args: { variant: "subtle", disabled: true },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

/** 시안처럼 4개를 한 번에 보여주는 프리뷰 */
export const AllVariants: Story = {
  render: (args) => (
    <>
      <CtaButton {...args} variant="primary">
        회원가입 완료
      </CtaButton>
      <CtaButton {...args} variant="secondary">
        회원가입 완료
      </CtaButton>
      <CtaButton {...args} variant="subtle" disabled>
        회원가입 완료
      </CtaButton>
      <CtaButton {...args} variant="outline">
        회원가입 완료
      </CtaButton>
    </>
  ),
};
