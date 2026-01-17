export enum ChatRoomMemberRoleEnum {
  HOST = 'HOST',
  MEMBER = 'MEMBER',
}

export const ChatRoomMemberRoleDescription = {
  [ChatRoomMemberRoleEnum.HOST]: '방장',
  [ChatRoomMemberRoleEnum.MEMBER]: '멤버',
} as const;
