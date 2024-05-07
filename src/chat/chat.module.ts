import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { UserService } from "./services/user.service";
import { ChatGateway } from './gateways/chat.gateway';

@Module({
  providers: [ChatGateway, ChatService, UserService],
})
export class ChatModule {}