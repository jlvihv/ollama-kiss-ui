import { appState } from "./store.svelte";
import type { ModelInfo } from "./types";

export async function fetchModels(): Promise<ModelInfo[]> {
  try {
    const response = await fetch(`${appState.url}/api/tags`);
    const data = await response.json();
    return data.models;
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
}
