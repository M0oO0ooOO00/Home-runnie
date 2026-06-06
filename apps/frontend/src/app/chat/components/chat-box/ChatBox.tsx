'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatInfo from './ChatInfo';
import ChatInput from './ChatInput';
import ChatMessageList from './ChatMessageList';
import ChatInfoSidebar from '../sidebar/ChatInfoSidebar';
import JoinRequestMenu from '../join-request/JoinRequestMenu';
import ReportModal, { ReportParticipant } from '@/shared/ui/modal/ReportModal';
import { MemberProfileModal } from '@/shared/ui/modal';
import { useChatRooms } from '@/stores/ChatRoomsContext';
import { ChatRoomResponse, ChatRoomMemberRole } from '@homerunnie/shared';
import { useChatMessages } from '@/hooks/chat/useChatMessages';
import { useChatRoomEvents } from '@/hooks/chat/useChatRoomEvents';
import { useChatRoomOverlays } from '@/hooks/chat/useChatRoomOverlays';
import { useChatRoomMembersQuery } from '@/hooks/chat/useChatQuery';
import { formatKoreanDate, formatTeamName } from '@/lib/format';

interface RoomInfo {
  title: string;
  matchDate: string;
  matchTeam: string;
  role: ChatRoomMemberRole;
}

const createRoomInfo = (room: ChatRoomResponse): RoomInfo => ({
  title: room.postTitle,
  matchDate: room.gameDate ? formatKoreanDate(new Date(room.gameDate)) : '-',
  matchTeam:
    room.teamHome && room.teamAway
      ? `${formatTeamName(room.teamHome)} vs ${formatTeamName(room.teamAway)}`
      : '-',
  role: room.role,
});

const FALLBACK_ROOM_INFO: RoomInfo = {
  title: '알 수 없는 방',
  matchDate: '-',
  matchTeam: '-',
  role: ChatRoomMemberRole.MEMBER,
};

const ChatBox = ({ roomId }: { roomId: string }) => {
  const router = useRouter();
  const chatRoomsMap = useChatRooms();
  const overlays = useChatRoomOverlays();

  const { messages, sendMessage, connected } = useChatMessages(roomId);
  const { joinRequestCount, resetJoinRequestCount, kickedFromRoom, roomDeleted } =
    useChatRoomEvents(roomId);

  const { data: members = [] } = useChatRoomMembersQuery(Number(roomId));

  const reportParticipants: ReportParticipant[] = members.map((m) => ({
    memberId: m.memberId,
    nickname: m.nickname,
  }));

  const roomResponse = chatRoomsMap.get(roomId);
  const roomInfo = roomResponse ? createRoomInfo(roomResponse) : FALLBACK_ROOM_INFO;
  const chatContentClassName = overlays.sidebar.isOpen ? 'px-4 lg:px-[30px]' : 'px-4 lg:px-8';
  const isHost = roomInfo.role === ChatRoomMemberRole.HOST;

  useEffect(() => {
    if (kickedFromRoom || roomDeleted) {
      alert(kickedFromRoom ? '채팅방에서 강퇴되었습니다.' : '채팅방이 삭제되었습니다.');
      router.push('/chat');
    }
  }, [kickedFromRoom, roomDeleted, router]);

  return (
    <div className="flex flex-row h-full w-full bg-gray-100 relative">
      <div className="flex flex-col h-full flex-1 min-w-0 transition-all duration-300 ease-in-out">
        <ChatInfo
          title={roomInfo.title}
          matchDate={roomInfo.matchDate}
          matchTeam={roomInfo.matchTeam}
          sidebar={{
            isOpen: overlays.sidebar.isOpen,
            onToggle: overlays.sidebar.toggle,
          }}
          actions={
            isHost ? (
              <JoinRequestMenu
                roomId={roomId}
                count={joinRequestCount}
                onOpen={resetJoinRequestCount}
              />
            ) : null
          }
        />
        <section className="flex flex-col flex-1 min-h-0 pb-6 transition-all duration-300 ease-in-out">
          <ReportModal
            isOpen={overlays.report.isOpen}
            onClose={overlays.report.close}
            participants={reportParticipants}
          />

          <ChatMessageList
            messages={messages}
            connected={connected}
            contentClassName={chatContentClassName}
            onProfileClick={overlays.profile.open}
          />

          <div className={`shrink-0 ${chatContentClassName}`}>
            <ChatInput onSend={sendMessage} />
          </div>
        </section>
      </div>

      <ChatInfoSidebar
        isOpen={overlays.sidebar.isOpen}
        onClose={overlays.sidebar.close}
        onReport={overlays.report.open}
        matchDate={roomInfo.matchDate}
        matchTeam={roomInfo.matchTeam}
        role={roomInfo.role}
        roomId={roomId}
      />

      <MemberProfileModal
        isOpen={overlays.profile.isOpen}
        onClose={overlays.profile.close}
        nickname={overlays.profile.target?.nickname ?? ''}
        supportTeam={overlays.profile.target?.supportTeam ?? null}
      />
    </div>
  );
};

export default ChatBox;
