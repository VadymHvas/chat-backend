import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserService } from "../services/user.service";
import { ChatService } from "../services/chat.service";

@WebSocketGateway({
  cors: true,
})
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer() private server: Server;

  constructor(private userService: UserService, private chatService: ChatService) {};

  @SubscribeMessage("addUser")
  public addUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody("name") name: string
  ): void {
    this.userService.addUser(name, socket);

    this.server.emit("getUsers", {users: this.userService.getUsers().slice(0, 8).reverse()});
  };

  @SubscribeMessage("sendMessage")
  public sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: {message: string; name: string},
  ): void {
    this.chatService.sendMessage(dto, this.server);
  };

  public handleDisconnect(client: Socket): void {
    this.userService.deleteUser(client.id);

    this.server.emit("getUsers", {users: this.userService.getUsers().slice(0, 8).reverse()});
  };
}
