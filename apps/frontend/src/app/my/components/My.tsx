import Link from 'next/link';
import Image from 'next/image';

export default function My() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen w-full flex flex-col items-center px-40 pt-15 pb-20">
        <h1 className="text-t01 font-bold w-full pb-15">마이페이지</h1>
        <div className="flex flex-col rounded-[20px] border p-[30px] gap-[10px] bg-white shadow-md w-full mb-10">
          <div className="flex justify-between mt-0 mb-4 border-b">
            <div className="flex items-center gap-4 mb-6">
              {/* 프로필 이미지 */}
              <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center">
                <Image
                  src="/images/pink.png"
                  alt="유저"
                  width={68}
                  height={68}
                  className="cursor-pointer"
                  // onClick={() => {/* 클릭 핸들러 */}}
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-500">닉네임</span>
                <span className="text-lg font-semibold">윤창현</span>
              </div>
            </div>
            <Link href="/edit-profile" className="text-gray-700">
              프로필 수정하기
            </Link>
          </div>
          <div className="flex flex-row gap-2 w-full ">
            {/*응원하는 팀, 로그인 방법, 누적 경고 횟수, 활동상태*/}
            <div className="flex-1 flex flex-col items-center gap-2">
              <p className="text-b01 text-gray-600 font-weight-r">응원하는 팀</p>
              {/* TODO: 각 야구팀의 사진과 이름 불러오기 */}
              {/*<Image*/}
              {/*    src="/icons/kakao_icon.svg"*/}
              {/*    alt="카카오"*/}
              {/*    width={68}*/}
              {/*    height={68}*/}
              {/*    className="cursor-pointer p-4"*/}
              {/*    // onClick={() => /!* 클릭 핸들러 *!/}*/}
              {/*/>*/}
              <div className="w-18 h-18 bg-gray-200 rounded-2xl"></div>
              <p className="font-weight-r text-b01 leading-150">한화 이글스</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <p className="text-b01 text-gray-600 font-weight-r">로그인 방법</p>
              {/* TODO: 추후 카카오 이미지 수정 */}
              <Image
                src="/icons/kakao_login.svg"
                alt="로그인 방법"
                width={68}
                height={68}
                className="cursor-pointer"
                // onClick={() => {/* 클릭 핸들러 */}}
              />
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <p className="text-b01 text-gray-600 font-weight-r">누적 경고 횟수</p>
              <p className="text-t04 font-weight-r leading-140">03</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <p className="text-b01 text-gray-600 font-weight-r">활동상태</p>
              <p className="text-t04 font-weight-r leading-140 text-main-green">활동중</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col rounded-[20px] border py-[30px] px-[6px] gap-[10px] bg-white shadow-md w-full mb-10">
          {/* 콘텐츠 */}
          <div className="flex flex-row gap-3 py-[4px] px-[30px] hover:bg-gray-50 cursor-pointer">
            <Image src="/icons/bookmark.svg" alt="스크랩 한 모집글" width={30} height={30} />
            <p className="font-weight-m text-b01 leading-150">스크랩 한 모집글</p>
          </div>
          <div className="flex flex-row  gap-3 py-[4px] px-[30px] hover:bg-gray-50 cursor-pointer">
            <Image src="/icons/pen.svg" alt="내가 작성한 모집글" width={30} height={30} />
            <p className="font-weight-m text-b01 leading-150">내가 작성한 모집글</p>
          </div>
          <div className="flex flex-row  gap-3 py-[4px] px-[30px] hover:bg-gray-50 cursor-pointer">
            <Image
              src="/images/default.png"
              alt="내가 참여한 글"
              width={30}
              height={30}
              // onClick={() => {/* 클릭 핸들러 */}}
            />
            <p className="font-weight-m text-b01 leading-150">내가 참여한 글</p>
          </div>
        </div>
      </div>
    </>
  );
}
