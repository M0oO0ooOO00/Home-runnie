import KakaoLoginButton from './KakaoLoginButton';

export default function Landing() {
  return (
    <div className="w-full max-w-[564px] flex flex-col m-auto gap-10 md:gap-[77px] items-center justify-center px-4 md:px-0">
      <div className="w-full h-[350px] md:h-[546px] bg-zinc-300 flex items-center justify-center rounded-2xl" />
      <KakaoLoginButton />
    </div>
  );
}
