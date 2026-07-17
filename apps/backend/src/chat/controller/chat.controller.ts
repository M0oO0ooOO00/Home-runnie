import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from '@/chat/service';
import { UploadService, UploadedImageMetadata } from '@/upload';
import { CurrentMember } from '@/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CreateChatRoomRequestDto, GetChatRoomsRequestDto } from '@/chat/dto/request';
import {
  ChatRoomResponseDto,
  GetChatRoomsResponseDto,
  ChatRoomMemberResponseDto,
  JoinRequestResponseDto,
} from '@/chat/dto/response';
import {
  CreateChatRoomSwagger,
  GetChatRoomsSwagger,
  UploadChatImagesSwagger,
} from '@/chat/swagger';

const MAX_CHAT_IMAGE_FILES = 4;
const MAX_CHAT_IMAGE_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_CHAT_IMAGE_MIME = /^image\/(png|jpe?g|gif|webp|heic|heif)$/i;

@ApiTags('채팅방')
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly uploadService: UploadService,
  ) {}

  @Post('rooms')
  @CreateChatRoomSwagger
  async createChatRoom(
    @CurrentMember() memberId: number,
    @Body() createChatRoomDto: CreateChatRoomRequestDto,
  ): Promise<ChatRoomResponseDto> {
    return this.chatService.createChatRoom(createChatRoomDto.postId, memberId);
  }

  @Post('rooms/:roomId/images')
  @UploadChatImagesSwagger
  @UseInterceptors(
    FilesInterceptor('files', MAX_CHAT_IMAGE_FILES, {
      limits: { fileSize: MAX_CHAT_IMAGE_FILE_SIZE },
      fileFilter: (_request, file, callback) => {
        if (!ALLOWED_CHAT_IMAGE_MIME.test(file.mimetype)) {
          return callback(new BadRequestException('이미지 파일만 업로드할 수 있습니다.'), false);
        }

        callback(null, true);
      },
    }),
  )
  async uploadChatImages(
    @CurrentMember() memberId: number,
    @Param('roomId', ParseIntPipe) roomId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ files: UploadedImageMetadata[] }> {
    await this.chatService.assertChatRoomMember(roomId, memberId);

    if (!files || files.length === 0) {
      throw new BadRequestException('업로드할 이미지가 없습니다.');
    }

    const uploadedImages = await this.uploadService.uploadImagesWithMetadata(
      memberId,
      files,
      `chat/${roomId}`,
    );

    return { files: uploadedImages };
  }

  @Get('rooms/by-post/:postId')
  async getChatRoomByPostId(@Param('postId', ParseIntPipe) postId: number) {
    const chatRoom = await this.chatService.getChatRoomByPostId(postId);
    return { chatRoomId: chatRoom?.id ?? null };
  }

  @Get('rooms')
  @GetChatRoomsSwagger
  async getMyChatRooms(
    @CurrentMember() memberId: number,
    @Query() query: GetChatRoomsRequestDto,
  ): Promise<GetChatRoomsResponseDto> {
    return this.chatService.getMyChatRooms(memberId, query.page, query.limit);
  }

  @Get('rooms/:roomId/members')
  async getChatRoomMembers(
    @CurrentMember() memberId: number,
    @Param('roomId', ParseIntPipe) roomId: number,
  ): Promise<ChatRoomMemberResponseDto[]> {
    return this.chatService.getChatRoomMembers(roomId, memberId);
  }

  @Post('rooms/:roomId/join-requests')
  async requestJoinChatRoom(
    @CurrentMember() memberId: number,
    @Param('roomId', ParseIntPipe) roomId: number,
  ) {
    return this.chatService.requestJoinChatRoom(roomId, memberId);
  }

  @Get('rooms/:roomId/join-requests')
  async getPendingJoinRequests(
    @CurrentMember() memberId: number,
    @Param('roomId', ParseIntPipe) roomId: number,
  ): Promise<JoinRequestResponseDto[]> {
    return this.chatService.getPendingJoinRequests(roomId, memberId);
  }

  @Patch('join-requests/:requestId/accept')
  async acceptJoinRequest(
    @CurrentMember() memberId: number,
    @Param('requestId', ParseIntPipe) requestId: number,
  ) {
    return this.chatService.acceptJoinRequest(requestId, memberId);
  }

  @Patch('join-requests/:requestId/reject')
  async rejectJoinRequest(
    @CurrentMember() memberId: number,
    @Param('requestId', ParseIntPipe) requestId: number,
  ) {
    return this.chatService.rejectJoinRequest(requestId, memberId);
  }

  @Delete('rooms/:roomId/members/:memberId')
  async kickMember(
    @CurrentMember() hostId: number,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    return this.chatService.kickMember(roomId, memberId, hostId);
  }

  @Delete('rooms/:roomId')
  async deleteChatRoom(
    @CurrentMember() hostId: number,
    @Param('roomId', ParseIntPipe) roomId: number,
  ) {
    return this.chatService.deleteChatRoom(roomId, hostId);
  }
}
