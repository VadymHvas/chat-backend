import { WebSocketGateway } from '@nestjs/websockets';
import { ChatService } from '../../services/chat/chat.service';

@WebSocketGateway({
  cors: true
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
}
