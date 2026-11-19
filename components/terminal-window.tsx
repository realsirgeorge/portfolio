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

  // Readers who ask for reduced motion get the whole intro at once.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleLines(lines.length);
    }
  }, [lines.length]);

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
            "  knightlabs        the firm I founded",
            "  ls                list sections of this site",
            "  cat <section>     summarize a section",
            "  open <section>    navigate there",
            "  stack             tools I work with",
            "  contact           how to reach me",
            "  clear             clear the screen",
          ];
        case "whoami":
          return [
            "george_wanyoike — security practitioner, founder of Knight Labs",
            "I build the systems I break.",
          ];
        case "knightlabs":
        case "knight-labs":
          return [
            "Knight Labs — cybersecurity for SACCOs, clinics, schools,",
            "property managers and growing corporates. Assess, Test, Audit,",
            "Advise, Respond. Business enquiries go there. `open knight-labs`.",
          ];
        case "ls":
          return ["work/   knight-labs/   lab/   library/   blog/   about/   resume/   contact/"];
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
            "business : hello@knightlabs.co.ke (Knight Labs)",
            "personal : realsirgeorge@gmail.com",
            "type 'open contact' for everything else",
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
            contact: ["Business via Knight Labs, personal via `open contact`."],
            "knight-labs": ["The firm I founded. `open knight-labs`."],
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
            "knight-labs": "/knight-labs",
            knightlabs: "/knight-labs",
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
      className={`overflow-hidden rounded-lg border border-white/10 bg-[#0b0e10] text-[#e6e1d6] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] ${className}`}
      onClick={() => introDone && inputRef.current?.focus()}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <span className="ml-2 font-mono text-xs text-[#a7a297]">
          {title}
        </span>
        {interactive && introDone && (
          <span className="ml-auto font-mono text-[0.6875rem] text-[#a7a297]">
            type help
          </span>
        )}
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="h-[268px] space-y-1 overflow-y-auto p-4 font-mono text-[0.8125rem] leading-relaxed"
        aria-live="polite"
      >
        {/* Intro auto-play */}
        {lines.slice(0, visibleLines).map((line, index) => (
          <div key={index} className="flex items-start">
            {line.type === "command" && (
              <>
                <span className="text-[#7fcca8] mr-2">$</span>
                <span className="text-[#ece7dc] break-words">{line.content}</span>
              </>
            )}
            {line.type === "output" && (
              <span className="text-[#a7a297] pl-4 break-words">
                {line.content}
              </span>
            )}
            {line.type === "prompt" && (
              <span className="text-[#ece7dc] break-words">{line.content}</span>
            )}
          </div>
        ))}

        {/* Command history */}
        {history.map((entry, i) => (
          <div key={`h-${i}`}>
            {entry.input !== undefined && (
              <div className="flex items-start">
                <span className="text-[#7fcca8] mr-2 shrink-0">{prompt}</span>
                <span className="text-[#ece7dc] break-words">{entry.input}</span>
              </div>
            )}
            {entry.output.map((o, j) => (
              <div key={j} className="text-[#a7a297] break-words pl-0">
                {o}
              </div>
            ))}
          </div>
        ))}

        {/* Live prompt */}
        {interactive && introDone ? (
          <form onSubmit={submit} className="flex items-center">
            <span className="text-[#7fcca8] mr-2 shrink-0">{prompt}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              aria-label="Terminal input. Type a command such as help."
              className="flex-1 bg-transparent border-0 outline-none text-[#ece7dc] caret-[#7fcca8] p-0 font-mono text-sm"
            />
          </form>
        ) : (
          !interactive &&
          introDone && (
            <div className="flex items-center">
              <span className="text-[#7fcca8] mr-2">$</span>
              <span className="animate-pulse">_</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
