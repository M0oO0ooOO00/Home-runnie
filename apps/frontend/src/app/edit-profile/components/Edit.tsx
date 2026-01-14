'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/shared/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';
import { baseBallTeamItems, Team } from '@homerunnie/shared';
import { Button } from '@/shared/ui/primitives/button';
import { useMyProfileQuery } from '@/hooks/my/useProfileQuery';
import { useMyProfileMutation } from '@/hooks/my/useProfileMutation';

export default function Edit() {
  const router = useRouter();
  const { data: myProfile, isLoading } = useMyProfileQuery();
  const { mutate: updateProfile, isPending } = useMyProfileMutation();

  const [nickname, setNickname] = useState('');
  const [supportTeam, setSupportTeam] = useState<Team | undefined>(undefined);

  useEffect(() => {
    if (myProfile) {
      setNickname(myProfile.nickname);
      setSupportTeam(myProfile.supportTeam || undefined);
    }
  }, [myProfile]);

  const handleSave = () => {
    updateProfile(
      { nickname, supportTeam },
      {
        onSuccess: () => {
          /* TODO: 모달 만들어달라고 하기! */
          alert('프로필이 성공적으로 수정되었습니다.');
          router.push('/my');
        },
        onError: (error) => {
          /* TODO: 모달 만들어달라고 하기! */
          alert(error.message || '프로필 수정에 실패했습니다.');
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen w-full flex items-center justify-center">
        로딩 중...
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-100 min-h-screen w-full flex flex-col items-center px-40 pt-15 pb-20">
        <h1 className="text-t01 font-bold w-full pb-15">마이페이지</h1>
        <div className="flex flex-col rounded-[20px] border p-[30px] gap-[10px] bg-white shadow-md w-full mb-10">
          <div className="flex mt-0 mb-4 border-b">
            <div className="flex items-center gap-4 mb-6 w-full">
              {/* 프로필 이미지 */}
              <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/images/pink.png"
                  alt="유저"
                  width={68}
                  height={68}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <span className="text-sm text-gray-500">닉네임</span>
                <Input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="닉네임을 입력하세요"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2 w-full ">
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-b01 text-gray-600 font-weight-r">응원하는 팀</p>
              <Select value={supportTeam} onValueChange={(value) => setSupportTeam(value as Team)}>
                <SelectTrigger className="w-full focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="팀 선택" />
                </SelectTrigger>
                <SelectContent className="shadow-md">
                  {baseBallTeamItems.map((team) => (
                    <SelectItem
                      key={team.value}
                      value={team.value}
                      className="data-[state=checked]:text-black text-gray-400"
                    >
                      {team.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <p className="text-b01 text-gray-600 font-weight-r">로그인 방법</p>
              <Image
                src="/icons/kakao_login.svg"
                alt="카카오"
                width={68}
                height={68}
                className="cursor-pointer"
              />
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <p className="text-b01 text-gray-600 font-weight-r">누적 경고 횟수</p>
              <p className="text-t04 font-weight-r leading-140">
                {String(myProfile?.warnCount || 0).padStart(2, '0')}
              </p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <p className="text-b01 text-gray-600 font-weight-r">활동상태</p>
              <p className="text-t04 font-weight-r leading-140 text-main-green">
                {myProfile?.accountStatus === 'ACTIVE' ? '활동중' : '활동중지'}
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="w-[310px] h-[70px] self-end py-[20px] px-[180px] gap-2.5 cursor-pointer"
        >
          <span className="text-b01 font-weight-sb leading-150">
            {isPending ? '저장 중...' : '저장하기'}
          </span>
        </Button>
      </div>
    </>
  );
}
