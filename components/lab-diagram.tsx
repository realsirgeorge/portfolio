/**
 * The lab architecture. The airlock is drawn as the centre of the diagram
 * because it is the centre of the design: content leaves the private zone
 * for the public one and never travels back.
 */
export function LabDiagram() {
  return (
    <figure className="my-10">
      <div className="overflow-x-auto rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm">
        <svg
          viewBox="0 0 860 430"
          role="img"
          aria-labelledby="lab-diagram-title lab-diagram-desc"
          className="block h-auto w-full min-w-[760px]"
        >
          <title id="lab-diagram-title">Lab architecture</title>
          <desc id="lab-diagram-desc">
            Hermes orchestrates a gated Claude Code execution tool. A private
            offensive zone holds a Kali attack virtual machine and Windows
            analysis virtual machines on a KVM and libvirt hypervisor. A
            one-directional git airlock allows content to move from the private
            zone into a public zone containing two Hugo sites, and never back.
            An Ubuntu host runs n8n, Evolution API and Hermes, reachable over
            Tailscale.
          </desc>

          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--primary)" />
            </marker>
            <marker
              id="arrow-muted"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          <g
            fontFamily="var(--font-mono)"
            fontSize="11"
            fill="var(--muted-foreground)"
          >
            {/* ---- Orchestration ---- */}
            <rect
              x="250"
              y="16"
              width="360"
              height="70"
              rx="3"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.5"
            />
            <text
              x="268"
              y="40"
              fill="var(--foreground)"
              fontSize="14"
              fontWeight="600"
              fontFamily="var(--font-sans)"
            >
              Hermes
            </text>
            <text x="268" y="58" fontSize="11">
              orchestration and authority
            </text>
            <text x="268" y="74" fontSize="11">
              Claude Code runs beneath it, gated
            </text>

            {/* the gate */}
            <line
              x1="430"
              y1="86"
              x2="430"
              y2="112"
              stroke="var(--primary)"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
            <rect
              x="392"
              y="112"
              width="76"
              height="24"
              rx="3"
              fill="var(--primary)"
            />
            <text
              x="430"
              y="128"
              textAnchor="middle"
              fill="var(--primary-foreground)"
              fontSize="11"
              fontWeight="600"
            >
              GATE
            </text>

            {/* ---- Private zone ---- */}
            <rect
              x="20"
              y="168"
              width="300"
              height="182"
              rx="3"
              fill="none"
              stroke="var(--border)"
              strokeDasharray="4 3"
            />
            <text
              x="36"
              y="192"
              fill="var(--foreground)"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-sans)"
            >
              Private working zone
            </text>
            <text x="36" y="209" fontSize="11">
              treated as contaminated by default
            </text>

            <rect
              x="36"
              y="224"
              width="128"
              height="52"
              rx="3"
              fill="var(--background)"
              stroke="var(--border)"
            />
            <text x="50" y="246" fill="var(--foreground)" fontSize="12">
              Kali attack VM
            </text>
            <text x="50" y="263" fontSize="10">
              offensive work
            </text>

            <rect
              x="176"
              y="224"
              width="128"
              height="52"
              rx="3"
              fill="var(--background)"
              stroke="var(--border)"
            />
            <text x="190" y="246" fill="var(--foreground)" fontSize="12">
              Windows VMs
            </text>
            <text x="190" y="263" fontSize="10">
              legacy binary analysis
            </text>

            <rect
              x="36"
              y="290"
              width="268"
              height="40"
              rx="3"
              fill="var(--background)"
              stroke="var(--border)"
            />
            <text x="50" y="315" fill="var(--foreground)" fontSize="12">
              KVM / libvirt hypervisor
            </text>

            {/* Hermes reaches the private zone through the gate */}
            <path
              d="M 400 136 L 170 136 L 170 166"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />

            {/* ---- The airlock ---- */}
            <rect
              x="352"
              y="168"
              width="76"
              height="182"
              rx="3"
              fill="var(--primary)"
              fillOpacity="0.08"
              stroke="var(--primary)"
              strokeWidth="1.5"
            />
            <text
              x="390"
              y="196"
              textAnchor="middle"
              fill="var(--foreground)"
              fontSize="12"
              fontWeight="600"
              fontFamily="var(--font-sans)"
            >
              git
            </text>
            <text
              x="390"
              y="212"
              textAnchor="middle"
              fill="var(--foreground)"
              fontSize="12"
              fontWeight="600"
              fontFamily="var(--font-sans)"
            >
              airlock
            </text>
            <text x="390" y="232" textAnchor="middle" fontSize="10">
              one way
            </text>

            {/* flow out, and the blocked return */}
            <line
              x1="322"
              y1="258"
              x2="350"
              y2="258"
              stroke="var(--primary)"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
            <line
              x1="430"
              y1="258"
              x2="516"
              y2="258"
              stroke="var(--primary)"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />

            <line
              x1="430"
              y1="300"
              x2="516"
              y2="300"
              stroke="var(--sev-critical)"
              strokeWidth="1.25"
              strokeDasharray="4 4"
            />
            <g stroke="var(--sev-critical)" strokeWidth="1.75">
              <line x1="384" y1="294" x2="396" y2="306" />
              <line x1="396" y1="294" x2="384" y2="306" />
            </g>
            <text
              x="524"
              y="304"
              fill="var(--sev-critical)"
              fontSize="10"
            >
              never back
            </text>

            {/* ---- Public zone ---- */}
            <rect
              x="518"
              y="168"
              width="322"
              height="182"
              rx="3"
              fill="none"
              stroke="var(--border)"
              strokeDasharray="4 3"
            />
            <text
              x="534"
              y="192"
              fill="var(--foreground)"
              fontSize="13"
              fontWeight="600"
              fontFamily="var(--font-sans)"
            >
              Public zone
            </text>
            <text x="534" y="209" fontSize="11">
              anything the world can reach
            </text>

            <rect
              x="612"
              y="224"
              width="212"
              height="46"
              rx="3"
              fill="var(--background)"
              stroke="var(--border)"
            />
            <text x="626" y="244" fill="var(--foreground)" fontSize="12">
              Hugo blog
            </text>
            <text x="626" y="260" fontSize="10">
              published via hugo-mcp
            </text>

            <rect
              x="612"
              y="284"
              width="212"
              height="46"
              rx="3"
              fill="var(--background)"
              stroke="var(--border)"
            />
            <text x="626" y="304" fill="var(--foreground)" fontSize="12">
              Hugo reference library
            </text>
            <text x="626" y="320" fontSize="10">
              agent-addressable publishing
            </text>

            {/* ---- Host ---- */}
            <rect
              x="20"
              y="372"
              width="820"
              height="42"
              rx="3"
              fill="none"
              stroke="var(--border)"
            />
            <text x="36" y="398" fill="var(--foreground)" fontSize="12">
              Ubuntu host
            </text>
            <text x="128" y="398" fontSize="11">
              n8n · Evolution API · Hermes — reachable over Tailscale with
              MagicDNS and subnet routing
            </text>
            <line
              x1="430"
              y1="352"
              x2="430"
              y2="370"
              stroke="var(--muted-foreground)"
              strokeWidth="1"
              markerEnd="url(#arrow-muted)"
            />
          </g>
        </svg>
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground font-mono">
        The airlock is the enforcement mechanism, not a convention. Content
        leaves the private zone for the public one and has no path back.
      </figcaption>
    </figure>
  );
}
