<script lang="ts">
    import { alertMessage } from "../lib/store.svelte";
    import { quadOut } from "svelte/easing";
    import { fly } from "svelte/transition";

    // 使用 effect 确保消息自动清除
    $effect(() => {
        if (alertMessage.message) {
            const timer = setTimeout(() => {
                alertMessage.message = "";
            }, 2000); // 稍微延长一点显示时间

            // 清理定时器
            return () => clearTimeout(timer);
        }
    });
</script>

{#if alertMessage.message}
    <div
        class="fixed left-1/2 top-0 z-[9999] mt-4 max-w-[90vw] sm:max-w-sm -translate-x-1/2 transform px-4"
        transition:fly={{ y: -50, duration: 300, easing: quadOut }}
    >
        <div
            role="alert"
            class="alert rounded-2xl flex items-center justify-center border-none
                   bg-primary backdrop-blur px-6 py-3 text-center text-white
                   shadow-lg ring-1 ring-white/10"
        >
            <p class="text-sm font-medium truncate">{alertMessage.message}</p>
        </div>
    </div>
{/if}
