import { Module } from '@nestjs/common';
import { ChatGateway } from '@/chat/chat.gateway';
import { ChatService } from '@/chat/service';
import { ChatRepository } from '@/chat/repository';
import { ChatController } from '@/chat/controller';
import { DbModule } from '@/common/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, ChatRepository],
  exports: [ChatService],
})
export class ChatModule {}
