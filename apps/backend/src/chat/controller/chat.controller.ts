import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ChatService } from '@/chat/service';
import { CurrentMember } from '@/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CreateChatRoomRequestDto, GetChatRoomsRequestDto } from '@/chat/dto/request';
import { ChatRoomResponseDto, GetChatRoomsResponseDto } from '@/chat/dto/response';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('rooms')
  async createChatRoom(
    @CurrentMember() memberId: number,
    @Body() createChatRoomDto: CreateChatRoomRequestDto,
  ): Promise<ChatRoomResponseDto> {
    return await this.chatService.createChatRoom(createChatRoomDto.postId, memberId);
  }

  @Get('rooms')
  async getMyChatRooms(
    @CurrentMember() memberId: number,
    @Query() query: GetChatRoomsRequestDto,
  ): Promise<GetChatRoomsResponseDto> {
    return await this.chatService.getMyChatRooms(memberId, query.page, query.limit);
  }
}
