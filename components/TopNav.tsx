"use client";

import Link from "next/link";
import { ThemeSwitch } from "./ThemeSwitch";

export function TopNav() {
  return (
    <nav className="top-nav">
      <Link href="/" className="brand">
        Cloud<em>51</em>
      </Link>
      <div className="search-bar" aria-hidden>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        Search products...
      </div>
      <ThemeSwitch />
    </nav>
  );
}
