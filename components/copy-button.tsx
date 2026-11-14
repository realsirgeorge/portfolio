"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies `text` (or the current page URL when omitted) to the clipboard. */
export function CopyButton({ text, label = "Copy", className }: { text?: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text ?? window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be unavailable (permissions, insecure context); fail quietly.
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={className ?? "inline-flex items-center gap-1.5 rounded px-2 py-1 font-mono text-xs text-[#a7a297] hover:text-[#ece7dc]"}
    >
      {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
