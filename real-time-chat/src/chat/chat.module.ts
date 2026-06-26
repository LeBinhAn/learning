import { Module } from '@nestjs/common';
import { ChatRoom } from './chat-room.service';
import { ChatGateway } from './chat.gateway';
import { ConnectionModule } from '../connection/connection.module';

@Module({
  imports: [ConnectionModule],
  providers: [ChatRoom, ChatGateway],
})
export class ChatModule {}
