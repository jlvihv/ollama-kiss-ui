import Dexie, { type Table } from "dexie";
import type { Chat } from "./types";
import { writable } from "svelte/store";

export class ChatDB extends Dexie {
  chats!: Table<Chat>;

  constructor() {
    super("chatDB");
    this.version(1).stores({
      chats: "++id, title, createdAt, updatedAt",
    });
  }
}

export const db = new ChatDB();
