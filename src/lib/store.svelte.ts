import { Theme, type AppSetting } from "./types";

export let appSetting: AppSetting = $state({
  id: "setting",
  url: "http://localhost:11434",
  currentChat: undefined,
  modelList: [],
  defaultModel: undefined,
  theme: Theme.Media,
});

export type AlertType = "info" | "error";

export let alertMessage: { message: string; type: AlertType } = $state({
  message: "",
  type: "info",
});
