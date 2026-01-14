import Image from 'next/image';

export default function MyContents() {
  return (
    <div className="flex flex-col rounded-[20px] border py-[30px] px-[6px] gap-[10px] bg-white shadow-md w-full mb-10">
      {/* 콘텐츠 */}
      <div className="flex flex-row gap-3 py-[4px] px-[30px] hover:bg-gray-50 cursor-pointer">
        <Image src="/icons/bookmark.svg" alt="스크랩 한 모집글" width={30} height={30} />
        <p className="font-weight-m text-b01 leading-150">스크랩 한 모집글</p>
      </div>
      <div className="flex flex-row gap-3 py-[4px] px-[30px] hover:bg-gray-50 cursor-pointer">
        <Image src="/icons/pen.svg" alt="내가 작성한 모집글" width={30} height={30} />
        <p className="font-weight-m text-b01 leading-150">내가 작성한 모집글</p>
      </div>
      <div className="flex flex-row gap-3 py-[4px] px-[30px] hover:bg-gray-50 cursor-pointer">
        <Image src="/images/default.png" alt="내가 참여한 글" width={30} height={30} />
        <p className="font-weight-m text-b01 leading-150">내가 참여한 글</p>
      </div>
    </div>
  );
}
