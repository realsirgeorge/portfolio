/**
 * Single source of truth for portfolio content.
 *
 * DISCLOSURE RULE: client identities are anonymized by contract. Specific
 * client findings, exploit details, hostnames, engagement reference numbers
 * and financial figures are not published. Case studies describe scope,
 * method and vulnerability class only. The KAPS role is named at the owner's
 * instruction; its findings and amounts remain private.
 */

export type Severity = "critical" | "high" | "medium" | "low";

export type EngagementKind = "audit" | "research" | "build" | "operations";

export interface Figure {
  /** The number itself, pre-formatted. */
  value: string;
  /** What the number counts. */
  label: string;
  /** Severity tint — reserved for finding counts only. */
  tone?: Severity;
}

export interface Section {
  heading: string;
  body?: string;
  items?: string[];
}

export interface Engagement {
  slug: string;
  title: string;
  kind: EngagementKind;
  /** Anonymized descriptor, never a name. */
  client: string;
  /** One line, used on the index. */
  summary: string;
  /** Opening paragraph on the detail page. */
  standfirst: string;
  authorization?: string;
  figures: Figure[];
  findings?: Record<Severity, number>;
  sections: Section[];
  stack: string[];
  /** Shown on the index as the reason this engagement is on the site. */
  whyItMatters: string;
  external?: { href: string; label: string };
  featured?: boolean;
}

export const PROFILE = {
  name: "George Wanyoike Njoroge",
  alias: "Sir G",
  location: "Nairobi, Kenya",
  // TODO(owner): confirm george@knight-labs.co is still a live mailbox. The firm's
  // published domain is knightlabs.co.ke; the site now shows emailAlt for
  // personal contact and routes business mail to hello@knightlabs.co.ke.
  email: "george@knight-labs.co",
  emailAlt: "realsirgeorge@gmail.com",
  phone: "+254 707 853 938",
  linkedin: "https://www.linkedin.com/in/george-wanyoike/",
  github: "https://github.com/realsirgeorge/",
  anga: "https://realsirgeorge.github.io/anga-networks-website/",
  thesis: "I build the systems I break.",
  /** The landing page's opening statement, from the brief. */
  statement:
    "I audit learning institutions and run an ISP. I find the IDORs, then I write the authorization layer that closes them. I break the edge device, then I specify the one that replaces it. The lab where I do offensive work is separated from the lab that publishes it by an airlock I built myself.",
} as const;

export const ROLES = [
  {
    title: "Founder",
    org: "Knight Labs",
    detail:
      "A Nairobi cybersecurity practice for SACCOs, clinics, schools, property managers and growing corporates. Assessment, testing, audit, advisory and incident response, with every proposal and report reviewed personally.",
    href: "/knight-labs",
  },
  {
    title: "Digital Platforms Assurance",
    org: "Kenya Airport Parking Services",
    detail:
      "Owns digital QA for the KAPS App, runs mobile and web penetration testing across the organization's platforms, and audits production infrastructure. Scope has recently widened into secure development and IoT work.",
  },
  {
    title: "Founder and Operator",
    org: "Anga Networks",
    detail:
      "An ISP running MikroTik and RouterOS infrastructure across multiple sites in Kenya. Owned and operated, with real uptime obligations to paying customers.",
    href: PROFILE.anga,
  },
  {
    title: "Chief Security Officer, independent",
    org: "Authorized testing and bug bounty research",
    detail:
      "Runs penetration tests, bug bounty research, and security audits under signed agreements, partnering with Spookie Labs Inc. on selected engagements.",
  },
] as const;

/** Training academies and skilling programs (mod 7). */
export const PROGRAMS = [
  {
    name: "Cyber Shujaa",
    org: "Serianu, USIU-Africa & Microsoft ADC",
    detail:
      "A Kenyan cybersecurity skilling program that trained me on the Security Engineer track, alongside the Microsoft Africa Development Center.",
  },
  {
    name: "ICT Authority Smart Academy",
    org: "Government of Kenya — ICT Authority",
    detail:
      "The government's digital and cybersecurity skills program under the Training 20 Million Citizens initiative, covering information security, cyber resilience, and digital-risk fundamentals.",
  },
  {
    name: "Huawei ICT Academy",
    org: "Huawei",
    detail:
      "Datacom networking training that led to the HCIA-Datacom certification — routing, switching, and enterprise network fundamentals.",
  },
  {
    name: "Cisco Networking Academy",
    org: "Cisco NetAcad",
    detail:
      "Where my Cisco track came from: CCNA, CyberOps Associate, Network Defence, and Endpoint Security.",
  },
] as const;

