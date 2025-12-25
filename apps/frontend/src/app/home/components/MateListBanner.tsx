import Link from 'next/link';
import MateItem from './MateItem';

const dummyMateList = [
  { id: 1, match: '한화 vs 두산', title: '나랑 직관 갈 사람', date: '7/28' },
  { id: 2, match: '롯데 vs LG', title: '사직에서 같이 응원해요', date: '7/29' },
  { id: 3, match: 'KIA vs 삼성', title: '광주 챔피언스 필드 동행 구함', date: '7/30' },
  { id: 4, match: 'SSG vs 키움', title: '고척돔에서 만나요!', date: '7/31' },
  { id: 5, match: 'NC vs KT', title: '수원 경기 보러 갈 분', date: '8/1' },
];

export default function MateListBanner() {
  return (
    <div className="w-full flex flex-col gap-[20px]">
      <div className="flex justify-between">
        <h1 className="text-t02-sb">나의 직관 메이트를 찾아보세요!</h1>
        <Link href="/home" className="text-[#0ABF00] mt-[16px] text-b02-r">
          전체보기
        </Link>
      </div>
      <div className="w-full flex flex-col">
        <div className="bg-gray-100 px-[40px] py-[20px] rounded-t-2xl">
          <div className="flex justify-between text-b02-r text-gray-600">
            <div className="flex items-center gap-10">
              <p className="w-[120px]">경기</p>
              <p>제목</p>
            </div>
            <p>경기 날짜</p>
          </div>
        </div>
        {dummyMateList.map((item, index) => (
          <MateItem key={item.id} {...item} isLast={index === dummyMateList.length - 1} />
        ))}
      </div>
    </div>
  );
}
