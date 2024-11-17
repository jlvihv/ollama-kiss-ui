import { alertMessage, appSetting } from "./store.svelte";
import type { ModelInfo } from "./types";

export async function setupOllamaCors() {
  // 如果不是在扩展环境中，直接返回
  if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.id)
    return;

  try {
    const domain = new URL(appSetting.url).hostname;
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: [
        {
          id: 1,
          condition: { requestDomains: [domain] },
          action: {
            type: "modifyHeaders",
            requestHeaders: [
              {
                header: "origin",
                operation: "set",
                value: `http://${domain}`,
              },
            ],
          },
        },
      ],
    });
  } catch (error) {
    console.error("Failed to setup CORS rules:", error);
  }
}

export async function fetchModels(): Promise<ModelInfo[]> {
  try {
    const response = await fetch(`${appSetting.url}/api/tags`);
    const data = await response.json();
    return data.models;
  } catch (error) {
    alertMessage.message = "Error fetching models";
    alertMessage.type = "error";
    console.error("Error fetching models:", error);
    return [];
  }
}
