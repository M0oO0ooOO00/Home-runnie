import MainBanner from "@/features/home/main-banner";
import MateListBanner from "@/features/home/mate-list-banner";

export default function Page() {
  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-[54px]">
      <MainBanner />
      <MateListBanner />
    </div>
  );
}
