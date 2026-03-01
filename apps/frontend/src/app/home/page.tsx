import MainBanner from './components/MainBanner';
import MateListBanner from './components/MateListBanner';

export default function Page() {
  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-[54px]">
      <MainBanner />
      <MateListBanner />
    </div>
  );
}
