"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface TerminalLine {
  type: "command" | "output" | "prompt";
  content: string;
  delay?: number;
}

interface HistoryEntry {
  input?: string;
  output: string[];
}

interface TerminalWindowProps {
  lines: TerminalLine[];
  title?: string;
  className?: string;
  /** When true, an input prompt appears after the intro finishes playing. */
  interactive?: boolean;
  prompt?: string;
}

export function TerminalWindow({
  lines,
  title = "terminal",
  className = "",
  interactive = false,
  prompt = "george@kali:~$",
}: TerminalWindowProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [recall, setRecall] = useState<string[]>([]);
  const [recallIdx, setRecallIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const introDone = visibleLines >= lines.length;

  // Auto-play the intro lines
  useEffect(() => {
    if (visibleLines < lines.length) {
      const delay = lines[visibleLines].delay || 500;
      const timer = setTimeout(() => setVisibleLines((p) => p + 1), delay);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, lines]);

  // Keep the view pinned to the newest output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, visibleLines]);

  const run = useCallback(
    (raw: string): string[] => {
      const cmd = raw.trim();
      if (!cmd) return [];
      const [name, ...args] = cmd.split(/\s+/);
      const arg = args.join(" ");

      switch (name.toLowerCase()) {
        case "help":
          return [
            "Available commands:",
            "  whoami            who you're talking to",
            "  ls                list sections of this site",
            "  cat <section>     summarize a section",
            "  open <section>    navigate there",
            "  stack             tools I work with",
            "  contact           how to reach me",
            "  clear             clear the screen",
          ];
        case "whoami":
          return [
            "george_wanyoike — security practitioner & ISP operator",
            "I build the systems I break.",
          ];
        case "ls":
          return ["work/   lab/   library/   blog/   about/   contact/"];
        case "pwd":
          return ["/home/george/portfolio"];
        case "stack":
          return [
            "offensive : Burp Suite, Nmap, Kali, CVSS 4.0",
            "analysis  : Semgrep, CodeQL MRVA, YARA-X",
            "operate   : MikroTik RouterOS, n8n, Tailscale, KVM/libvirt",
          ];
        case "contact":
          return [
            "email  : george@knight-labs.co",
            "alt    : realsirgeorge@gmail.com",
            "type 'open contact' to send a message",
          ];
        case "cat": {
          const sections: Record<string, string[]> = {
            work: [
              "34 findings across a learning-institution audit, a production ISP,",
              "edge-AI security research, and commercial delivery. `open work`.",
            ],
            lab: [
              "Offensive work and public publishing, separated by a one-way git",
              "airlock I designed. `open lab`.",
            ],
            library: [
              "csosec, scripter, agent-forge — my methodology, encoded. `open library`.",
            ],
            blog: ["CTF writeups, technique notes, tooling. `open blog`."],
            about: ["Background, capabilities, certifications. `open about`."],
            contact: ["george@knight-labs.co · `open contact`."],
          };
          if (!arg) return ["usage: cat <section> — try 'ls' first"];
          return (
            sections[arg.toLowerCase().replace(/\/$/, "")] || [
              `cat: ${arg}: no such section`,
            ]
          );
        }
        case "open": {
          const routes: Record<string, string> = {
            work: "/work",
            lab: "/infrastructure",
            infrastructure: "/infrastructure",
            library: "/library",
            blog: "/blog",
            about: "/about",
            contact: "/contact",
            resume: "/resume",
          };
          const dest = routes[arg.toLowerCase().replace(/\/$/, "")];
          if (!dest) return [`open: ${arg}: no such section`];
          setTimeout(() => router.push(dest), 250);
          return [`opening ${dest} ...`];
        }
        case "clear":
          return ["__CLEAR__"];
        case "sudo":
          return ["nice try. this prompt runs unprivileged."];
        case "exit":
          return ["there is no escape. type 'help'."];
        default:
          return [`${name}: command not found — type 'help'`];
      }
    },
    [router]
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input;
    const out = run(raw);
    if (out[0] === "__CLEAR__") {
      setHistory([]);
    } else {
      setHistory((h) => [...h, { input: raw, output: out }]);
    }
    if (raw.trim()) setRecall((r) => [...r, raw]);
    setRecallIdx(-1);
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (recall.length === 0) return;
      const idx = recallIdx < 0 ? recall.length - 1 : Math.max(0, recallIdx - 1);
      setRecallIdx(idx);
      setInput(recall[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (recallIdx < 0) return;
      const idx = recallIdx + 1;
      if (idx >= recall.length) {
        setRecallIdx(-1);
        setInput("");
      } else {
        setRecallIdx(idx);
        setInput(recall[idx]);
      }
    }
  };

  return (
    <div
      className={`rounded-lg border border-border bg-card/50 backdrop-blur-sm overflow-hidden ${className}`}
      onClick={() => introDone && inputRef.current?.focus()}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-primary/80" />
        </div>
        <span className="text-xs text-muted-foreground font-mono ml-2">
          {title}
        </span>
        {interactive && introDone && (
          <span className="ml-auto text-[0.65rem] text-muted-foreground/70 font-mono">
            type help
          </span>
        )}
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="p-4 font-mono text-sm space-y-1 min-h-[280px] max-h-[280px] overflow-y-auto"
      >
        {/* Intro auto-play */}
        {lines.slice(0, visibleLines).map((line, index) => (
          <div key={index} className="flex items-start">
            {line.type === "command" && (
              <>
                <span className="text-primary mr-2">$</span>
                <span className="text-foreground break-all">{line.content}</span>
              </>
            )}
            {line.type === "output" && (
              <span className="text-muted-foreground pl-4 break-all">
                {line.content}
              </span>
            )}
            {line.type === "prompt" && (
              <span className="text-foreground break-all">{line.content}</span>
            )}
          </div>
        ))}

        {/* Command history */}
        {history.map((entry, i) => (
          <div key={`h-${i}`}>
            {entry.input !== undefined && (
              <div className="flex items-start">
                <span className="text-primary mr-2 shrink-0">{prompt}</span>
                <span className="text-foreground break-all">{entry.input}</span>
              </div>
            )}
            {entry.output.map((o, j) => (
              <div key={j} className="text-muted-foreground break-all pl-0">
                {o}
              </div>
            ))}
          </div>
        ))}

        {/* Live prompt */}
        {interactive && introDone ? (
          <form onSubmit={submit} className="flex items-center">
            <span className="text-primary mr-2 shrink-0">{prompt}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              aria-label="Terminal input. Type a command such as help."
              className="flex-1 bg-transparent border-0 outline-none text-foreground caret-primary p-0 font-mono text-sm"
            />
          </form>
        ) : (
          !interactive &&
          introDone && (
            <div className="flex items-center">
              <span className="text-primary mr-2">$</span>
              <span className="animate-pulse">_</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
