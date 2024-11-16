<script lang="ts">
    import { onMount } from "svelte";
    import { db } from "./lib/db";
    import type { Chat, Message } from "./lib/types";
    import { appState } from "./lib/store.svelte";
    import { marked } from "marked";
    import DOMPurify from "dompurify";
    import { fetchModels } from "./lib/fetch";

    let message = $state("");
    let chats: Chat[] = $state([]);
    let loading = $state(false);
    let inputRef: HTMLInputElement;

    onMount(async () => {
        // 获取模型列表
        appState.modelList = await fetchModels();
        chats = await db.chats.orderBy("updatedAt").reverse().toArray();
        if (chats.length === 0) {
            await createNewChat();
        } else {
            appState.currentChat = chats[0];
        }
    });

    async function createNewChat() {
        const newChat: Chat = {
            title: "New Chat",
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            model: appState.modelList[0].name || "qwen2.5",
        };

        const id = await db.chats.add(newChat);
        chats = await db.chats.orderBy("updatedAt").reverse().toArray();
        appState.currentChat = chats[0];
        inputRef.focus();
    }

    async function sendMessage() {
        if (!message.trim() || !appState.currentChat || loading) return;

        const content = $state.snapshot(message).trim();
        const userMessage: Message = {
            role: "user",
            content,
            timestamp: Date.now(),
        };

        appState.currentChat.messages.push(userMessage);
        appState.currentChat.updatedAt = Date.now();

        if (appState.currentChat.messages.length === 1) {
            appState.currentChat.title = message.slice(0, 30);
        }

        await db.chats.update(
            appState.currentChat.id,
            $state.snapshot(appState.currentChat),
        );

        loading = true;
        message = "";

        try {
            // 构建对话历史
            const messages = appState.currentChat.messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            const response = await fetch(
                "http://localhost:11434/api/chat", // 注意：这里改用 chat 接口
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: appState.currentChat.model,
                        messages: messages, // 传递完整的对话历史
                        stream: false,
                    }),
                },
            );

            const data = await response.json();

            const assistantMessage: Message = {
                role: "assistant",
                content: data.message.content, // chat 接口的响应格式略有不同
                timestamp: Date.now(),
            };

            appState.currentChat.messages.push(assistantMessage);
            appState.currentChat.updatedAt = Date.now();
            await db.chats.update(
                appState.currentChat.id,
                $state.snapshot(appState.currentChat),
            );
        } catch (error) {
            console.error("Error:", error);
        } finally {
            loading = false;
        }
    }

    async function deleteChat(chat: Chat) {
        if (chat.id) {
            await db.chats.delete(chat.id);
            chats = chats.filter((c) => c.id !== chat.id);
            if (appState.currentChat?.id === chat.id) {
                appState.currentChat = chats[0] || undefined;
            }
        }
    }

    function renderMarkdown(content: string) {
        const rawHtml = marked.parse(content, {
            breaks: true, // 将换行符转换为 <br>
            gfm: true, // 启用 GitHub 风格的 Markdown
            async: false,
        });
        return DOMPurify.sanitize(rawHtml);
    }

    // 创建一个自动滚动的 action
    function autoScroll(node: HTMLElement) {
        const scroll = () => {
            node.scrollTop = node.scrollHeight;
        };

        // 创建一个观察器来监听内容变化
        const observer = new MutationObserver(scroll);

        // 开始观察
        observer.observe(node, { childList: true, subtree: true });

        // 清理函数
        return {
            destroy() {
                observer.disconnect();
            },
        };
    }
</script>

<div class="h-screen flex">
    <!-- Sidebar -->
    <div class="w-64 bg-base-200 p-4 flex flex-col">
        <button class="btn btn-primary mb-4 w-full" onclick={createNewChat}>
            <i class="icon-[mdi--plus]"></i>
            New Chat
        </button>

        <div class="overflow-y-auto flex-1">
            {#each chats as chat}
                <div
                    class="mb-2 p-2 cursor-pointer hover:bg-base-300 flex justify-between items-center rounded-2xl"
                    class:bg-base-300={appState.currentChat?.id === chat.id}
                    onclick={() => (appState.currentChat = chat)}
                    onkeydown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            appState.currentChat = chat;
                        }
                    }}
                    role="button"
                    tabindex="0"
                    aria-label={`选择对话：${chat.title}`}
                >
                    <div class="truncate flex-1">{chat.title}</div>
                    <button
                        aria-label="Delete Chat"
                        class="btn btn-ghost btn-xs btn-circle"
                        onclick={() => deleteChat(chat)}
                    >
                        <i class="icon-[mdi--delete] bg-base-content-300"></i>
                    </button>
                </div>
            {/each}
        </div>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col bg-base-100">
        {#if appState.currentChat}
            <div class="flex-1 p-4 overflow-y-auto" use:autoScroll>
                {#each appState.currentChat.messages as message}
                    <div
                        class="chat {message.role === 'user'
                            ? 'chat-end'
                            : 'chat-start'} mb-4"
                    >
                        <div
                            class="chat-bubble {message.role === 'user'
                                ? 'chat-bubble-primary'
                                : ''}"
                        >
                            {@html renderMarkdown(message.content)}
                        </div>
                    </div>
                {/each}
                {#if loading}
                    <div class="chat chat-start mb-4">
                        <div class="chat-bubble">
                            <span class="loading loading-dots loading-sm"
                            ></span>
                        </div>
                    </div>
                {/if}
            </div>

            <div class="p-4 border-t border-base-300 w-full flex gap-4">
                <input
                    type="text"
                    bind:value={message}
                    bind:this={inputRef}
                    placeholder="Type your message..."
                    class="input input-bordered flex-1"
                    onkeydown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    type="submit"
                    class="btn btn-primary"
                    disabled={loading}
                    onclick={sendMessage}
                >
                    <i class="icon-[mdi--send]"></i>
                    Send
                </button>
            </div>
        {:else}
            <div
                class="flex-1 flex items-center justify-center text-base-content/50"
            >
                Select or create a chat to start
            </div>
        {/if}
    </div>
</div>
