export const nav = {
  system: {
    title: "Hsafa system",
    items: [
      { href: "/docs/system/overview", label: "Overview" },
      { href: "/docs/system/architecture", label: "Architecture" },
      { href: "/docs/system/nodes", label: "System Nodes" },
      { href: "/docs/system/deployment", label: "Deployment" },
    ],
  },
  sdk: {
    title: "Hsafa SDK",
    items: [
      { href: "/docs/sdk/getting-started", label: "Getting Started" },
      { href: "/docs/sdk/installation", label: "Installation" },
      { href: "/docs/sdk/auth", label: "Authentication" },
      { href: "/docs/sdk/examples", label: "Examples" },
    ],
  },
} as const;

export type NavSectionKey = keyof typeof nav;
export type NavItem = { href: string; label: string };
