export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Chat {
  id?: number;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model: string;
}

export interface ModelInfo {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface AppSetting {
  id: string;
  url: string;
  defaultModel: ModelInfo | undefined;
  currentChat: Chat | undefined;
  modelList: ModelInfo[];
}

export interface AppSettingDB {
  id: string;
  url: string;
  defaultModel: ModelInfo | undefined;
}
