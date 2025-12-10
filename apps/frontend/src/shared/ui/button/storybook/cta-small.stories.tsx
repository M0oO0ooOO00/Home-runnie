import type { Meta, StoryObj, Decorator } from "@storybook/nextjs";
import { CtaSmall } from "@/shared/ui/button/cta-small";
import { Search, Settings, User } from "lucide-react";

/** 컨테이너: 이미지처럼 4개 버튼을 수직으로 나열 */
const Wrapper: Decorator = (Story) => (
  <div className="font-sans grid place-items-center min-h-[60vh] p-8">
    <div className="space-y-3 bg-background p-6 rounded-xl border border-border w-fit">
      <Story />
    </div>
  </div>
);

const meta = {
  title: "UI/Button/CTA Small",
  component: CtaSmall,
  decorators: [Wrapper],
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "subtle", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    text: { control: "text" },
  },
  args: {
    text: "필터",
    variant: "primary",
    size: "md",
    disabled: false,
  },
} satisfies Meta<typeof CtaSmall>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 Primary 버튼 */
export const Primary: Story = {};

/** Secondary 버튼 */
export const Secondary: Story = {
  args: { variant: "secondary" },
};

/** Subtle 버튼 */
export const Subtle: Story = {
  args: { variant: "subtle" },
};

/** Outline 버튼 */
export const Outline: Story = {
  args: { variant: "outline" },
};

/** 작은 크기 */
export const Small: Story = {
  args: { size: "sm" },
};

/** 큰 크기 */
export const Large: Story = {
  args: { size: "lg" },
};

/** 비활성화 상태 */
export const Disabled: Story = {
  args: { disabled: true },
};

/** 커스텀 아이콘과 텍스트 */
export const CustomIcon: Story = {
  args: {
    icon: <Search className="h-4 w-4" />,
    text: "검색",
  },
};

/** 다양한 아이콘들 */
export const DifferentIcons: Story = {
  render: () => (
    <div className="space-y-3">
      <CtaSmall text="필터" />
      <CtaSmall icon={<Search className="h-4 w-4" />} text="검색" />
      <CtaSmall icon={<Settings className="h-4 w-4" />} text="설정" />
      <CtaSmall icon={<User className="h-4 w-4" />} text="사용자" />
    </div>
  ),
};

/** 이미지와 동일한 4개 변형 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-3">
      <CtaSmall variant="primary" text="필터" />
      <CtaSmall variant="secondary" text="필터" />
      <CtaSmall variant="subtle" text="필터" />
      <CtaSmall variant="outline" text="필터" />
    </div>
  ),
};

/** 크기별 비교 */
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-3">
      <CtaSmall size="sm" text="작은 버튼" />
      <CtaSmall size="md" text="중간 버튼" />
      <CtaSmall size="lg" text="큰 버튼" />
    </div>
  ),
};
