'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { ChatRoomMemberRole, ChatRoomMemberResponse } from '@homerunnie/shared';
import { getChatRoomMembers, kickMember, deleteChatRoom } from '@/apis/chat/chat';
import { useRouter } from 'next/navigation';

interface ChatInfoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: () => void;
  title: string;
  participants: string;
  matchDate: string;
  matchTeam: string;
  role?: ChatRoomMemberRole;
  roomId: string;
}

const ChatInfoSidebar = ({
  isOpen,
  onClose,
  onReport,
  title,
  matchDate,
  matchTeam,
  role,
  roomId,
}: ChatInfoSidebarProps) => {
  const router = useRouter();
  const [members, setMembers] = useState<ChatRoomMemberResponse[]>([]);
  const isHost = role === ChatRoomMemberRole.HOST;

  useEffect(() => {
    if (!isOpen) return;

    const fetchMembers = async () => {
      try {
        const data = await getChatRoomMembers(Number(roomId));
        setMembers(data);
      } catch (error) {
        console.error('멤버 목록 조회 실패:', error);
      }
    };
    fetchMembers();
  }, [isOpen, roomId]);

  const handleKick = async (memberId: number) => {
    if (!confirm('해당 멤버를 강퇴하시겠습니까?')) return;
    try {
      await kickMember(Number(roomId), memberId);
      setMembers((prev) => prev.filter((m) => m.memberId !== memberId));
    } catch (error) {
      console.error('강퇴 실패:', error);
    }
  };

  const handleDeleteRoom = async () => {
    if (!confirm('채팅방을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    try {
      await deleteChatRoom(Number(roomId));
      router.push('/chat');
    } catch (error) {
      console.error('채팅방 삭제 실패:', error);
    }
  };

  const handleLeaveRoom = () => {
    // TODO: 채팅방 나가기 로직 구현
    console.log('채팅방 나가기');
  };

  const hostMember = members.find((m) => m.role === ChatRoomMemberRole.HOST);
  const regularMembers = members.filter((m) => m.role !== ChatRoomMemberRole.HOST);

  return (
    <div
      className={`h-full bg-white border-l border-gray-200 shadow-lg shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'w-96' : 'w-0 border-0'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center px-[20px] py-[16px] border-b border-gray-200">
          <h2 className="text-t01-sb">상세정보</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div>
            <div className="text-b02-r flex flex-col py-[30px] px-5 gap-[16px]">
              <div className="flex items-center gap-2">
                <h3 className="text-gray-500 w-20">경기날짜</h3>
                <p className="text-gray-900">{matchDate}</p>
              </div>

              <div className="flex items-center gap-2">
                <h3 className="text-gray-500 w-20">경기팀</h3>
                <p className="text-gray-900">{matchTeam}</p>
              </div>
            </div>

            <div className="py-[30px] px-5 border-[1px]">
              <div className="flex items-center justify-between mb-[22px]">
                <h3 className="text-t04-sb text-gray-900">참여자</h3>
                <span className="text-b03-r text-gray-700">{members.length}명</span>
              </div>

              {/* 방장 */}
              {hostMember && (
                <div className="mb-[36px]">
                  <p className="text-b03-r text-gray-600 mb-[8px]">방장</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-pink-200 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-b02-r text-gray-600">{hostMember.nickname}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 멤버 목록 */}
              <div className="space-y-3">
                {regularMembers.map((member) => (
                  <div key={member.memberId} className="flex items-center gap-[20px]">
                    <div className="w-9 h-9 rounded-full bg-pink-200 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-b02-r text-gray-900">{member.nickname}</p>
                    </div>
                    {isHost && (
                      <button
                        onClick={() => handleKick(member.memberId)}
                        className="text-b03-r text-red-400 hover:text-red-500 transition-colors"
                      >
                        강퇴
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-gray-200 py-[15px] px-[20px]">
          <button
            onClick={onReport}
            className="w-full text-right text-b02-r text-gray-900 hover:text-gray-800 transition-colors mb-[8px]"
          >
            신고하기
          </button>
          {isHost ? (
            <button
              onClick={handleDeleteRoom}
              className="w-full text-right text-b02-r text-red-500 hover:text-red-600 transition-colors"
            >
              채팅방 삭제
            </button>
          ) : (
            <button
              onClick={handleLeaveRoom}
              className="w-full text-right text-b02-r text-red-500 hover:text-gray-800 transition-colors"
            >
              채팅방 나가기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInfoSidebar;
