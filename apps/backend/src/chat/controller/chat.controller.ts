import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from '@/chat/service';
import { CurrentMember } from '@/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CreateChatRoomRequestDto, GetChatRoomsRequestDto } from '@/chat/dto/request';
import { ChatRoomResponseDto, GetChatRoomsResponseDto } from '@/chat/dto/response';
import { CreateChatRoomSwagger, GetChatRoomsSwagger } from '@/chat/swagger';

@ApiTags('채팅방')
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('rooms')
  @CreateChatRoomSwagger
  async createChatRoom(
    @CurrentMember() memberId: number,
    @Body() createChatRoomDto: CreateChatRoomRequestDto,
  ): Promise<ChatRoomResponseDto> {
    return this.chatService.createChatRoom(createChatRoomDto.postId, memberId);
  }

  @Get('rooms')
  @GetChatRoomsSwagger
  async getMyChatRooms(
    @CurrentMember() memberId: number,
    @Query() query: GetChatRoomsRequestDto,
  ): Promise<GetChatRoomsResponseDto> {
    return this.chatService.getMyChatRooms(memberId, query.page, query.limit);
  }
}
