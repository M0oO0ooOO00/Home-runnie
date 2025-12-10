import KakaoLoginButton from "@/features/landing/ui/kakao-login-button";

export default function Landing() {
  return (
    <>
      <div className="w-[564px] flex flex-col m-auto gap-[77px] items-center justify-center">
        <div className="w-full h-[546px] bg-zinc-300 flex items-center justify-center rounded-2xl" />
        <KakaoLoginButton />
      </div>
    </>
  );
}
