import type { Meta, StoryObj, Decorator } from "@storybook/nextjs";
import { Dropdown } from "../dropdown";
import { User, Settings, LogOut } from "lucide-react";

/** 컨테이너: 디자인 시안처럼 카드 위에 드롭다운들을 나열 */
const Wrapper: Decorator = (Story) => (
  <div className="font-sans grid place-items-center min-h-[60vh] p-8">
    <div className="space-y-6 bg-background p-6 rounded-xl border border-border w-full max-w-md">
      <Story />
    </div>
  </div>
);

const meta: Meta<typeof Dropdown> = {
  title: "UI/Dropdown",
  component: Dropdown,
  decorators: [Wrapper],
  tags: ["autodocs"],
  argTypes: {
    fieldSize: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    tone: {
      control: "select",
      options: ["default", "error"],
    },
    state: {
      control: "select",
      options: ["enabled", "disabled"],
    },
    itemSize: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    itemWeight: {
      control: "select",
      options: ["normal", "medium", "semibold", "bold"],
    },
    showChevron: { control: "boolean" },
  },
  args: {
    placeholder: "dropdown",
    fieldSize: "md",
    itemSize: "md",
    itemWeight: "normal",
    showChevron: true,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

/** 기본 드롭다운 - 이미지와 동일한 스타일 */
export const Default: Story = {
  args: {
    placeholder: "dropdown",
    items: [
      {
        options: [
          { value: "a", text: "dropdown_list" },
          { value: "b", text: "dropdown_list" },
          { value: "c", text: "dropdown_list" },
        ],
      },
    ],
  },
};

/** 에러 상태 */
export const Error: Story = {
  args: {
    placeholder: "dropdown",
    tone: "error",
    errorMessage: "값을 선택하세요.",
    items: [
      {
        options: [
          { value: "a", text: "dropdown_list" },
          { value: "b", text: "dropdown_list" },
        ],
      },
    ],
  },
};

/** 비활성화 상태 */
export const Disabled: Story = {
  args: {
    placeholder: "dropdown",
    state: "disabled",
    items: [
      {
        options: [
          { value: "a", text: "dropdown_list" },
          { value: "b", text: "dropdown_list" },
        ],
      },
    ],
  },
};

/** 아이콘이 있는 옵션들 */
export const WithIcons: Story = {
  args: {
    placeholder: "프로필 선택",
    label: "사용자 프로필",
    items: [
      {
        options: [
          {
            value: "profile",
            text: "내 프로필",
            icon: <User className="h-4 w-4" />,
            description: "개인 정보 관리",
          },
          {
            value: "settings",
            text: "설정",
            icon: <Settings className="h-4 w-4" />,
            description: "계정 설정",
          },
          {
            value: "logout",
            text: "로그아웃",
            icon: <LogOut className="h-4 w-4" />,
            description: "계정에서 로그아웃",
          },
        ],
      },
    ],
  },
};

/** 그룹이 있는 드롭다운 */
export const WithGroups: Story = {
  args: {
    placeholder: "카테고리 선택",
    label: "상품 카테고리",
    items: [
      {
        label: "전자제품",
        options: [
          { value: "phone", text: "스마트폰" },
          { value: "laptop", text: "노트북" },
          { value: "tablet", text: "태블릿" },
        ],
      },
      {
        label: "의류",
        options: [
          { value: "shirt", text: "셔츠" },
          { value: "pants", text: "바지" },
          { value: "shoes", text: "신발" },
        ],
        separator: true,
      },
    ],
  },
};

/** 다양한 폰트 무게 */
export const FontWeights: Story = {
  args: {
    placeholder: "폰트 무게 선택",
    label: "텍스트 스타일",
    items: [
      {
        options: [
          { value: "normal", text: "일반 텍스트", weight: "normal" },
          { value: "medium", text: "중간 굵기", weight: "medium" },
          { value: "semibold", text: "세미볼드", weight: "semibold" },
          { value: "bold", text: "볼드", weight: "bold" },
        ],
      },
    ],
  },
};

/** 작은 크기 */
export const Small: Story = {
  args: {
    placeholder: "작은 드롭다운",
    fieldSize: "sm",
    itemSize: "sm",
    items: [
      {
        options: [
          { value: "a", text: "옵션 1" },
          { value: "b", text: "옵션 2" },
          { value: "c", text: "옵션 3" },
        ],
      },
    ],
  },
};

/** 큰 크기 */
export const Large: Story = {
  args: {
    placeholder: "큰 드롭다운",
    fieldSize: "lg",
    itemSize: "lg",
    items: [
      {
        options: [
          { value: "a", text: "옵션 1" },
          { value: "b", text: "옵션 2" },
          { value: "c", text: "옵션 3" },
        ],
      },
    ],
  },
};

/** 커스텀 아이콘 없음 */
export const NoChevron: Story = {
  args: {
    placeholder: "아이콘 없는 드롭다운",
    showChevron: false,
    items: [
      {
        options: [
          { value: "a", text: "옵션 1" },
          { value: "b", text: "옵션 2" },
          { value: "c", text: "옵션 3" },
        ],
      },
    ],
  },
};

/** 선택된 값이 있는 상태 */
export const WithValue: Story = {
  args: {
    placeholder: "값 선택",
    value: "b",
    items: [
      {
        options: [
          { value: "a", text: "옵션 1" },
          { value: "b", text: "선택된 옵션" },
          { value: "c", text: "옵션 3" },
        ],
      },
    ],
  },
};

/** 모든 상태를 한 번에 보여주는 프리뷰 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Dropdown
        placeholder="기본 드롭다운"
        items={[
          {
            options: [
              { value: "a", text: "dropdown_list" },
              { value: "b", text: "dropdown_list" },
              { value: "c", text: "dropdown_list" },
            ],
          },
        ]}
      />

      <Dropdown
        placeholder="에러 상태"
        tone="error"
        errorMessage="값을 선택하세요"
        items={[
          {
            options: [
              { value: "a", text: "dropdown_list" },
              { value: "b", text: "dropdown_list" },
            ],
          },
        ]}
      />

      <Dropdown
        placeholder="비활성화"
        state="disabled"
        items={[
          {
            options: [
              { value: "a", text: "dropdown_list" },
              { value: "b", text: "dropdown_list" },
            ],
          },
        ]}
      />
    </div>
  ),
};
