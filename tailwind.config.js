import { addDynamicIconSelectors } from "@iconify/tailwind";
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  // darkMode: "media",
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        "base-400": "var(--base-400)",
        "base-500": "var(--base-500)",
        "base-600": "var(--base-600)",
        "base-700": "var(--base-700)",
        "base-800": "var(--base-800)",
        "base-900": "var(--base-900)",
        "base-1000": "var(--base-1000)",
        "base-content-100": "var(--base-content-100)",
        "base-content-200": "var(--base-content-200)",
        "base-content-300": "var(--base-content-300)",
        "base-content-400": "var(--base-content-400)",
        "base-content-500": "var(--base-content-500)",
        "base-content-600": "var(--base-content-600)",
        "level-1": "var(--level-1)",
        "level-2": "var(--level-2)",
        "level-3": "var(--level-3)",
        "level-4": "var(--level-4)",
        "level-5": "var(--level-5)",
        "level-6": "var(--level-6)",
        "level-7": "var(--level-7)",
        "level-8": "var(--level-8)",
        "level-9": "var(--level-9)",
      },
    },
  },
  plugins: [daisyui, addDynamicIconSelectors()],
  daisyui: {
    themes: [
      {
        black: {
          "base-content": "#ffffff", // 提高对比度使用纯白文本
          "base-100": "#000000", // 纯黑背景
          "base-200": "#0a0a0a", // 稍微偏亮的黑色
          "base-300": "#141414", // 再稍微偏亮的黑色
          primary: "#60a5fa", // 明亮的蓝色，比原来更亮些
          "primary-focus": "#3b82f6", // 点击效果
          "primary-content": "#ffffff",
          secondary: "#525252", // 中性灰色
          "secondary-focus": "#666666", // 更亮的灰色
          "secondary-content": "#ffffff",
          accent: "#404040", // 深灰色
          "accent-focus": "#4a4a4a", // 稍亮的深灰色
          "accent-content": "#ffffff",
          neutral: "#262626", // 深色中性色
          "neutral-focus": "#303030", // 点击效果
          "neutral-content": "#ffffff",
          info: "#38bdf8", // 明亮的天蓝色
          "info-focus": "#0ea5e9", // 点击效果
          "info-content": "#ffffff",
          success: "#4ade80", // 明亮的绿色
          "success-focus": "#22c55e", // 点击效果
          "success-content": "#ffffff",
          warning: "#fbbf24", // 明亮的橙色
          "warning-focus": "#f59e0b", // 点击效果
          "warning-content": "#000000",
          error: "#f87171", // 明亮的红色
          "error-focus": "#ef4444", // 点击效果
          "error-content": "#ffffff",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.75rem", // 稍微减小圆角
          "--rounded-badge": "1.9rem",
          "--animation-btn": ".25s",
          "--animation-input": ".2s",
          "--btn-text-case": "lowercase",
          "--navbar-padding": ".5rem",
          "--border-btn": "1px",
        },
        light: {
          "base-content": "#1f2937", // 普通文本颜色，深灰接近黑色
          "base-100": "#ffffff", // 最浅的背景，纯白
          "base-200": "#f8fafc", // 次浅背景，淡灰白
          "base-300": "#f1f5f9", // 次次浅背景，略深的灰白
          "--base-400": "#e9eef4", // 保持蓝灰调
          "--base-500": "#dde5ed", // 中等蓝灰
          "--base-600": "#c2ccd9", // 深一点的蓝灰
          "--base-700": "#9ba8b9", // 较深蓝灰
          "--base-800": "#73829a", // 深蓝灰
          "--base-900": "#4c5c77", // 很深的蓝灰
          "--base-1000": "#2d3a52", // 最深蓝灰
          "--base-content-100": "#111827",
          "--base-content-200": "#1f2937",
          "--base-content-300": "#374151",
          "--base-content-400": "#4b5563",
          "--base-content-500": "#6b7280",
          "--base-content-600": "#9ca3af",

          "--level-1": "#f5f5f5", // 最浅灰色起始
          "--level-2": "#fff1ec", // 带一点橘色调
          "--level-3": "#ffe4db", // 浅橘红开始
          "--level-4": "#ffd4c8", // 明显的浅橘红
          "--level-5": "#ffc4b4", // 中等橘红
          "--level-6": "#ffb3a0", // 较深橘红
          "--level-7": "#ffa28c", // 深橘红
          "--level-8": "#ff9178", // 更深橘红
          "--level-9": "#ff8064", // 最深橘红

          primary: "#3b82f6", // 保持相同的主色调
          "primary-focus": "#2563eb", // 保持相同
          "primary-content": "#ffffff", // 保持白色文本

          secondary: "#e2e8f0", // 浅灰色背景
          "secondary-focus": "#cbd5e1", // 稍深的浅灰
          "secondary-content": "#1f2937", // 深色文本

          accent: "#f8fafc", // 非常浅的灰色
          "accent-focus": "#f1f5f9", // 稍深的浅灰
          "accent-content": "#64748b", // 中等灰度文本

          neutral: "#f1f5f9", // 浅灰色
          "neutral-focus": "#e2e8f0", // 稍深的浅灰
          "neutral-content": "#64748b", // 中等灰度文本

          info: "#0ea5e9", // 保持相同
          "info-focus": "#0284c7", // 保持相同
          "info-content": "#ffffff", // 保持相同

          success: "#10b981", // 保持相同
          "success-focus": "#059669", // 保持相同
          "success-content": "#ffffff", // 保持相同

          warning: "#f59e0b", // 保持相同
          "warning-focus": "#d97706", // 保持相同
          "warning-content": "#000000", // 保持相同

          error: "#ef4444", // 保持相同
          "error-focus": "#dc2626", // 保持相同
          "error-content": "#ffffff", // 保持相同

          // 保持相同的圆角、动画和其他样式变量
          "--rounded-box": "1rem",
          "--rounded-btn": "1rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": ".25s",
          "--animation-input": ".2s",
          "--btn-text-case": "lowercase",
          "--navbar-padding": ".5rem",
          "--border-btn": "1px",
        },
        dark: {
          "base-content": "#f2f2f2", // 普通文本颜色
          "base-100": "11151c", // 最深的背景
          "base-200": "151b25", // 次深背景
          "base-300": "19212e", // 次次深背景
          "--base-400": "#212d40",
          "--base-500": "#273246",
          "--base-600": "#2c374b",
          "--base-700": "#313c51",
          "--base-800": "#343f54",
          "--base-900": "#364156",
          "--base-1000": "#485265",
          "--base-content-100": "#ececec",
          "--base-content-200": "#cccccc",
          "--base-content-300": "#a5a5a5",
          "--base-content-400": "#a2a3a7",
          "--base-content-500": "#7f7f7f",
          "--base-content-600": "#595959",

          "--level-1": "#1d2028", // 最浅灰色起始
          "--level-2": "#221f25", // 带一点橘色调
          "--level-3": "#261e22", // 浅橘红开始
          "--level-4": "#2b1e1f", // 明显的浅橘红
          "--level-5": "#301d1d", // 中等橘红
          "--level-6": "#351c1c", // 较深橘红
          "--level-7": "#3a1b1b", // 深橘红
          "--level-8": "#401a1a", // 更深橘红
          "--level-9": "#451919", // 最深橘红

          primary: "#3b82f6", // 主要颜色，比如主要按钮的背景色，明亮的蓝色 (Blue-500)
          "primary-focus": "#2563eb", // 稍深的蓝色 (Blue-600)
          "primary-content": "#ffffff", // 白色文本
          secondary: "#485265", // 采用 base-1000 的颜色
          "secondary-focus": "#565e70", // 比 base-1000 更亮一些
          "secondary-content": "#ffffff", // 白色文本
          accent: "#313c51", // 采用 base-700 的颜色
          "accent-focus": "#364156", // 采用 base-900 的颜色
          "accent-content": "#a6adba", // 浅灰色文本，不用纯白
          neutral: "#273246", // 使用 base-500
          "neutral-focus": "#2c374b", // 使用 base-600
          "neutral-content": "#a6adba", // 柔和的浅灰色文本
          info: "#0ea5e9", // Sky-500，清爽的蓝色
          "info-focus": "#0284c7", // Sky-600，点击效果
          "info-content": "#ffffff", // 白色文本
          success: "#10b981", // Emerald-500，舒适的绿色
          "success-focus": "#059669", // Emerald-600，点击效果
          "success-content": "#ffffff",
          warning: "#f59e0b", // Amber-500，温和的橙色
          "warning-focus": "#d97706", // Amber-600，点击效果
          "warning-content": "#000000", // 黑色文本，因为背景色较亮
          error: "#ef4444", // Red-500，醒目但不刺眼的红色
          "error-focus": "#dc2626", // Red-600，点击效果
          "error-content": "#ffffff",
          "--rounded-box": "1rem",
          "--rounded-btn": "1rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": ".25s",
          "--animation-input": ".2s",
          "--btn-text-case": "lowercase",
          "--navbar-padding": ".5rem",
          "--border-btn": "1px",
        },
        tan: {
          "base-100": "#1b1f29", // 最深背景
          "base-200": "#2a2f3c", // 次深背景
          "base-300": "#444d61", // 次次深背景
          "--base-400": "#535d73", // 继续变浅
          "--base-500": "#626d85",
          "--base-600": "#717d97",
          "--base-700": "#808da9",
          "--base-800": "#909dbb",
          "--base-900": "#a0adcd",
          "--base-1000": "#b0bddf",

          // 文本色系：从亮到暗的渐变
          "base-content": "#e1e5eb", // 主文本颜色
          "--base-content-100": "#9aa2b4", // 较暗文本
          "--base-content-200": "#858ea0", // 更暗文本
          "--base-content-300": "#707788",
          "--base-content-400": "#5c6270",
          "--base-content-500": "#484c58",
          "--base-content-600": "#343740",

          "--level-1": "#564e61", // 最浅灰色起始
          "--level-2": "#6a4e64", // 带一点橘色调
          "--level-3": "#7d4f64", // 浅橘红开始
          "--level-4": "#904f64", // 明显的浅橘红
          "--level-5": "#a25066", // 中等橘红
          "--level-6": "#b45167", // 较深橘红
          "--level-7": "#c75168", // 深橘红
          "--level-8": "#da5269", // 更深橘红
          "--level-9": "#ec5369", // 最深橘红

          primary: "#3b82f6", // 主要颜色，比如主要按钮的背景色，明亮的蓝色 (Blue-500)
          "primary-focus": "#2563eb", // 稍深的蓝色 (Blue-600)
          "primary-content": "#ffffff", // 白色文本
          secondary: "#485265", // 采用 base-1000 的颜色
          "secondary-focus": "#565e70", // 比 base-1000 更亮一些
          "secondary-content": "#ffffff", // 白色文本
          accent: "#313c51", // 采用 base-700 的颜色
          "accent-focus": "#364156", // 采用 base-900 的颜色
          "accent-content": "#a6adba", // 浅灰色文本，不用纯白
          neutral: "#273246", // 使用 base-500
          "neutral-focus": "#2c374b", // 使用 base-600
          "neutral-content": "#a6adba", // 柔和的浅灰色文本
          info: "#0ea5e9", // Sky-500，清爽的蓝色
          "info-focus": "#0284c7", // Sky-600，点击效果
          "info-content": "#ffffff", // 白色文本
          success: "#10b981", // Emerald-500，舒适的绿色
          "success-focus": "#059669", // Emerald-600，点击效果
          "success-content": "#ffffff",
          warning: "#f59e0b", // Amber-500，温和的橙色
          "warning-focus": "#d97706", // Amber-600，点击效果
          "warning-content": "#000000", // 黑色文本，因为背景色较亮
          error: "#ef4444", // Red-500，醒目但不刺眼的红色
          "error-focus": "#dc2626", // Red-600，点击效果
          "error-content": "#ffffff",
          "--rounded-box": "1rem",
          "--rounded-btn": "1rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": ".25s",
          "--animation-input": ".2s",
          "--btn-text-case": "lowercase",
          "--navbar-padding": ".5rem",
          "--border-btn": "1px",
        },
        pink: {
          "base-100": "#ffffff", // 保持纯白打底
          "base-200": "#fff8f9", // 极淡粉白
          "base-300": "#fff0f3", // 淡粉白
          "--base-400": "#ffe7ec", // 开始带入更多粉色
          "--base-500": "#ffdee5",
          "--base-600": "#ffd5de",
          "--base-700": "#ffccd7",
          "--base-800": "#ffc3d0",
          "--base-900": "#ffbac9",
          "--base-1000": "#ffb1c2",

          "base-content": "#4a314d", // 主文本颜色，温暖的深紫褐色
          "--base-content-100": "#865c8a", // 次要文本，柔和的紫色
          "--base-content-200": "#a17ca4", // 更浅的文本颜色
          "--base-content-300": "#b799ba",
          "--base-content-400": "#c7aeca",
          "--base-content-500": "#d6c3d8",
          "--base-content-600": "#e5d8e6",

          "--level-1": "#ede0e4",
          "--level-2": "#efd0d7",
          "--level-3": "#f2c0ca",
          "--level-4": "#f3b1bc",
          "--level-5": "#f5a2ae",
          "--level-6": "#f792a2",
          "--level-7": "#f98193",
          "--level-8": "#fb7487",
          "--level-9": "#fd6378",

          // 改为粉色主题的配色
          primary: "#ff8fab", // 温柔粉色
          "primary-focus": "#ff7096", // 深粉色
          "primary-content": "#ffffff",

          secondary: "#ffd6e0", // 浅粉色背景
          "secondary-focus": "#ffbed0", // 稍深粉色
          "secondary-content": "#833b4c",

          accent: "#ffe5ec", // 非常浅的粉色
          "accent-focus": "#ffd6e0", // 稍深的浅粉
          "accent-content": "#994d5f",

          neutral: "#fff0f3", // 浅粉灰色
          "neutral-focus": "#ffe5ec", // 稍深的粉灰
          "neutral-content": "#994d5f",

          info: "#c1a8ff", // 改为温柔紫色
          "info-focus": "#b094ff",
          "info-content": "#ffffff",

          success: "#98e4d6", // 改为柔和薄荷绿
          "success-focus": "#7fd9c7",
          "success-content": "#ffffff",

          warning: "#ffc3a0", // 改为柔和橙色
          "warning-focus": "#ffb085",
          "warning-content": "#ffffff",

          error: "#ff9eae", // 改为柔和红色
          "error-focus": "#ff8499",
          "error-content": "#ffffff",

          // 保持相同的圆角、动画和其他样式变量
          "--rounded-box": "1rem",
          "--rounded-btn": "1rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": ".25s",
          "--animation-input": ".2s",
          "--btn-text-case": "lowercase",
          "--navbar-padding": ".5rem",
          "--border-btn": "1px",
        },
      },
    ],
  },
};
