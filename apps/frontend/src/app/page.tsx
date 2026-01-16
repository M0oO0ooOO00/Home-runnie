import LottieLogo from './login/components/LottieLogo';
import KakaoLoginButton from './login/components/KakaoLoginButton';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-20 md:gap-[156px] min-h-[calc(100vh-84px)]">
      <div className="w-full max-w-[564px] flex flex-col m-auto gap-10 md:gap-[77px] items-center justify-center px-4 md:px-0">
        <div className="w-full h-[350px] md:h-[546px] flex items-center justify-center rounded-2xl">
          <LottieLogo />
        </div>
        <KakaoLoginButton />
      </div>
    </div>
  );
}
