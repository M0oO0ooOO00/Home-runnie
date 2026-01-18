import { Module } from '@nestjs/common';
import { ChatGateway } from '@/chat/chat.gateway';
import { ChatService } from '@/chat/service';
import { ChatRepository } from '@/chat/repository';
import { ChatController } from '@/chat/controller';

@Module({
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, ChatRepository],
  exports: [ChatService],
})
export class ChatModule {}
