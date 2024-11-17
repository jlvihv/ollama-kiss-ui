<script lang="ts">
  import { quadOut } from "svelte/easing";
  import { fly } from "svelte/transition";
  import { alertMessage } from "./store.svelte";

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
    class="fixed left-0 right-0 top-0 z-[9999] mx-auto mt-4 max-w-[90vw] px-4 sm:max-w-sm"
    transition:fly={{ y: -50, duration: 300, easing: quadOut }}
  >
    <div
      role="alert"
      class="alert flex items-center justify-center rounded-2xl border-none
                   {alertMessage.type === 'error' ? 'bg-error' : 'bg-primary'} 
                   px-6 py-3 text-center text-white shadow-lg
                   ring-1 ring-white/10 backdrop-blur"
    >
      <p class="truncate text-sm font-medium">{alertMessage.message}</p>
    </div>
  </div>
{/if}
