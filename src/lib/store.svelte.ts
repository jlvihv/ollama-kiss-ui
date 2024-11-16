import type { AppSetting } from "./types";

export let appSetting: AppSetting = $state({
  id: "setting",
  url: "http://localhost:11434",
  currentChat: undefined,
  modelList: [],
  defaultModel: undefined,
});

export let alertMessage: { message: string } = $state({ message: "" });
