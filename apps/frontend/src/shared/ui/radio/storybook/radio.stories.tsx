import type { Meta, StoryObj } from "@storybook/nextjs";
import Radio from "@/shared/ui/radio/radio";
import { RadioGroup } from "@/shared/ui/radio";
import { useState } from "react";

const meta = {
  title: "ui/Radio",
  component: Radio,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<Record<string, never>>;

export const TicketStatus: Story = {
  render: () => {
    const Demo = () => {
      const [v, setV] = useState<"have" | "need">("need");
      return (
        <div className="w-full inline-flex flex-col gap-5">
          <div className="text-zinc-800 text-xl font-semibold font-['Pretendard'] leading-7">
            티켓 현황
          </div>
          <RadioGroup
            name="ticket"
            value={v}
            onChange={(nv) => setV(nv as "have" | "need")}
            options={[
              { value: "have", label: "티켓 보유 중. 동행 구함" },
              { value: "need", label: "티켓 X 동행 구한 후 티켓팅" },
            ]}
          />
        </div>
      );
    };
    return <Demo />;
  },
};

export const Gender: Story = {
  render: () => {
    const Demo = () => {
      const [v, setV] = useState<"F" | "M">("M");
      return (
        <div className="w-36 inline-flex flex-col gap-5">
          <div className="text-zinc-800 text-xl font-semibold font-['Pretendard'] leading-7">
            성별
          </div>
          <RadioGroup
            name="gender"
            value={v}
            onChange={(nv) => setV(nv as "F" | "M")}
            options={[
              { value: "F", label: "여자" },
              { value: "M", label: "남자" },
              { value: "N", label: "상관없음" },
            ]}
          />
        </div>
      );
    };
    return <Demo />;
  },
};
