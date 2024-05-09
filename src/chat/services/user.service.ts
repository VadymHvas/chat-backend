import { Injectable, NotFoundException } from '@nestjs/common';
import { Server, Socket } from "socket.io";
import { NotFoundError } from "rxjs";

@Injectable()
export class UserService {
  private users: Map<string, string> = new Map<string, string>();

  public addUser(socket: Socket, server: Server, name: string): void {
    if (this.users.has(name)) {
      socket.emit("getMe", { error: "Name already in use" });

      return;
    }

    this.users.set(name, socket.id);

    socket.emit("getMe",  { name, id: socket.id });
    server.emit("getUsers", {users: this.getUsers().slice(0, 8).reverse()});
  };

  public inviteUser(server: Server, dto: {name: string; inviterName: string}): void {
    const user = this.users.get(dto.name);
    const inviter = this.users.get(dto.inviterName);

    if (!user)
      return;

    server.to(user).emit("invite", {name: dto.inviterName});
  };

  public getUser(name: string): string {
    return this.users.get(name);
  };

  public getUsers(): string[] {
    return Array.from(this.users.keys());
  };

  public deleteUser(id: string): void {
    for (let [key, value] of this.users.entries()) {
      if (value === id) {
        this.users.delete(key);
        break;
      }
    }
  };
}
