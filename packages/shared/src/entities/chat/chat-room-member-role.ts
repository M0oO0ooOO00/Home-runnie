export enum ChatRoomMemberRole {
  HOST = 'HOST',
  MEMBER = 'MEMBER',
}

export const ChatRoomMemberRoleDescription = {
  [ChatRoomMemberRole.HOST]: '방장',
  [ChatRoomMemberRole.MEMBER]: '멤버',
} as const;
