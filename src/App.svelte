<script lang="ts">
  import hljs from "highlight.js";
  import "highlight.js/styles/atom-one-dark.css";
  import { onDestroy, onMount } from "svelte";
  import { db } from "./lib/db";
  import {
    MAX_CONTEXT_MESSAGES,
    Theme,
    type Chat,
    type Message,
    type ModelInfo,
  } from "./lib/types";
  import { alertMessage, appSetting } from "./lib/store.svelte";
  import { marked } from "marked";
  import DOMPurify from "dompurify";
  import { fetchModels, setupOllamaCors } from "./lib/fetch";
  import Alert from "./lib/Alert.svelte";
  import ClipboardJS from "clipboard";

  // 状态管理
  let message = $state("");
  let chats: Chat[] = $state([]);
  let loading = $state(false);
  let inputRef: HTMLTextAreaElement | undefined = $state();
  let abortController: AbortController | null = $state(null);
  let debounceTimer: number | null = $state(null);
  let clipboard: ClipboardJS | undefined = $state();

  // 初始化
  onMount(async () => {
    try {
      await initializeApp();
    } catch (error: unknown) {
      alertMessage.message = `Failed to initialize app: ${getErrorMessage(error)}`;
      alertMessage.type = "error";
    }
  });

  onDestroy(() => {
    if (clipboard) {
      clipboard.destroy();
    }
  });

  async function initializeApp() {
    await loadSettings();
    await setupOllamaCors();
    await loadModels();
    await loadChats();
    initClipboard();
  }

  async function loadSettings() {
    const setting = await db.setting.get("setting");
    if (setting) {
      const { defaultModel, url, theme } = setting;
      appSetting.defaultModel = defaultModel ?? appSetting.defaultModel;
      appSetting.url = url ?? appSetting.url;
      appSetting.theme = theme ?? appSetting.theme;
      document.documentElement.setAttribute("data-theme", appSetting.theme);
    }
  }

  async function loadModels() {
    appSetting.modelList = await fetchModels();
    if (
      !appSetting.modelList.some(
        (model) => model.name === appSetting.defaultModel?.name,
      )
    ) {
      appSetting.defaultModel = appSetting.modelList[0];
    }
  }

  async function loadChats() {
    chats = await db.chats.orderBy("updatedAt").reverse().toArray();
    if (chats.length === 0) {
      await createNewChat();
    } else {
      appSetting.currentChat = chats[0];
    }
  }

  function initClipboard() {
    // 初始化 ClipboardJS
    clipboard = new ClipboardJS(".copy-button", {
      text: function (trigger) {
        // 获取对应的代码内容
        const wrapper = trigger.closest(".code-block-wrapper");
        const code = wrapper?.querySelector("code");
        return code?.textContent || "";
      },
    });

    // 复制成功的反馈
    clipboard.on("success", (e) => {
      const button = e.trigger as HTMLButtonElement;
      const originalText = button.textContent;
      button.textContent = "Copied!";
      button.disabled = true;

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);

      // 清除选中状态
      e.clearSelection();
    });

    // 复制失败的处理
    clipboard.on("error", (e) => {
      const button = e.trigger as HTMLButtonElement;
      button.textContent = "Failed!";
      console.error("Copy failed:", e.action);

      setTimeout(() => {
        button.textContent = "Copy";
      }, 2000);
    });
  }

  // 聊天相关功能
  async function createNewChat() {
    const newChat: Chat = {
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      model: appSetting.defaultModel?.name || "qwen2.5",
    };

    await db.chats.add(newChat);
    chats = await db.chats.orderBy("updatedAt").reverse().toArray();
    appSetting.currentChat = chats[0];
    inputRef?.focus();
  }

  async function sendMessage() {
    if (!message.trim() || !appSetting.currentChat || loading) return;

    const content = $state.snapshot(message).trim();
    await addUserMessage(content);
    await sendToLlm();
  }

  async function addUserMessage(content: string) {
    const userMessage: Message = {
      role: "user",
      content,
      timestamp: Date.now(),
    };

    appSetting.currentChat?.messages.push(userMessage);
    if (appSetting.currentChat) {
      appSetting.currentChat.updatedAt = Date.now();

      if (appSetting.currentChat.messages.length === 1) {
        appSetting.currentChat.title = content.slice(0, 30);
      }

      await updateChat();
    }
    message = "";
  }

  async function sendToLlm() {
    if (!appSetting.currentChat || !appSetting.defaultModel) return;

    loading = true;
    abortController = new AbortController();

    try {
      // 获取最近的消息作为上下文
      const recentMessages =
        appSetting.currentChat.messages.slice(-MAX_CONTEXT_MESSAGES);

      const response = await fetch(`${appSetting.url}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: appSetting.defaultModel.name,
          messages: recentMessages,
          stream: true,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 创建一个空的助手消息
      await addAssistantMessage("");
      const currentMessage = appSetting.currentChat.messages.at(-1);
      if (!currentMessage) return;

      const reader = response.body?.getReader();
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        const lines = text.split("\n").filter(Boolean);

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              currentMessage.content += json.message.content;
              debounceSaveChat();
            }
          } catch (e) {
            console.error("Failed to parse JSON:", e);
          }
        }
      }

      await saveCurrentChat();
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        // 用户取消了请求，不需要显示错误
        return;
      }
      alertMessage.message = `Failed to send message: ${getErrorMessage(error)}`;
      alertMessage.type = "error";
      console.error("Error:", error);
    } finally {
      loading = false;
      abortController = null;
    }
  }

  async function addAssistantMessage(content: string) {
    if (!appSetting.currentChat) return;
    appSetting.currentChat.messages.push({
      role: "assistant",
      content,
      timestamp: Date.now(),
    }),
      await saveCurrentChat();
  }

  async function updateChat() {
    if (!appSetting.currentChat?.id) return;
    await db.chats.update(
      appSetting.currentChat.id,
      $state.snapshot(appSetting.currentChat),
    );
  }

  async function saveCurrentChat() {
    if (!appSetting.currentChat) return;
    await db.chats.update(
      appSetting.currentChat.id,
      $state.snapshot(appSetting.currentChat),
    );
  }

  function debounceSaveChat() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(async () => {
      await saveCurrentChat();
      debounceTimer = null;
    }, 300) as unknown as number;
  }

  function stopGeneration() {
    if (abortController) {
      abortController.abort();
    }
  }

  // 设置相关功能
  async function deleteChat(chat: Chat) {
    if (!chat.id) return;

    try {
      await db.chats.delete(chat.id);
      chats = chats.filter((c) => c.id !== chat.id);
      if (appSetting.currentChat?.id === chat.id) {
        appSetting.currentChat = chats[0] || undefined;
      }
    } catch (error: unknown) {
      alertMessage.message = `Failed to delete chat: ${getErrorMessage(error)}`;
      alertMessage.type = "error";
    }
  }

  async function changeModel(model: ModelInfo) {
    try {
      appSetting.defaultModel = model;
      await saveSetting();
    } catch (error: unknown) {
      alertMessage.message = `Failed to change model: ${getErrorMessage(error)}`;
      alertMessage.type = "error";
    }
  }

  async function refreshModels() {
    try {
      alertMessage.message = "Refreshing models...";
      alertMessage.type = "info";
      await loadModels();
      alertMessage.message = "Models refreshed successfully";
      alertMessage.type = "info";
    } catch (error: unknown) {
      alertMessage.message = `Failed to refresh models: ${getErrorMessage(error)}`;
      alertMessage.type = "error";
    }
  }

  async function changeUrl(url: string) {
    try {
      appSetting.url = url;
      await saveSetting();
      await setupOllamaCors();
    } catch (error: unknown) {
      alertMessage.message = `Failed to change URL: ${getErrorMessage(error)}`;
      alertMessage.type = "error";
    }
  }

  async function saveTheme(theme: Theme) {
    try {
      appSetting.theme = theme;
      document.documentElement.setAttribute("data-theme", appSetting.theme);
      await saveSetting();
    } catch (error: unknown) {
      alertMessage.message = `Failed to save theme: ${getErrorMessage(error)}`;
      alertMessage.type = "error";
    }
  }

  // 工具函数
  function isError(error: unknown): error is Error {
    return error instanceof Error;
  }

  function getErrorMessage(error: unknown): string {
    if (isError(error)) {
      return error.message;
    }
    return String(error);
  }

  function renderMarkdown(content: string) {
    const renderer = new marked.Renderer();

    renderer.code = ({ text: code, lang: language }) => {
      const highlightedCode = language
        ? hljs.highlight(code, { language, ignoreIllegals: true }).value
        : hljs.highlightAuto(code).value;

      return `
          <div class="code-block-wrapper">
            <div class="code-header">
              <span class="code-language">${language || "text"}</span>
              <button class="copy-button">Copy</button>
            </div>
            <pre><code class="hljs language-${language || "text"}">${highlightedCode}</code></pre>
          </div>
        `;
    };

    const rawHtml = marked.parse(content, {
      renderer,
      breaks: true,
      gfm: true,
      async: false,
    });
    return DOMPurify.sanitize(rawHtml);
  }

  function autoScroll(node: HTMLElement) {
    const observer = new MutationObserver((mutations) => {
      const isCopyOperation = mutations.some((mutation) => {
        if (mutation.target.nodeType === Node.ELEMENT_NODE) {
          const element = mutation.target as HTMLElement;
          return (
            element.closest(".copy-button") ||
            element.classList.contains("copy-button")
          );
        }
        return false;
      });

      if (!isCopyOperation) {
        node.scrollTop = node.scrollHeight;
      }
    });

    observer.observe(node, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return {
      destroy() {
        observer.disconnect();
      },
    };
  }

  async function saveSetting() {
    const setting = $state.snapshot(appSetting);
    await db.setting.put({
      id: setting.id,
      url: setting.url,
      defaultModel: setting.defaultModel,
      theme: setting.theme,
    });
  }
</script>

<div class="flex h-screen">
  <!-- Sidebar -->
  <div class="flex w-64 flex-col bg-base-200 p-4">
    <button
      class="btn mb-4 w-full bg-blue-600/80 hover:bg-blue-600"
      onclick={createNewChat}
    >
      <i class="icon-[mdi--plus]"></i>
      New Chat
    </button>

    <div class="flex-1 overflow-y-auto">
      {#each chats as chat}
        <div
          class="mb-2 flex cursor-pointer items-center justify-between rounded-2xl p-2 hover:bg-primary/10 {appSetting
            .currentChat?.id === chat.id
            ? 'bg-primary/20'
            : ''}"
          onclick={() => (appSetting.currentChat = chat)}
          onkeydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              appSetting.currentChat = chat;
            }
          }}
          role="button"
          tabindex="0"
          aria-label={`Select chat: ${chat.title}`}
        >
          <div class="flex-1 truncate">{chat.title}</div>
          <button
            aria-label="Delete Chat"
            class="btn btn-circle btn-ghost btn-xs"
            onclick={() => deleteChat(chat)}
          >
            <i class="icon-[mdi--delete]"></i>
          </button>
        </div>
      {/each}
    </div>
  </div>

  <!-- Chat Area -->
  <div class="flex flex-1 flex-col bg-base-100">
    <div class="flex items-center justify-between border-b border-base-300 p-4">
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2">
          <input
            type="url"
            class="input input-sm input-bordered w-52 bg-transparent text-sm opacity-70 transition-opacity focus:opacity-100"
            placeholder="http://localhost:11434"
            value={appSetting.url}
            onchange={(e) => changeUrl(e.currentTarget.value)}
          />
        </div>

        <div class="dropdown">
          <button tabindex="0" class="btn btn-sm">
            {appSetting.defaultModel?.name}
            <i class="icon-[mdi--chevron-down]"></i>
          </button>
          <ul
            class="menu dropdown-content z-[1] max-h-96 w-52 space-y-1 overflow-y-auto rounded-box bg-base-200 p-2 shadow"
          >
            {#each appSetting.modelList as model}
              <li>
                <button
                  class="w-full rounded-xl text-left"
                  class:active={appSetting.defaultModel?.name === model.name}
                  onclick={() => changeModel(model)}
                >
                  {model.name}
                </button>
              </li>
            {/each}
          </ul>
        </div>

        <div class="dropdown">
          <button tabindex="0" class="btn btn-sm">
            {appSetting.theme}
            <i class="icon-[mdi--chevron-down]"></i>
          </button>
          <ul
            class="menu dropdown-content z-[1] max-h-96 w-52 space-y-1 overflow-y-auto rounded-box bg-base-200 p-2 shadow"
          >
            {#each Object.values(Theme) as theme}
              <li>
                <button
                  class="w-full rounded-xl text-left"
                  class:active={appSetting.theme === theme}
                  onclick={() => saveTheme(theme)}
                >
                  {theme}
                </button>
              </li>
            {/each}
          </ul>
        </div>
      </div>

      <button
        aria-label="Refresh Models"
        class="btn btn-circle btn-ghost btn-sm"
        onclick={refreshModels}
        title="Refresh Models"
      >
        <i class="icon-[mdi--refresh]"></i>
      </button>
    </div>
    {#if appSetting.currentChat}
      <div class="flex-1 overflow-y-auto p-4" use:autoScroll>
        {#each appSetting.currentChat.messages as message}
          <div
            class="chat {message.role === 'user'
              ? 'chat-end'
              : 'chat-start'} mb-4"
          >
            <div
              class="chat-bubble prose break-words break-all dark:prose-invert {message.role ===
              'user'
                ? 'bg-blue-600/80 [&>*]:text-slate-50'
                : ''}"
            >
              {@html renderMarkdown(message.content)}
            </div>
          </div>
        {/each}
      </div>

      <div class="flex w-full gap-4 border-t border-base-300 p-4">
        <textarea
          class="textarea textarea-bordered h-8 flex-1 resize-none bg-transparent {message
            ? 'leading-tight'
            : ''}"
          placeholder="Type a message..."
          bind:value={message}
          bind:this={inputRef}
          onkeydown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!loading) {
                sendMessage();
              }
            }
          }}
        ></textarea>
        <button
          class="btn min-w-[6rem] border {loading
            ? 'btn-error hover:bg-error/90'
            : 'bg-blue-600/80 hover:bg-blue-600'}"
          onclick={loading ? stopGeneration : sendMessage}
          disabled={!message && !loading}
          aria-label={loading ? "Stop generation" : "Send message"}
          title={loading ? "Stop generation" : "Send message"}
        >
          <i class={loading ? "icon-[mdi--stop]" : "icon-[mdi--send]"}></i>
          <span class="w-10">{loading ? "Stop" : "Send"}</span>
        </button>
      </div>
    {:else}
      <div class="flex flex-1 items-center justify-center text-base-content/50">
        Select or create a chat to start
      </div>
    {/if}
  </div>
</div>

<Alert />

<style lang="postcss">
  :global {
    .code-block-wrapper {
      @apply relative my-4 rounded-xl bg-base-200;
    }

    .code-header {
      @apply flex items-center justify-between px-4 py-1.5;
      @apply rounded-t-xl;
      @apply border-b border-white/10;
      @apply bg-primary/10;
    }

    .code-language {
      @apply text-sm text-base-content;
    }

    .copy-button {
      @apply bg-transparent;
      @apply border border-primary/60;
      @apply text-sm text-base-content/60;
      @apply px-3 py-1;
      @apply rounded-lg;
      @apply cursor-pointer;
      @apply transition-all duration-200;
      @apply leading-none;
    }

    .copy-button:hover {
      @apply bg-white/10;
    }

    .copy-button.copied {
      @apply border-[#98c379] bg-[#98c379] text-[#282c34];
    }

    pre {
      @apply m-0 bg-transparent p-4 !important;
    }

    code {
      @apply bg-transparent p-0 text-[#abb2bf] !important;
    }
  }
</style>
