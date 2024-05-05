import { Module } from '@nestjs/common';
import { ChatService } from './services/chat/chat.service';
import { ChatGateway } from './gateways/chat/chat.gateway';
import { UserGateway } from "./gateways/user/user.gateway";
import { UserService } from "./services/user/user.service";

@Module({
  providers: [ChatGateway, ChatService, UserGateway, UserService],
})
export class ChatModule {}