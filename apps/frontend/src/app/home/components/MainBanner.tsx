'use client';

import BannerCard from './BannerCard';
import { useMemo, useState } from 'react';
import { useMyProfileQuery } from '@/hooks/my/useProfileQuery';
import { useRouter } from 'next/navigation';
import LoginRequiredModal from '@/shared/ui/modal/LoginRequiredModal';

const bannerItems = [
  {
    href: '/write',
    bgColor: 'bg-[#0ABF00]',
    title: (
      <>
        새로운 직관메이트
        <br />
        모집글 작성하기
      </>
    ),
    description: '직관 메이트를 모집해보세요',
    iconSrc: '/icons/post-icon.svg',
    iconAlt: '모집글 작성 아이콘',
  },
  {
    href: '/home',
    bgColor: 'bg-[#FF6D00]',
    title: (
      <>
        직관 꿀팁
        <br />
        백과사전!
      </>
    ),
    description: '직관이 처음이신가요?',
    iconSrc: '/icons/dictionary.svg',
    iconAlt: '백과사전 아이콘',
  },
];

export default function MainBanner() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { data, isError } = useMyProfileQuery({ retry: false });
  const isLogged = useMemo(() => !isError && Boolean(data?.nickname), [data?.nickname, isError]);

  const onClickWriteBanner = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isLogged) return;
    e.preventDefault();
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <div className="w-full mt-[70px] flex gap-[30px]">
        {bannerItems.map((item, index) => (
          <BannerCard
            key={`${item.href}-${index}`}
            {...item}
            onClick={index === 0 ? onClickWriteBanner : undefined}
          />
        ))}
      </div>

      <LoginRequiredModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title="로그인이 필요합니다"
        description="모집글 작성은 로그인 후 이용할 수 있어요."
        confirmText="로그인 하러가기"
        onConfirm={() => {
          setIsLoginModalOpen(false);
          router.push('/login');
        }}
      />
    </>
  );
}
