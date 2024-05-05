import { Injectable } from '@nestjs/common';
import { Socket } from "socket.io";

@Injectable()
export class UserService {
  private users: Map<string, string> = new Map<string, string>();

  public addUser(name: string, socket: Socket): void {
    if (this.users.has(name)) {
      socket.emit("getMe", { error: "Name already in use" });

      return;
    }

    this.users.set(name, socket.id);

    const onlineUsers: string[] = Array.from(this.users.keys());

    console.log(onlineUsers)

    socket.emit("getMe",  { name, id: socket.id });
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
