import TextFields from "@/features/signup/ui/TextFields";
import { baseBallTeamItems } from "@/entities/team/team";
import Header from "@/shared/ui/header/header";

const genderItems = [
  { value: "male", label: "남성" },
  { value: "female", label: "여성" },
];

export default function SignUpForm() {
  return (
    <>
      <Header />
      <div className="w-[460px] m-auto flex flex-col justify-start items-center gap-14">
        {/*<div className="gap-12 w-full items-center flex flex-col">*/}
        <TextFields baseBallTeamItems={baseBallTeamItems} genderItems={genderItems} />
        {/*</div>*/}
      </div>
    </>
  );
}
