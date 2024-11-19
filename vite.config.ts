import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 判断是否是 GitHub Pages 环境
  const isGitHubPages = mode === "github-pages";

  return {
    plugins: [svelte()],
    // 条件设置 base
    base: isGitHubPages ? "/ollama-kiss-ui/" : "/",
  };
});
