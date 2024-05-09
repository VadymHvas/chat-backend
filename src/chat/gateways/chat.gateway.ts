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
    this.userService.addUser(socket, this.server, name);
  };

  @SubscribeMessage("sendMessage")
  public sendMessage(
    @MessageBody() dto: {message: string; name: string},
  ): void {
    this.chatService.sendMessage(this.server, dto);
  };

  @SubscribeMessage("openChat")
  public openChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: {inviterName: string, name: string}
  ): void {
    this.chatService.openChat(socket, this.server, dto);
  };

  @SubscribeMessage("inviteUser")
  public inviteUser(
    @MessageBody() dto: {name: string; inviterName: string}
  ): void {
    this.userService.inviteUser(this.server, dto);
  };

  public handleDisconnect(client: Socket): void {
    this.userService.deleteUser(client.id);

    this.server.emit("getUsers", {users: this.userService.getUsers().slice(0, 8).reverse()});
  };
}
