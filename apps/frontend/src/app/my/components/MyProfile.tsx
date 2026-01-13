'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMyProfileQuery } from '@/hooks/my/useProfileQuery';
import { Team, TeamDescription } from '@homerunnie/shared';

export default function MyProfile() {
  const { data: myProfile, isLoading } = useMyProfileQuery();

  return (
    <div className="flex flex-col rounded-[20px] border p-[30px] gap-[10px] bg-white shadow-md w-full mb-10 min-h-[220px] justify-center">
      {isLoading ? (
        <div className="flex items-center justify-center text-gray-400 font-medium">
          {/* 추후 로딩 스피너 or 스켈레톤 ui 입히기 */}
          로딩 중...
        </div>
      ) : (
        <>
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
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-500">닉네임</span>
                <span className="text-lg font-semibold">{myProfile?.nickname || '-'}</span>
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
              <div className="w-18 h-18 bg-gray-200 rounded-2xl"></div>
              <p className="font-weight-r text-b01 leading-150">
                {myProfile?.supportTeam ? TeamDescription[myProfile.supportTeam] : '-'}
              </p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <p className="text-b01 text-gray-600 font-weight-r">로그인 방법</p>
              <Image
                src="/icons/kakao_login.svg"
                alt="로그인 방법"
                width={68}
                height={68}
                className="cursor-pointer"
              />
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <p className="text-b01 text-gray-600 font-weight-r">누적 경고 횟수</p>
              <p className="text-t04 font-weight-r leading-140">{myProfile?.warnCount || 0}</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <p className="text-b01 text-gray-600 font-weight-r">활동상태</p>
              <p className="text-t04 font-weight-r leading-140 text-main-green">
                {myProfile?.accountStatus === 'ACTIVE' ? '활동중' : '활동중지'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
