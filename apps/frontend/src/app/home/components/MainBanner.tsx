import BannerCard from './BannerCard';

const bannerItems = [
  {
    href: '/home',
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
  return (
    <div className="w-full mt-[70px] flex gap-[30px]">
      {bannerItems.map((item) => (
        <BannerCard key={item.href} {...item} />
      ))}
    </div>
  );
}
