import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from "./user.service";
import { Server, Socket } from "socket.io";

@Injectable()
export class ChatService {
  constructor(private readonly userService: UserService) {};

  public sendMessage(server: Server, dto: {message: string; name: string}): void {
    if (!dto.message || !dto.name)
      return;

    server.emit("getMessage", dto);
  };

  public openChat(socket: Socket, server: Server, dto: {inviterName: string; name: string}): void {
    const inviter = this.userService.getUser(dto.inviterName);

    if (!inviter)
      return;

    server.to(inviter).emit("openChat", {name: dto.name});
  };
}
