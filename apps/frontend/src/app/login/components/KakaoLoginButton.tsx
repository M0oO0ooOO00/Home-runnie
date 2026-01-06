'use client';

import Image from 'next/image';
import { useKakaoLogin } from '@/hooks/useKakaoLogin';

export default function KakaoLoginButton() {
  const { handleKakaoLogin } = useKakaoLogin();

  return (
    <button
      type="button"
      onClick={handleKakaoLogin}
      className="w-full max-w-[320px] h-12 bg-[#FEE500] rounded-lg flex items-center justify-center gap-3 hover:brightness-95 transition cursor-pointer"
    >
      <Image src="/icons/kakao_icon.svg" alt="카카오 아이콘" width={24} height={24} />
      <span className="text-b01-m text-black">카카오톡으로 로그인하기</span>
    </button>
  );
}
