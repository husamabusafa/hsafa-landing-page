"use client";

import Link from "next/link";

export default function DocsPage() {
  return (
    <div>
      <h2>Welcome to the Hsafa Docs</h2>
      <p>
        Explore the Hsafa system architecture and the SDK to build agentic experiences. Use the left sidebar to navigate between sections.
      </p>

      <h3>Quick links</h3>
      <ul>
        <li>
          <Link href="/docs/system/overview">System · Overview</Link>
        </li>
        <li>
          <Link href="/docs/sdk/getting-started">SDK · Getting Started</Link>
        </li>
      </ul>
    </div>
  );
}
