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
import { useMyProfileProtectedQuery } from '@/hooks/my/useProfileQuery';
import { useMyProfileMutation } from '@/hooks/my/useProfileMutation';
import LoginRequiredModal from '@/shared/ui/modal/LoginRequiredModal';
import { AuthenticationError } from '@/lib/fetchClient';

export default function Edit() {
  const router = useRouter();
  const { data: myProfile, isLoading } = useMyProfileProtectedQuery();
  const { mutate: updateProfile, isPending } = useMyProfileMutation();

  const [nickname, setNickname] = useState('');
  const [supportTeam, setSupportTeam] = useState<Team | undefined>(undefined);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmText: '확인',
    action: () => setModalState((prev) => ({ ...prev, isOpen: false })),
  });

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
          setModalState({
            isOpen: true,
            title: '저장 완료',
            description: '프로필이 성공적으로 수정되었습니다.',
            confirmText: '마이페이지로 이동',
            action: () => {
              setModalState((prev) => ({ ...prev, isOpen: false }));
              router.push('/my');
            },
          });
        },
        onError: (error) => {
          if (error instanceof AuthenticationError) {
            setModalState({
              isOpen: true,
              title: '로그인이 필요합니다',
              description: '로그인 후 프로필을 수정할 수 있어요.',
              confirmText: '로그인 하러가기',
              action: () => {
                setModalState((prev) => ({ ...prev, isOpen: false }));
                router.push('/login');
              },
            });
            return;
          }

          setModalState({
            isOpen: true,
            title: '저장 실패',
            description: error.message || '프로필 수정에 실패했습니다.',
            confirmText: '확인',
            action: () => setModalState((prev) => ({ ...prev, isOpen: false })),
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
        로딩 중...
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 px-5 pb-10 pt-8 lg:px-40 lg:pb-20 lg:pt-15">
        <h1 className="text-t03-b w-full pb-8 font-bold lg:pb-15 lg:text-t01">마이페이지</h1>
        <div className="mb-8 flex w-full flex-col gap-[10px] rounded-[20px] border bg-white p-5 shadow-md lg:mb-10 lg:p-[30px]">
          <div className="mb-4 mt-0 flex border-b">
            <div className="mb-6 flex w-full min-w-0 items-center gap-4">
              {/* 프로필 이미지 */}
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-pink-500 lg:h-[68px] lg:w-[68px]">
                <Image
                  src="/images/pink.png"
                  alt="유저"
                  width={68}
                  height={68}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="text-sm text-gray-500">닉네임</span>
                <Input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="min-w-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="닉네임을 입력하세요"
                />
              </div>
            </div>
          </div>
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-2">
            <div className="flex min-w-0 flex-col gap-2">
              <p className="font-weight-r text-b02-r text-gray-600 lg:text-b01">응원하는 팀</p>
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
            <div className="flex min-w-0 flex-col items-start gap-2 sm:items-center">
              <p className="font-weight-r text-b02-r text-gray-600 lg:text-b01">로그인 방법</p>
              <Image
                src="/icons/kakao_login.svg"
                alt="카카오"
                width={68}
                height={68}
                className="h-14 w-14 cursor-pointer lg:h-[68px] lg:w-[68px]"
              />
            </div>
            <div className="flex min-w-0 flex-col items-start gap-2 sm:items-center">
              <p className="font-weight-r text-b02-r text-gray-600 lg:text-b01">누적 경고 횟수</p>
              <p className="font-weight-r text-t04 leading-140">
                {String(myProfile?.warnCount || 0).padStart(2, '0')}
              </p>
            </div>
            <div className="flex min-w-0 flex-col items-start gap-2 sm:items-center">
              <p className="font-weight-r text-b02-r text-gray-600 lg:text-b01">활동상태</p>
              <p className="font-weight-r text-t04 leading-140 text-main-green">
                {myProfile?.accountStatus === 'ACTIVE' ? '활동중' : '활동중지'}
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="h-14 w-full cursor-pointer gap-2.5 self-stretch py-4 sm:w-[310px] sm:self-end lg:h-[70px] lg:py-[20px]"
        >
          <span className="text-b01 font-weight-sb leading-150">
            {isPending ? '저장 중...' : '저장하기'}
          </span>
        </Button>
      </div>
      <LoginRequiredModal
        open={modalState.isOpen}
        onOpenChange={(open) => setModalState((prev) => ({ ...prev, isOpen: open }))}
        title={modalState.title}
        description={modalState.description}
        confirmText={modalState.confirmText}
        onConfirm={modalState.action}
      />
    </>
  );
}
