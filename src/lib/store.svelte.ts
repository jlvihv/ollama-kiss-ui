import type { Chat, ModelInfo } from "./types";

export let appState: {
  url: string;
  currentChat: Chat | undefined;
  modelList: ModelInfo[];
} = $state({
  url: "http://localhost:11434",
  currentChat: undefined,
  modelList: [],
});
