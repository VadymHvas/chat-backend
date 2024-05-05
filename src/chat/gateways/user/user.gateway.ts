import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { UserService } from "../../services/user/user.service";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: true
})
export class UserGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private userService: UserService) {};

  @SubscribeMessage("addUser")
  public addUser(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody("name") name: string
  ): void {
    this.userService.addUser(name, socket);

    this.server.emit("getUsers", {users: this.userService.getUsers()});
  };

  public handleDisconnect(client: Socket): void {
    this.userService.deleteUser(client.id);
  };
}
