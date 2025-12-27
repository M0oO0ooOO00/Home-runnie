import TextFields from './TextFields';
import { baseBallTeamItems, genderItems } from '@homerunnie/shared';
import Header from '@/shared/ui/header/header';

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
