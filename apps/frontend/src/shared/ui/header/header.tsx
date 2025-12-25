'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);

  // 임시 상태 변화 감지 함수
  const onClickLogin = () => {
    setIsLogged(true);
  };

  const onClickLogout = () => {
    setIsLogged(false);
  };

  const onClickHome = () => {
    router.push('/home');
  };

  return (
    <header className="w-full h-[84px] bg-white flex items-center justify-between z-9999">
      <div className="flex items-center pt-[29px] pb-[33px] md:pl-[120px] pl-4">
        <Image
          src="/images/typo-default.png"
          alt="로고 위치"
          width={128}
          height={22}
          onClick={onClickHome}
          className="cursor-pointer"
        />
      </div>
      {/* 오른쪽 메뉴 박스 */}
      <nav className="flex items-center justify-center gap-[20px] rounded-[10px] md:pr-[95px] pr-4">
        {/* 나중에 링크 바꾸기 */}
        {isLogged && (
          <>
            <Link className="cursor-pointer" href="/">
              <div className="px-[10px] py-[15px] justify-start rounded-[10px] text-gray-600 b02-m hover:bg-gray-50">
                채팅
              </div>
            </Link>
            <Link className="cursor-pointer" href="/">
              <div className="px-[10px] py-[15px] justify-start rounded-[10px] text-gray-600 b02-m hover:bg-gray-50">
                마이페이지
              </div>
            </Link>
            <Link className="cursor-pointer" href="/" onClick={onClickLogout}>
              <div className="px-[10px] py-[15px] justify-start rounded-[10px] text-gray-600 b02-m hover:bg-gray-50">
                로그아웃
              </div>
            </Link>
          </>
        )}
        {!isLogged && (
          <Link className="cursor-pointer" href="/home" onClick={onClickLogin}>
            <div className="px-[10px] py-[15px] justify-start rounded-[10px] text-gray-600 b02-m hover:bg-gray-50">
              로그인
            </div>
          </Link>
        )}
      </nav>
    </header>
  );
}
