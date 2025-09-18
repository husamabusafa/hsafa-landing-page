import type { Config } from "tailwindcss";

// Enable class-based dark mode so `dark:` utilities respond to the `.dark` class
// that next-themes applies to the <html> element.
export default {
  darkMode: "class",
} satisfies Config;