/** The three backed claims on the landing page. Each one links to its evidence. */
export const PROOF_POINTS = [
  {
    value: "7",
    unit: "in-scope targets",
    qualifier: "full-scope audit under NDA",
    claim: "A full-scope security audit of a learning institution, run under NDA.",
    href: "/work/university-security-audit",
  },
  {
    value: "1",
    unit: "ISP",
    qualifier: "owned and operated",
    claim:
      "Automated provisioning and zero-trust remote access across multiple Kenyan sites.",
    href: "/work/anga-networks",
  },
  {
    value: "1,701",
    unit: "lines",
    qualifier: "of engagement methodology",
    claim: "The process I run, encoded as a machine-executable reference.",
    href: "/library",
  },
] as const;

export const ENGAGEMENTS: Engagement[] = [
  {
    slug: "university-security-audit",
    title: "Full-scope security audit of a learning institution",
    kind: "audit",
    client: "A learning institution in Kenya",
    summary:
      "Seven in-scope targets, a perimeter firewall deep-dive, legacy binary analysis, and staff interviews. Findings stay with the client.",
    standfirst:
      "A full-scope audit is mostly a test of whether the ordinary controls were ever implemented. This case study describes the scope, the method and the classes of weakness examined; specific findings and exploit detail stay with the client.",
    authorization:
      "Signed SLA and NDA. Authorized by system owners and school administration. Non-destructive rules of engagement throughout.",
    figures: [
      { value: "7", label: "in-scope targets" },
      { value: "14", label: "subdomains enumerated in recon" },
      { value: "66", label: "items in the preliminary inventory" },
    ],
    sections: [
      {
        heading: "Scope came out of recon, not the other way round",
        body:
          "Reconnaissance went deliberately wider than the eventual test scope: fourteen subdomains surveyed and a 66-item preliminary inventory built before any deep-dive work began. I then triaged that inventory down to seven in-scope targets covering the public site, student portal, digital services, library system, examinations platform, e-learning platform, and an admissions system that recon itself surfaced. Broad passive enumeration first, then triage into a testable scope, rather than diving at the first interesting host.",
      },
      {
        heading: "Web application layer",
        body:
          "The web review covered authorization, authentication, session handling, transport security and version-specific CVE research. The objective was to establish whether access decisions were enforced server-side, not to collect scanner output.",
        items: [
          "Object-level authorization on document, record and payment endpoints, including identifier predictability and session binding.",
          "Authentication policy, including default, shared and legacy credentials.",
          "Unauthenticated access paths to sensitive records and internal surfaces.",
          "Session handling and transport security across public and authenticated surfaces.",
          "Version-specific CVE research against the frameworks actually deployed.",
          "Attack chaining across individually moderate issues to establish real business impact.",
        ],
      },
      {
        heading: "Perimeter firewall deep-dive",
        body:
          "The firewall review treated segmentation as a governance property, not just a rule-set check. The most consequential issues in this class are usually architectural: flat networks and shared trust between segments that should never reach each other.",
        items: [
          "Firmware and remote-access exposure on the perimeter appliance, assessed against the deployed version.",
          "Administrative authentication and two-factor coverage.",
          "DHCP and network-visibility hygiene.",
          "Segmentation between medical, financial, surveillance and general-user estates.",
        ],
      },
      {
        heading: "Legacy application analysis",
        body:
          "Static and dynamic analysis of a legacy closed-source application, started under Wine on Linux and finished on a purpose-built Windows VM where the compatibility layer fell short. No source, no reachable vendor, and a binary that production depends on. The review covered injection, authorization and access-control behaviour.",
      },
      {
        heading: "The human layer",
        body:
          "Structured interviews with network administration staff surfaced governance and operational gaps that no scanner would have found. The interview is a technical control, not a soft formality.",
        items: [
          "Physical access controls and unmanaged network ports.",
          "Consumer-grade equipment and shared credentials in departmental use.",
          "Remote-access coverage and consistency.",
          "Backup handling and configuration storage.",
        ],
      },
      {
        heading: "Disclosure handling",
        body:
          "Critical exposures were reported to the institution immediately on discovery, ahead of the final report. Breaking the reporting rhythm when a finding warrants it is part of the job, not an exception to it. The specifics of what was reported remain private.",
      },
    ],
    stack: [
      "Burp Suite",
      "Nmap",
      "CVSS 4.0",
      "Moodle",
      "Laravel",
      "Wine",
      "KVM/libvirt",
    ],
    whyItMatters:
      "My strongest single artifact. Full lifecycle, under NDA, with disclosure decisions I made in real time. The method is public; the findings are not.",
    featured: true,
  },
  {
    slug: "client-side-credential-exposure",
    title: "Client-side credential exposure across identity platforms",
    kind: "audit",
    client: "A client application review",
    summary:
      "How credentials leak into browser and mobile storage, and how the same trust-boundary failure appears across identity platforms.",
    standfirst:
      "Client-side credential exposure is rarely a single bad line of code. It is a missing projection boundary between the API and the client store, reproduced across Firebase, Cognito, Entra, Auth0 and Supabase clients. This case study describes the class and the review method; the specific client finding stays private.",
    figures: [
      { value: "CWE-522", label: "insufficiently protected credentials" },
      { value: "API3:2023", label: "OWASP broken object property level authz" },
      { value: "6", label: "identity platforms covered by the comparison" },
    ],
    sections: [
      {
        heading: "The pattern",
        body:
          "The recurring pattern is an API returning a full record, a client store hydrating it, and persistence middleware serialising the whole store. The sensitive fields were never intentionally placed in storage; they arrived because no layer asked which fields the client actually needed.",
      },
      {
        heading: "Where it surfaces",
        items: [
          "localStorage and sessionStorage, readable by any script in the origin.",
          "IndexedDB and Cache Storage, which hold larger objects and survive longer than a tab.",
          "Mobile stores: SharedPreferences, UserDefaults and WebView localStorage.",
          "Debug logs, crash reports and device backups that copy the same values off-browser.",
          "Server-rendered hydration payloads that embed the full record for the client to pick up.",
        ],
      },
      {
        heading: "Why this is a class of bug, not a one-off",
        body:
          "Any stack that combines an ORM returning full models, an API without response shaping, and a persisted client store has the same exposure latent in it. The same shape appears in Redux Persist, Zustand persist, Pinia, NgRx, React Query persist and hand-rolled localStorage caches. It also appears in mobile apps that mirror API responses into SharedPreferences, UserDefaults or a WebView store. The state library is not at fault. The absence of a projection boundary is.",
      },
      {
        heading: "Storage is the symptom; trust boundaries are the bug",
        items: [
          "localStorage and sessionStorage are readable by any script in the origin. An XSS is a full credential compromise, not a defacement.",
          "IndexedDB and Cache Storage hold larger objects and survive far longer than a tab; a service worker can cache responses containing secrets.",
          "Client-side encryption does not fix this when the key ships to the client. It changes the encoding, not the trust boundary.",
          "Mobile backups, debug logs, crash reports and WebView storage extend the same exposure off-browser.",
          "The only durable rule: if the client never receives the secret, no client-side store can leak it.",
        ],
      },
      {
        heading: "The same exposure across identity platforms",
        items: [
          "Firebase: ID and refresh tokens persist by default; custom claims are authorization data and must be set server-side; App Check attests the app, not the user; API keys are public identifiers whose safety depends entirely on rules.",
          "AWS Cognito and Amplify: the default token cache is browser storage; identity pools can mint AWS credentials for unauthenticated users; unauthenticated roles must be scoped to almost nothing; server-rendered apps should prefer cookie storage or a backend-for-frontend.",
          "Microsoft Entra ID and MSAL: cacheLocation decides whether tokens live in memory, sessionStorage or localStorage; refresh tokens and scopes need explicit review; conditional access does not compensate for a token that XSS can read.",
          "Auth0 and generic OIDC: SPA SDKs store tokens in the browser unless you adopt the BFF pattern; PKCE protects the code exchange, not the token after issuance; refresh-token rotation limits the blast radius but does not remove it.",
          "Supabase: the anon key is designed to be public; Row Level Security is the actual boundary; the service_role key must never ship to a client; JWT expiry and refresh policy decide how long a leaked token survives.",
          "Custom JWT: localStorage is XSS-readable; httpOnly Secure SameSite cookies are not script-readable but need CSRF care; in-memory access tokens with a refresh cookie are a reasonable middle ground.",
          "Mobile: Keychain and Keystore are the right home for refresh tokens; SharedPreferences, UserDefaults, WebView localStorage, logs and device backups are where they usually end up instead.",
        ],
      },
      {
        heading: "Response shaping and serverless backends",
        items: [
          "Serverless removes the application server but not the need for a serialization boundary. API Gateway mappings, Lambda handlers, Cloud Functions callables, Azure Functions and Supabase RPC all return whatever you let them return.",
          "Return a DTO with an allowlist, not an ORM model. Field-level authorization belongs next to the query, not in the component that happens to render it.",
          "GraphQL needs field-level checks and query-cost limits; a single resolver returning a full user object defeats the schema's apparent safety.",
          "Tenant isolation belongs in the data layer: Firestore rules, DynamoDB leading keys and condition expressions, Cosmos DB partition keys plus RBAC, Postgres RLS, or D1 queries scoped by tenant.",
          "Never return secrets, internal identifiers, password hashes or provider credentials, even to an authenticated administrator. Admin is a role, not a licence to leak.",
        ],
      },
      {
        heading: "Third-party credentials are the worst offenders",
        items: [
          "Mobile money, SMS, email, maps and payment integrations usually ship a key to the client because it is the fastest path to a demo. The same key then sits in a bundle anyone can download.",
          "Separate publishable keys from secret keys. A publishable key identifies a project; a secret key authorises spending, messaging or data access.",
          "Proxy privileged third-party calls through a backend or serverless function, with per-user rate limits, scoped tokens and rotation.",
          "Rotate anything that has ever been in a client bundle. Removing it from the next release does not remove it from the old one.",
        ],
      },
      {
        heading: "Detection: assume the bundle is public",
        items: [
          "Read the production bundle and source maps; search for token patterns, provider key prefixes, internal hostnames and mobile money identifiers.",
          "Inspect localStorage, sessionStorage, IndexedDB, Cache Storage and cookies after a normal login, not only after an attack.",
          "Add secret scanning to CI and pre-commit hooks, plus dependency review so a new SDK does not silently add a persisted token cache.",
          "Use CSP and Trusted Types to reduce XSS reach, and monitor token use for anomalous geography, velocity or scope.",
          "Plant canary credentials in client-accessible configuration and alert on their use. A canary that fires is a detection win; one that never fires costs nothing.",
        ],
      },
      {
        heading: "Remediation that removes the class",
        items: [
          "Introduce projection at the API boundary and delete sensitive fields before they reach the store.",
          "Stop persisting whole stores; persist only non-sensitive UI state, with an explicit allowlist.",
          "Move refresh tokens to httpOnly Secure SameSite cookies or a BFF; keep access tokens short-lived and in memory where possible.",
          "Revoke and rotate every credential that was exposed, then shorten TTLs and scope keys to the minimum.",
          "Add contract tests that fail when a response gains an unexpected sensitive field, and lint rules that block persistence of auth slices.",
          "Treat mobile storage as a separate surface: Keychain or Keystore for tokens, no secrets in logs, backups excluded where appropriate.",
        ],
      },
      {
        heading: "Checklist across platforms",
        items: [
          "Firebase: rules tested with the emulator; App Check enforced; custom claims set only by trusted code.",
          "AWS: Cognito unauthenticated roles empty; API Gateway authorizers on every route; Lambda roles scoped per function.",
          "Azure: Entra token audience and tenant validated; Functions auth level not anonymous by accident; managed identities for service calls.",
          "Supabase: RLS enabled on every table; service_role absent from client bundles; storage policies match table policies.",
          "Cloudflare and edge platforms: secrets bound per environment; preview deployments protected; JWTs verified at the edge, not just decoded.",
          "Mobile: Keychain or Keystore, no secrets in logs, backup rules reviewed.",
        ],
      },
    ],
    stack: [
      "Firebase",
      "JWT",
      "Redux-style persistence",
      "OWASP API Top 10",
      "AWS Cognito",
      "Azure Entra / MSAL",
      "Auth0 / OIDC",
      "Supabase RLS",
      "Browser storage APIs",
    ],
    whyItMatters:
      "A reusable review pattern. The interesting part is the missing boundary, not the storage call — and the same boundary is missing on every identity platform until someone tests it.",
    featured: true,
  },
  {
    slug: "firestore-rules-assessment",
    title: "Serverless security beyond Firestore rules",
    kind: "audit",
    client: "A client platform review",
    summary:
      "A cross-provider review model for serverless authorization: identity, data-plane rules, function roles, storage and deployment drift.",
    standfirst:
      "Serverless security is configuration security. The client talks to a managed data plane, the identity provider mints the token, and a rules file or IAM policy is the only thing between one tenant and another. This case study describes the review model I apply across Firebase, AWS, Azure, Supabase and Cloudflare; specific findings stay with the client.",
    figures: [
      { value: "5", label: "platform models in the cross-provider checklist" },
      { value: "6", label: "review workstreams" },
    ],
    sections: [
      {
        heading: "Why serverless authorization is easy to get wrong",
        body:
          "The distinction between list and read permissions is subtle enough that a ruleset can pass a casual review, behave correctly on the common path, and still permit direct document access the author believed was blocked. A query can be denied while a direct document get is allowed, or the reverse, depending on how the rule is written. The browser SDK talks to the data plane directly, so there is no server-side controller to catch what the rule misses. Rules are code, and they need the same adversarial reading and tests as the application they protect.",
      },
      {
        heading: "Serverless moves the perimeter into configuration",
        body:
          "In a traditional stack, the application server is a chokepoint: every request passes through code you can review, instrument and patch. In a serverless stack the client talks to a managed data plane, the identity provider mints the token, and the only thing standing between a user and another tenant's data is a rules file, an IAM policy or a row-level security policy. There is no bastion host to scan and no middleware to add a check to. The configuration is the security control, and it is usually deployed by a different pipeline from the application.",
      },
      {
        heading: "The same failure modes, provider by provider",
        items: [
          "Firebase and Google Cloud: Firestore and Storage rules; callable functions must validate the auth context; App Check is attestation, not authorization; service-account IAM and Cloud Run ingress decide what the backend can reach; Secret Manager instead of environment variables.",
          "AWS: Cognito user and identity pools, API Gateway authorizers, Lambda execution roles, DynamoDB condition expressions and leading keys, S3 Block Public Access and presigned URLs, and resource policies on EventBridge, SNS and SQS that can invite a confused-deputy call.",
          "Azure: Entra ID app registrations and token audience, Functions auth levels and function keys, Cosmos DB data-plane RBAC and partition-key design, Blob SAS scope and stored access policies, managed identities and Key Vault references.",
          "Supabase and Postgres: RLS enabled on every table, separate policies for select, insert, update and delete, security-definer functions with a fixed search_path, anon versus service_role key handling, and storage policies that mirror table policies.",
          "Cloudflare: Workers with D1, R2 and KV bindings; Access or JWT verification at the edge; WAF and rate limits; per-environment secrets; preview URLs that are not public by default.",
          "Vercel and Netlify: edge function environment scoping, preview deployments, build logs and deploy protection. A preview URL with production secrets is a production incident with a staging hostname.",
        ],
      },
      {
        heading: "Identity is the only front door",
        items: [
          "Validate the token, not its presence: signature, issuer, audience, expiry and revocation. A decoded JWT is not a verified JWT.",
          "Roles and tenant IDs belong in server-issued claims, never in a request body the client controls. Refresh claims when roles change; stale claims are stale authorization.",
          "Cognito identity pools can issue AWS credentials to unauthenticated users. If you enable that path, scope the role to almost nothing and log its use.",
          "Entra and OIDC integrations need tenant and audience checks; a token from the wrong app or tenant must fail closed.",
          "Supabase's anon key is public by design. RLS is the boundary; the service_role key bypasses RLS and must never reach a browser or a mobile bundle.",
          "Firebase App Check reduces abuse of your project by unattested clients, but it does not tell you who the user is. Do not use it as an authorization decision.",
        ],
      },
      {
        heading: "Function and event security",
        items: [
          "Validate event payloads. Lambda events, Pub/Sub messages, queue bodies and webhook payloads are attacker-controlled input, not trusted internal calls.",
          "Give each function its own role or identity. A shared execution role turns one compromised function into the union of every permission in the account.",
          "Check the source on resource policies: an SNS topic or S3 bucket that can invoke a function from another account is a confused deputy waiting to happen.",
          "Use a secret manager with rotation; environment variables are visible to anyone who can read the function configuration and often end up in logs.",
          "Bound recursion, concurrency and timeouts; add dead-letter queues and idempotency keys so a retry storm does not become a billing incident.",
          "Treat dependencies and base images as part of the perimeter: pin, scan and rebuild on a schedule.",
        ],
      },
      {
        heading: "Storage and signed URLs",
        items: [
          "Block public access at the account or project level, then allow the specific bucket or container you mean.",
          "Scope presigned URLs by method, object, content type and a short expiry. Never sign a prefix that covers other tenants.",
          "Mirror storage authorization to data authorization: Firebase Storage rules, S3 bucket policies, Azure SAS and R2 bindings all need the same tenant check as the database.",
          "Watch metadata: object names, content types and error messages can enumerate users or internal structure even when the bytes are protected.",
        ],
      },
      {
        heading: "The authorization tests that generalize",
        items: [
          "Unauthenticated direct read and write against every collection, table, bucket and function.",
          "Authenticated cross-tenant read: sign in as tenant A and request tenant B's object by ID.",
          "list versus get: test the query path and the direct-document path separately; a rule can deny one and allow the other.",
          "Field-level projection: confirm the response does not include password hashes, internal IDs, provider credentials or another user's PII.",
          "Function invocation outside the UI: call the function directly with a valid token but the wrong role or tenant.",
          "Token tampering: change the audience, issuer, tenant or role claim and confirm the service rejects it.",
          "Expired and revoked tokens: confirm they fail, and that refresh cannot resurrect a revoked session.",
          "Signed URL reuse after expiry, and with a different method or content type.",
          "Rules drift: compare the deployed rules, IAM policies and RLS policies against the repository, environment by environment.",
          "Bulk export and error enumeration: pagination, CSV endpoints and verbose errors often bypass UI-level checks.",
        ],
      },
      {
        heading: "Deployment drift is the quiet failure",
        items: [
          "Rules, IAM and RLS are code. Keep them in version control, review them like application code, and deploy them with the app.",
          "Test with the provider's emulator or a local stand-in: Firestore emulator, LocalStack, Azurite, Supabase CLI, Miniflare.",
          "Stage a rule diff and a rollback path; a permissive rule pushed at 2 a.m. should be reversible in one command.",
          "Alert on denied-request spikes, auth failures and function errors. A sudden drop in denials can mean someone found a path that no longer denies.",
          "Audit service accounts and CI identities on a schedule; a stale deploy key with owner rights is the serverless equivalent of a forgotten VPN account.",
          "Keep preview and production projects separate, with separate credentials and data.",
        ],
      },
      {
        heading: "What a review produces",
        body:
          "A prioritised remediation plan, corrected rule or policy definitions where needed, and a regression suite that exercises direct data-plane access. The client keeps the detail; the method is what generalises.",
      },
    ],
    stack: [
      "Firebase",
      "Firestore security rules",
      "Cloud Functions",
      "AWS IAM / Cognito",
      "Azure Entra / Functions",
      "Supabase RLS",
      "Cloudflare Workers",
    ],
    whyItMatters:
      "Serverless shifts the authorization boundary into configuration. Most reviews still do not read that configuration adversarially — on any provider.",
  },
  {
    slug: "revenue-loss-analysis",
    title: "Revenue assurance through operational data",
    kind: "research",
    client: "target-company",
    summary:
      "A method for turning operational records into a revenue-assurance review management can act on.",
    standfirst:
      "Not every assurance finding arrives through an exploit. Revenue-assurance work asks whether the operational data agrees with the money, and whether the classification and approval rules behind it are being followed. This case study describes the method; the client's figures and findings stay private.",
    figures: [
      { value: "3", label: "data layers reconciled" },
      { value: "1", label: "management-ready report" },
    ],
    sections: [
      {
        heading: "The question",
        body:
          "Revenue assurance starts with a simple question: does the recorded transaction agree with the category, approval and price that should have applied? The analysis reconciles operational records against the rules the business believes it is running, then isolates where the two diverge.",
      },
      {
        heading: "Where the method looks",
        items: [
          "Classification and category rules, including who can change them and how changes are approved.",
          "Submitter and channel concentration, to distinguish a systemic rule problem from a local one.",
          "Approval overrides and exceptions that bypass the normal workflow.",
          "Reconciliation gaps between operational records, billing and reported revenue.",
          "Reporting definitions that can hide a loss by aggregating it into a benign-looking line.",
        ],
      },
      {
        heading: "Why it belongs in a security portfolio",
        body:
          "Assurance work that produces a financial finding is often more persuasive inside an organization than a CVSS 9.8, because it arrives in the unit the board already uses. Practitioners undersell this capability, and it is a real one. The discipline is the same: establish what should be true, test whether it is, and trace the gap to a control.",
      },
      {
        heading: "Reporting",
        body:
          "The output is a management-ready pack: the observed pattern, the control that should have caught it, and the remediation owner. Specific figures remain with the client.",
      },
    ],
    stack: ["Data analysis", "Operational auditing", "Controls review"],
    whyItMatters:
      "Breaks the stereotype that security work is only technical. The method is data analysis, not exploitation.",
    featured: true,
  },
  {
    slug: "availability-monitoring",
    title: "Availability monitoring that does not cry wolf",
    kind: "build",
    client: "A multi-site platform",
    summary:
      "The same monitoring problem shipped twice, at radically different complexity levels.",
    standfirst:
      "A monitoring system people mute is worse than no monitoring at all. Both builds here are organized around one decision: a four-state machine instead of an up/down binary.",
    figures: [
      { value: "4", label: "states, not two" },
      { value: "30+", label: "Tier 2 worksites covered" },
      { value: "2", label: "implementations of one design" },
    ],
    sections: [
      {
        heading: "The state machine is the whole design",
        body:
          "HEALTHY, CONFIRMING_DOWN, DOWN, CONFIRMING_UP. The two confirming states exist purely to absorb transient failures before an alert fires. They are the difference between a monitoring system people trust and one they filter into a folder they never open.",
      },
      {
        heading: "The serverless build",
        body:
          "Cloudflare Workers with Firebase Realtime Database as the state store, covering Tier 1 core endpoints and more than thirty Tier 2 worksites.",
      },
      {
        heading: "The systemd build",
        body:
          "The same concept as a single-file Bash systemd service: parallel ping sweeps, JSON reported over HTTP on port 9000, and the speedtest worker decoupled so a slow bandwidth check never blocks liveness reporting.",
      },
      {
        heading: "What shipping it twice taught",
        body:
          "Building the same system at two very different weights is the fastest way to find out what it actually needs. The serverless version buys global vantage points and managed state. The Bash version proves how much of the rest was never load-bearing.",
      },
    ],
    stack: [
      "Cloudflare Workers",
      "Firebase RTDB",
      "Bash",
      "systemd",
      "JSON over HTTP",
    ],
    whyItMatters:
      "The build half of the thesis. Answers a finding with an operational system.",
  },
  {
    slug: "bug-bounty-research",
    title: "Bug bounty and independent research",
    kind: "research",
    client: "Public programs and self-directed work",
    summary:
      "Authorization review, passive reconnaissance, static source review and CTF practice.",
    standfirst:
      "Ongoing independent research across public bug bounty programs and self-directed review. Findings are described by class, not by target, and specific candidates remain with the program.",
    figures: [
      { value: "3", label: "active platforms in rotation" },
      { value: "3", label: "research workstreams" },
    ],
    sections: [
      {
        heading: "Major online travel platform, via HackerOne",
        body:
          "Authorization and authentication review on a public program. The work produced a structured recon summary and a continuity brief so the engagement could be resumed cleanly later. Writing handoff documentation for your future self is an underrated part of the methodology.",
      },
      {
        heading: "Regional mobility startup, passive reconnaissance only",
        body:
          "Passive reconnaissance across public infrastructure, certificate transparency and DNS posture. The value is in producing observations without sending a single packet to the target.",
      },
      {
        heading: "Authentication template, static source review",
        body:
          "Static source review of an authentication template, focused on randomness, proxy trust and client-side token handling. The general lesson: random enough is not a security property.",
      },
      {
        heading: "Capture the flag",
        body:
          "A session-hijacking challenge solved through methodical analysis of a debug surface and confirmed by manual testing. Debug endpoints surviving into production are a vulnerability class, not an accident. Active on Hack The Box, TryHackMe and picoCTF.",
      },
    ],
    stack: ["HackerOne", "Burp Suite", "crt.sh", "Semgrep", "DNS tooling"],
    whyItMatters:
      "Continuous practice against targets that did not agree to be easy.",
  },
  {
    slug: "anga-networks",
    title: "Anga Networks",
    kind: "operations",
    client: "Owned and operated",
    summary:
      "An ISP on MikroTik and RouterOS across multiple Kenyan sites, with an automation layer built for it.",
    standfirst:
      "Running an ISP while doing security work means every security opinion has been paid for operationally. This is a business with paying customers and real uptime obligations, not a lab.",
    figures: [
      { value: "9", label: "workflows in the automation architecture" },
      { value: "802.3ad", label: "LACP link aggregation in production" },
    ],
    sections: [
      {
        heading: "Network engineering",
        body:
          "LACP 802.3ad link aggregation across multiple interfaces for bandwidth aggregation, plus field deployment of Starlink and wireless distribution systems across sites.",
      },
      {
        heading: "Operational automation",
        body:
          "A purpose-built ISP management platform with n8n as the orchestration layer, the RouterOS REST API for device control, Evolution API for WhatsApp customer notifications, and Google Sheets as a deliberately lightweight database. Nine workflows in the architecture, with the activity logger shipped as an importable n8n package.",
      },
      {
        heading: "Choosing Sheets over a real database",
        body:
          "A defensible call at this scale, and a deliberate one. Right-sizing infrastructure to the operation you actually have beats cargo-culting the architecture of a company a hundred times your size.",
      },
      {
        heading: "Secure remote access",
        body:
          "Migrated the estate from Twingate to Tailscale, with MagicDNS and subnet router configuration. A zero-trust overlay network sized for an operator who cannot justify enterprise tooling.",
      },
    ],
    stack: [
      "MikroTik RouterOS",
      "n8n",
      "Evolution API",
      "Tailscale",
      "Starlink",
      "LACP 802.3ad",
    ],
    whyItMatters:
      "My strongest answer to the charge that security people do not run production. I carry the pager for it.",
    external: { href: PROFILE.anga, label: "Anga Networks website" },
    featured: true,
  },
  {
    slug: "edge-ai-security",
    title: "Edge AI without the trust boundary fantasy",
    kind: "research",
    client: "IoT deployment evaluation",
    summary:
      "A comparative evaluation of edge AI compute platforms, extended into a security thesis.",
    standfirst:
      "Edge AI devices are unattended compute in physically hostile environments, and almost all of the deployment guidance ignores that. The hardware comparison is the foundation; the threat model is the point.",
    figures: [
      { value: "11", label: "pages of comparative platform evaluation" },
      { value: "5", label: "security criteria added to the scoring" },
    ],
    sections: [
      {
        heading: "The evaluation",
        body:
          "A formal comparative evaluation of edge AI compute platforms as alternatives to the NVIDIA Jetson Orin Nano, covering Rockchip RK3588-based boards, Raspberry Pi CM4/CM5, Hailo-8 accelerators, and industrial-tier system-on-modules from vendors including Toradex and Nodka. Scored across inference performance, thermal behaviour, power draw, industrial availability, and vendor support lifecycle.",
      },
      {
        heading: "Model theft at the edge",
        body:
          "A deployed inference device carries the model weights. Physical access to the board is access to the intellectual property. Secure boot and encrypted storage are the controls, and platforms differ sharply between what they offer and what they claim.",
      },
      {
        heading: "Accelerator supply chain trust",
        body:
          "Choosing between NPU vendors is also choosing whose closed firmware blob runs on your network. The useful evaluation criterion is what a platform lets you verify.",
      },
      {
        heading: "The unattended device threat model",
        body:
          "Parking lots, roadsides, remote sites. Tamper detection, exposed UART, JTAG and USB ports, and the question every deployment eventually faces: what happens when someone walks off with the enclosure.",
      },
      {
        heading: "The inference pipeline is attack surface",
        body:
          "Adversarial input against camera-fed models in the field. The sensor is an untrusted input channel like any other, and it is rarely treated as one.",
      },
    ],
    stack: [
      "Rockchip RK3588",
      "Raspberry Pi CM4/CM5",
      "Hailo-8",
      "NVIDIA Jetson",
      "ESP32",
      "Secure boot",
    ],
    whyItMatters:
      "Where my security practice, IoT work, and hardware evaluation meet. A genuinely underserved niche locally.",
  },
  {
    slug: "restaurant-assessment",
    title: "Security assessment of a restaurant's digital estate",
    kind: "audit",
    client: "A restaurant business",
    summary:
      "Website and online ordering, payment handling, and the network the till sits on — assessed as one connected surface.",
    standfirst:
      "Small hospitality businesses run more attack surface than they realize. This engagement looked at three surfaces a restaurant actually depends on, and at how they connect: the public site and its online ordering flow, the payment path, and the network that carries both.",
    figures: [
      { value: "3", label: "surfaces assessed as one system" },
      { value: "POS", label: "and mobile-money payment path reviewed" },
      { value: "1", label: "guest and till network, examined for shared trust" },
    ],
    sections: [
      {
        heading: "Website and online ordering",
        body:
          "The public site and its ordering flow are where a restaurant meets the internet, and where customer contact details and order data live. I reviewed the ordering path for the usual web weaknesses — authorization on order and account objects, input handling, and how session state is kept — because an ordering flow is a small e-commerce app whether or not anyone treats it as one.",
      },
      {
        heading: "Payment handling — card and mobile money",
        body:
          "Kenyan hospitality runs on mobile money as much as on cards, and both paths deserve the same scrutiny. The question I care about is where payment credentials and transaction data travel, what is stored versus passed through, and whether the integration leaks anything a customer or a passer-by on the same network could pick up.",
      },
      {
        heading: "The network the till sits on",
        body:
          "The most common restaurant finding is not a web bug at all: it is a flat network where the guest WiFi, the point-of-sale till, and the back office all share one segment and often one router password. One guest device should never be able to reach the till. Segmentation is the control, and it is usually the cheapest thing to fix and the most consequential to leave alone.",
      },
      {
        heading: "Why a small business is worth doing properly",
        body:
          "A restaurant is not a low-stakes target. It handles payment data, it holds customer contacts, and it runs on consumer-grade equipment installed by whoever was cheapest. The engagement was scoped to the surfaces that carry real risk rather than to a generic checklist, and reported in language the owner could act on without a security team to translate it.",
      },
    ],
    stack: [
      "Web application testing",
      "Payment / mobile-money review",
      "Network segmentation",
      "Guest WiFi",
      "Point of sale",
    ],
    whyItMatters:
      "Security work sized for a small business, not scaled down from an enterprise checklist. The value is in picking the three surfaces that matter.",
  },
  {
    slug: "blazin-ice",
    title: "Blazin Ice",
    kind: "build",
    client: "Synthetic ice facility",
    summary:
      "A full-stack commercial web build, delivered on a milestone schedule, built with a pentester's defaults.",
    standfirst:
      "A full-stack build for a synthetic ice facility under a formal contract. It is on this site because a findings list alone leaves an obvious question unanswered: can I build the thing I keep breaking.",
    figures: [
      { value: "11", label: "pages in the delivered site structure" },
      { value: "40/30/30", label: "milestone payment schedule" },
    ],
    sections: [
      {
        heading: "What was built",
        body:
          "A React frontend on a Node.js backend with MySQL, delivered across an eleven-page site structure under a formal contract with a defined scope and a staged payment schedule.",
      },
      {
        heading: "Security decisions made during an ordinary build",
        body:
          "A developer who spends the week finding IDORs in other people's applications writes authorization checks differently. Input handling, session management, credential storage, and dependency posture were deliberate decisions here rather than framework defaults — and each one cost minutes during the build rather than weeks during an incident.",
      },
      {
        heading: "The commercial side",
        body:
          "Scoping, contracting, staged delivery, and getting paid. Most technical portfolios are silent on this, and it is exactly what matters for senior or independent work.",
      },
      {
        heading: "What would be done differently",
        body:
          "The milestone structure tracked pages delivered rather than capability delivered, which front-loaded visible progress and pushed integration work into the final third. Scoping the next one by capability would smooth that out and give the client a more honest read on progress.",
      },
    ],
    stack: ["React", "Node.js", "MySQL"],
    whyItMatters:
      "Proof I ship production software and run engagements commercially, not just proof-of-concept code.",
  },
];

export function getEngagement(slug: string): Engagement | undefined {
  return ENGAGEMENTS.find((e) => e.slug === slug);
}

export const KIND_LABEL: Record<EngagementKind, string> = {
  audit: "Security audit",
  research: "Research",
  build: "Build",
  operations: "Operations",
};
