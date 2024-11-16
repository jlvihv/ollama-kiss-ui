import Dexie, { type Table } from "dexie";
import type { AppSettingDB, Chat } from "./types";

export class ChatDB extends Dexie {
  chats!: Table<Chat>;
  setting!: Table<AppSettingDB>;

  constructor() {
    super("chatDB");
    this.version(1).stores({
      chats: "++id, title, createdAt, updatedAt",
      setting: "id",
    });
  }
}

export const db = new ChatDB();
