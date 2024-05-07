import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from "./user.service";
import { Server } from "socket.io";

@Injectable()
export class ChatService {
  constructor(private readonly userService: UserService) {};

  public sendMessage(dto: {message: string; name: string}, server: Server): void {
    if (!dto.message || !dto.name)
      throw new BadRequestException();

    server.emit("getMessage", dto);
  };
}
