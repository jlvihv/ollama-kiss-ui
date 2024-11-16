import { alertMessage, appSetting } from "./store.svelte";
import type { ModelInfo } from "./types";

export async function fetchModels(): Promise<ModelInfo[]> {
  try {
    const response = await fetch(`${appSetting.url}/api/tags`);
    const data = await response.json();
    return data.models;
  } catch (error) {
    alertMessage.message = "Error fetching models";
    console.error("Error fetching models:", error);
    return [];
  }
}
