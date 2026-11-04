"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { BdMap } from "./AIFlatDiagrams";
import IsoDiagram from "./IsoDiagram";
import { Reveal } from "./Reveal";

const AIInfra3D = dynamic(() => import("./AIInfra3D"), { ssr: false, loading: () => <div className="h-[680px] border-t border-line-dark md:h-[820px]" /> });

function Frame({ n, tag, title, sub, note, light, children }: { n: string; tag: string; title: React.ReactNode; sub?: string; note?: string; light?: boolean; children: React.ReactNode }) {
  return (
    <section className={`flex border-b ${light ? "border-line bg-paper" : "border-line-dark bg-ink text-white"}`}>
      <div className={`rail ${light ? "border-line" : "border-line-dark"} text-mute`}>{n}</div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col gap-5 px-5 pb-12 pt-20 md:px-10 lg:px-14 lg:pb-14 lg:pt-[104px]">
          <Reveal><span className={`tag label ${light ? "border-[#D6D4CD] bg-white text-ink" : "border-line-strong text-white"}`}><i className="tag-dot" />{tag}</span></Reveal>
          <Reveal delay={0.05}><h2 className="h-display text-[36px] leading-[1.03] md:text-[48px]">{title}</h2></Reveal>
          {sub && <Reveal delay={0.1}><p className={`max-w-[640px] text-[18px] leading-7 ${light ? "text-body" : "text-soft"}`}>{sub}</p></Reveal>}
        </div>
        {children}
        {note && <p className={`border-t px-5 py-5 text-[14px] leading-[22px] md:px-10 lg:px-14 ${light ? "border-line text-body" : "border-line-dark text-soft"}`}>{note}</p>}
      </div>
    </section>
  );
}

const LAYERS: [string, string, string[]][] = [
  ["Compute and data", "Planned GPU servers, protected shared storage, redundant networking and a separate backup system provide the technical foundation.", ["GPU servers", "Shared storage", "100GbE fabric", "Backup system"]],
  ["Infrastructure OS", "A central operating layer is designed to allocate resources, schedule workloads, monitor health and usage, and support accountable recovery.", ["Resource allocation", "Scheduling", "Health and usage", "Recovery"]],
  ["AI and knowledge services", "Approved models, permission-aware knowledge retrieval, model routing and controlled tool access support useful AI services.", ["Approved models", "Knowledge retrieval", "Model routing", "Controlled tools"]],
  ["Applications and integrations", "Department assistants, research environments and approved APIs connect AI capability to existing applications and workflows.", ["Department assistants", "Research environments", "Approved APIs"]],
  ["People and institutions", "Students, researchers, staff and approved teams receive access suited to their role, purpose and resource allocation.", ["Students", "Researchers", "Staff", "Approved teams"]],
  ["Future enterprise services", "Selected external tenants can be considered after internal acceptance, isolation, support and commercial readiness are demonstrated.", ["After internal acceptance", "Tenant isolation", "Support readiness"]],
];
export function AIInfraSection() {
  return (
    <Frame n="07.5" tag="Architecture" title={<>From infrastructure to<br /><span className="text-mute">useful, governed services.</span></>} sub="Explore the proposed platform floor by floor, from GPU servers to the people who use them. Security, governance and recovery span the whole system."
      note="Infrastructure OS means the shared management and orchestration layer. Existing business applications retain their owners and responsibilities. DOL Unified remains the internal operations system, connected through approved APIs and events.">
      <AIInfra3D />
      <div className="grid grid-cols-1 border-t border-line-dark md:grid-cols-2 lg:grid-cols-3">{LAYERS.map(([t, b, c], i) => <div key={t} className="flex flex-col gap-3 border-b border-line-dark p-7 md:border-r"><span className="label text-red">Layer {i + 1}</span><span className="text-[20px] font-medium">{t}</span><span className="text-[15px] leading-[23px] text-soft">{b}</span><span className="flex flex-wrap gap-1.5">{c.map((x) => <span key={x} className="twin-tag">{x}</span>)}</span></div>)}</div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-5 text-[14px] md:px-10 lg:px-14"><span className="label text-red">Across every layer</span>{["Identity and permissions", "Data policy", "Human approval", "Audit and usage", "Recovery"].map((x) => <span key={x}>{x}</span>)}</div>
    </Frame>
  );
}

/* Reference infrastructure */
const STATS = [["2", "GPU servers"], ["8", "initial GPUs, expandable to 16"], ["100TB+", "protected usable storage"], ["100GbE", "redundant network fabric"]];
const SPEC = [
  ["Production compute", "2 independent GPU servers, with 4 NVIDIA RTX PRO 6000 Blackwell Server Edition 96GB GPUs per server at the initial stage: 8 GPUs total."],
  ["Expansion pathway", "Each server is designed around an 8-GPU-capable chassis, allowing a proposed expansion to 16 matching GPUs total, subject to supported configuration and facility acceptance."],
  ["Server resources", "Reference requirement per GPU server: at least 96 physical CPU cores, 1TB ECC memory, 15–20TB enterprise local NVMe and mirrored boot SSDs."],
  ["Shared storage", "1 logical HA storage system, with at least 100TB protected usable capacity, expandable to at least 300TB."],
  ["Network fabric", "Redundant 100GbE AI and storage networking, with dual-connected servers and separate management access."],
  ["Central management", "1 logical HA management platform, implemented using 3 small nodes or a validated HA equivalent."],
  ["Backup and recovery", "A separate dedicated backup system, protected copies and tested restoration, with a planned off-site recovery copy."],
];
export function AIReference() {
  return (
    <Frame n="07.6" light tag="Reference infrastructure" title={<>A scalable architecture,<br />with resilience designed in.</>} sub="Planned AI compute at Daffodil Smart City, Ashulia, with a protected off-site recovery copy at Dhanmondi."
      note="Eight 96GB GPUs give 768GB of GPU memory in total, distributed across individual GPUs and servers. It is not one pooled accelerator. These are design requirements, not installed capacity or a final vendor bill of materials. Recovery copies support restoration; they do not imply a second live GPU site.">
      <div className="grid grid-cols-2 border-t border-line bg-white lg:grid-cols-4">
        {STATS.map(([v, l]) => <div key={l} className="flex flex-col gap-2 border-b border-r border-line px-5 py-7 md:px-10 lg:border-b-0 lg:last:border-r-0"><span className="font-mono text-[32px] font-medium leading-none md:text-[40px]">{v}</span><span className="text-[14px] leading-5 text-body">{l}</span></div>)}
      </div>
      <div className="grid grid-cols-1 gap-4 border-t border-line p-5 md:grid-cols-2 md:p-10 lg:px-14">{["GPU server A", "GPU server B"].map((n) => <div key={n} className="twin-flat flex flex-col gap-3 p-5"><span className="text-[20px] font-medium">{n}</span><span className="grid grid-cols-8 gap-1">{Array.from({ length: 8 }, (_, i) => <span key={i} className={`keep-white flex h-16 items-center justify-center rounded-[3px] text-[10px] font-medium ${i < 4 ? "bg-red text-white" : "border border-dashed border-mute text-mute"}`}>{i < 4 ? "96GB" : "+"}</span>)}</span><span className="text-[14px] text-body">4 GPUs initially · 8-GPU-capable chassis</span><span className="flex flex-wrap gap-1.5">{["96+ physical CPU cores", "1TB ECC memory", "15–20TB local NVMe", "Mirrored boot SSDs"].map((x) => <span key={x} className="twin-tag">{x}</span>)}</span></div>)}</div>
      <div className="flex flex-col border-t border-line bg-white lg:flex-row">
        <div className="group/s relative aspect-[4/3] lg:w-[46%] lg:shrink-0 lg:border-r lg:border-line"><div className="group absolute inset-0"><IsoDiagram kind="rack" className="absolute inset-[10%]" /><span className="sr-only">Concept illustration of a planned AI rack.</span></div></div>
        <dl className="min-w-0 flex-1">{SPEC.map(([k, v]) => <div key={k} className="flex flex-col gap-1.5 border-b border-line px-5 py-4 last:border-b-0 md:px-10"><dt className="text-[15px] font-medium">{k}</dt><dd className="text-[14px] leading-[22px] text-body">{v}</dd></div>)}</dl>
      </div>
    </Frame>
  );
}

/* Use-case hub */
const USES = [
  ["Students", "Students and teaching labs", "Supervised AI exercises, coding assistance and project environments in the planned AI Labs, with quotas, isolation and a reviewed path for promising projects."],
  ["Research", "Faculty and researchers", "Reproducible experiments, permitted datasets, selected model adaptation and compute reservations."],
  ["HR", "HR and administration", "Policy search, document drafting and service-request assistance, with access limited to the user's responsibilities."],
  ["Accounts", "Accounts and management", "Document assistance, analysis preparation and management summaries. Financial approvals and consequential decisions remain with authorized people."],
  ["DOL", "Daffodil Online Limited", "Knowledge support, service-desk drafting and AI-assisted operational analysis linked to approved workflows."],
  ["Concerns", "Daffodil Computers and other concerns", "Business-specific knowledge assistants, technical support preparation and approved application integrations."],
  ["Security", "Cybersecurity collaboration", "Supervised research, analysis of approved evidence and human-reviewed findings in isolated environments."],
];
export function AIUses() {
  const [on, setOn] = useState(0);
  const pos = USES.map((_, i) => { const a = -Math.PI / 2 + (i / USES.length) * Math.PI * 2; return [50 + Math.cos(a) * 39, 50 + Math.sin(a) * 39]; });
  return (
    <Frame n="07.7" tag="Across Daffodil" title={<>One foundation.<br /><span className="text-mute">Practical uses across Daffodil.</span></>} sub="Illustrative use cases for phased assessment and approval."
      note="These examples describe intended opportunities. Each use case needs an accountable owner, permitted data, evaluation and an approved deployment path. Existing systems and teams keep their decision authority.">
      <div className="flex flex-col border-t border-line-dark lg:flex-row">
        <div className="relative mx-auto aspect-square w-full max-w-[640px] lg:w-[50%] lg:shrink-0">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
            {pos.map(([x, y], i) => <line key={i} x1="50" y1="50" x2={x} y2={y} stroke={on === i ? "#E31E24" : "var(--iso-line)"} strokeWidth={on === i ? 0.45 : 0.22} strokeDasharray={on === i ? "1.4 1" : undefined} className={on === i ? "ai-flow" : undefined} />)}
          </svg>
          <div className="group absolute left-1/2 top-1/2 aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2"><IsoDiagram kind="rack" className="absolute inset-0" /></div>
          {USES.map(([s], i) => <button key={s} onClick={() => setOn(i)} onMouseEnter={() => setOn(i)} aria-pressed={on === i} style={{ left: `${pos[i][0]}%`, top: `${pos[i][1]}%` }} className={`twin-chip absolute inline-flex -translate-x-1/2 -translate-y-1/2 !px-3 !py-2 !text-[13px] ${on === i ? "is-on" : ""}`}>{s}</button>)}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 border-t border-line-dark px-5 py-10 md:px-10 lg:border-l lg:border-t-0 lg:px-14">
          <span className="font-mono text-[12px] text-red">0{on + 1} / 0{USES.length}</span>
          <span className="text-[28px] font-medium leading-tight tracking-[-0.02em] md:text-[34px]">{USES[on][1]}</span>
          <p aria-live="polite" className="max-w-[520px] text-[17px] leading-7 text-soft">{USES[on][2]}</p>
        </div>
      </div>
    </Frame>
  );
}

/* An interactive stepper: pick any step, or run them in order and watch the record build up */
type Step = { t: string; b: string; ex: string };
function Gates({ steps, logTitle }: { steps: Step[]; logTitle: string }) {
  const [i, setI] = useState(0);
  const [running, setRunning] = useState(false);
  const last = steps.length - 1;
  useEffect(() => {
    if (!running) return;
    if (i >= last) { setRunning(false); return; }
    const t = setTimeout(() => setI(i + 1), 1800);
    return () => clearTimeout(t);
  }, [i, last, running]);
  const go = (n: number) => { setRunning(false); setI(Math.max(0, Math.min(last, n))); };
  const s = steps[i];
  return (
    <div className="step-box" onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); } }}>
      <ol className="grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((x, k) => (
          <li key={x.t} className="min-w-0">
            <button onClick={() => go(k)} aria-current={k === i ? "step" : undefined} aria-label={`Step ${k + 1}: ${x.t}`} className={`step-cell ${k === i ? "is-on" : k < i ? "is-done" : ""}`}>
              <span className="font-mono text-[12px]">{k < i ? "✓" : String(k + 1).padStart(2, "0")}</span>
              <span className="hidden text-[13px] font-medium leading-[17px] md:block">{x.t}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr]">
        <div aria-live="polite" className="flex min-h-[250px] flex-col gap-5 p-5 md:p-7">
          <div className="flex flex-col gap-1.5"><span className="label text-red">Step {i + 1} of {steps.length}</span><span className="text-[28px] font-medium leading-tight tracking-[-0.02em]">{s.t}</span></div>
          <dl className="flex flex-col gap-4">
            <div className="flex flex-col gap-1"><dt className="label opacity-60">What happens</dt><dd className="text-[16px] leading-6">{s.b}</dd></div>
            <div className="flex flex-col gap-1"><dt className="label opacity-60">In this example</dt><dd className="text-[16px] font-medium leading-6">{s.ex}</dd></div>
          </dl>
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            <button className="twin-btn border border-[color:var(--step-line)] disabled:opacity-40" disabled={i === 0} onClick={() => go(i - 1)}>Previous</button>
            <button className="twin-btn border border-[color:var(--step-line)] disabled:opacity-40" disabled={i === last} onClick={() => go(i + 1)}>Next</button>
            <button className={`twin-btn border border-red ${running ? "is-on" : ""}`} onClick={() => { if (running) { setRunning(false); return; } if (i === last) setI(0); setRunning(true); }}>{running ? "Pause" : i === last ? "Run again" : "Run the example"}</button>
          </div>
        </div>
        <div className="step-log flex flex-col gap-3 p-5 md:p-7">
          <span className="label opacity-60">{logTitle}</span>
          <ol className="flex flex-col gap-2.5">{steps.slice(0, i + 1).map((x, k) => <li key={x.t} className="grid grid-cols-[22px_1fr] gap-1 font-mono text-[12px] leading-[18px]"><span className="text-red">{String(k + 1).padStart(2, "0")}</span><span className={k === i ? "" : "opacity-60"}>{x.ex}</span></li>)}</ol>
        </div>
      </div>
    </div>
  );
}

/* AI Labs */
const LAB_STEPS: Step[] = [
  { t: "Lab project", b: "A student team builds and demonstrates its work in the AI Lab.", ex: "Prototype answers questions from approved sample course notes" },
  { t: "Faculty review", b: "Faculty or the department confirm academic value and ownership.", ex: "Department sponsor named · student team credited" },
  { t: "Technical review", b: "Architecture, data, security and resource needs are reviewed.", ex: "Permitted course material only · runs within the lab quota" },
  { t: "Approval", b: "Priority, mentor, environment and quota are assigned.", ex: "Mentor and pilot environment assigned" },
  { t: "Isolated pilot", b: "Sandboxed data, logs, limits and acceptance tests.", ex: "One course section · usage and answer quality recorded" },
  { t: "Adoption decision", b: "Release only after security and operational acceptance.", ex: "Adopted for wider course use, owned by the department" },
];
const LAB_KEY = [["2 AI Labs", "25 students and 1 instructor in each: 52 seats."], ["2 × H200 NVL-class", "A shared academic GPU pool, or a validated equivalent. GPU time comes through accounts and quotas, not one GPU per seat."], ["Separate from production", "Lab GPUs and the lab network zone stay apart from the eight production GPUs. Each user has an account, a quota and a resettable environment."]];
export function AILabs() {
  return (
    <Frame n="07.8" light tag="Planned AI Labs" title={<>Learn, research and build.<br />Then adopt what proves useful.</>} sub="Two planned AI Labs give students and faculty hands-on AI computing for courses, research and projects."
      note="The lab design is a planned baseline: final sizing follows a representative 52-seat commissioning test, and the vendor proposes the lab server configuration. No student project receives unrestricted production access. Every promotion is owned, mentored, isolated and auditable.">
      <AIInfra3D labs />
      <div className="flex flex-col border-t border-line bg-white lg:flex-row">
        <dl className="grid min-w-0 flex-1 grid-cols-1 md:grid-cols-3">{LAB_KEY.map(([k, v]) => <div key={k} className="flex flex-1 flex-col justify-center gap-2 border-b border-line px-5 py-6 md:border-b-0 md:border-r md:px-10"><dt className="text-[20px] font-medium tracking-[-0.01em]">{k}</dt><dd className="text-[15px] leading-[23px] text-body">{v}</dd></div>)}</dl>
      </div>
      <div className="border-t border-line px-5 py-10 md:px-10 lg:px-14">
        <div className="mb-6"><p className="text-[22px] font-medium">Follow one student project</p><p className="text-[14px] text-body">Synthetic example: a Bangla course-notes assistant.</p></div>
        <Gates steps={LAB_STEPS} logTitle="Project record" />
      </div>
    </Frame>
  );
}

/* Follow one request */
const GATE: [string, string][] = [["Identify", "Authenticate the user and institutional context."], ["Check", "Verify purpose, source permissions and resource limits."], ["Retrieve", "Select only knowledge the user is allowed to access."], ["Route", "Use an approved model and processing location."], ["Respond", "Provide a useful answer with references where available."], ["Authorize actions", "Independently check tool permissions; obtain human approval where required."], ["Record", "Retain appropriate audit and usage evidence under the approved policy."]];
const CASES = [
  { tab: "Policy question", who: "A staff member in administration", q: "Which policy applies to this staff training request?", ex: ["Signed in · administration staff", "Purpose: policy question · policy library permitted", "2 permitted policy documents selected", "Approved model · local processing", "Answer with document references", "No action requested · nothing changed", "Access, model and usage recorded"] },
  { tab: "Supervised student experiment", who: "A student in a supervised AI course", q: "Can I run my model-training assignment on the AI Lab GPUs?", ex: ["Signed in · enrolled student", "Course allocation and GPU quota checked", "Course guide and lab rules selected", "Isolated project environment · AI Lab queue", "Steps to start within the course quota", "Starting a GPU session uses the course allocation", "Usage counted against the course quota"] },
  { tab: "IT support draft", who: "A DOL service-desk agent", q: "Draft a reply for a customer who reports slow internet.", ex: ["Signed in · service-desk agent", "Ticket access only · support knowledge permitted", "Troubleshooting guide and ticket notes selected", "Approved model · local processing", "Draft reply prepared for review", "Sending needs the agent's approval", "Draft, approval and usage recorded"] },
];
export function AIRequest() {
  const [c, setC] = useState(0);
  const k = CASES[c];
  return (
    <Frame n="07.9" tag="Follow one request" title={<>The right answer starts<br /><span className="text-mute">with the right access.</span></>} sub="Synthetic example. No live system." note="The model cannot grant itself access. Permission checks also apply when an answer is delivered or an action is executed.">
      <div className="flex flex-col border-t border-line-dark lg:flex-row">
        <div className="flex flex-col gap-5 border-b border-line-dark px-5 py-10 md:px-10 lg:w-[38%] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-14">
          <div className="flex flex-col gap-1" role="group" aria-label="Choose an example">{CASES.map((x, n) => <button key={x.tab} aria-pressed={n === c} onClick={() => setC(n)} className={`twin-row !py-3 !text-[14px] ${n === c ? "is-on" : ""}`}>{x.tab}</button>)}</div>
          <span className="label text-mute">Asked by {k.who}</span>
          <p className="text-[24px] font-medium leading-8 tracking-[-0.015em]">“{k.q}”</p>
        </div>
        <div className="min-w-0 flex-1 px-5 py-8 md:px-10"><Gates key={c} logTitle="Audit trail" steps={GATE.map(([t, b], n) => ({ t, b, ex: k.ex[n] }))} /></div>
      </div>
    </Frame>
  );
}

/* Knowledge, models, research */
const FLOWS = [
  { t: "Private knowledge retrieval", s: ["Question", "Permitted sources", "Grounded answer"], k: "tiles", b: "RAG finds permitted institutional material when answering a question. It does not mean training a model on every Daffodil document." },
  { t: "Approved model serving", s: ["Approved task", "Registered model", "Controlled resources"], k: "hosting", b: "Inference runs a selected, registered model for an approved task, with routing and resource controls." },
  { t: "Supervised model adaptation", s: ["Permitted dataset", "Isolated environment", "Review gate"], k: "vault", b: "Research teams can evaluate permitted datasets and selected fine-tuning methods within supported capacity, isolated environments and review gates." },
];
export function AIKnowledge() {
  return (
    <Frame n="07.10" light tag="Knowledge, models and research" title={<>Use knowledge responsibly.<br />Adapt models deliberately.</>} note="The programme focuses on useful, evaluated AI and governed agents. It does not claim artificial general intelligence or a completed Daffodil frontier model.">
      <div className="grid grid-cols-1 border-t border-line bg-white md:grid-cols-3">
        {FLOWS.map((f) => (
          <div key={f.t} className="group flex flex-col border-b border-line md:border-b-0 md:border-r md:last:border-r-0">
            <div className="relative aspect-[4/3] border-b border-line"><IsoDiagram kind={f.k} className="absolute inset-[14%]" /></div>
            <div className="flex flex-col gap-4 p-7">
              <span className="text-[22px] font-medium leading-7 tracking-[-0.015em]">{f.t}</span>
              <ol className="flex flex-col font-mono text-[12px]">{f.s.map((x, i) => <li key={x} className="flex items-center gap-2.5 border-t border-line py-2"><span className="text-red">0{i + 1}</span>{x}</li>)}</ol>
              <p className="text-[15px] leading-[23px] text-body">{f.b}</p>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* Governance */
const CONTROLS = ["Identity and least privilege", "Permission-aware knowledge", "Separated tenants and environments", "Human-approved consequential actions", "Monitored usage and policy", "Protected backups and recovery exercises"];
const GOV = [
  ["Audit and privacy", "Access, model, routing and usage metadata support accountability. Full prompts or document content should be retained only for a defined, approved purpose with appropriate access and retention controls."],
  ["Human oversight", "AI can assist with analysis and recommendations. Sensitive data onboarding, production model releases, high-impact actions and recovery decisions remain subject to responsible human approval."],
  ["Research boundary", "Student and cybersecurity research use approved datasets, isolated environments and supervised evaluation. Research access does not grant production privileges."],
];
export function AIGovernance() {
  return (
    <Frame n="07.11" tag="Governance and cybersecurity" title={<>Accountability<br /><span className="text-mute">across every layer.</span></>}>
      <ul className="grid grid-cols-1 border-t border-line-dark sm:grid-cols-2 lg:grid-cols-3">{CONTROLS.map((c, i) => <li key={c} className="flex gap-3 border-b border-line-dark px-5 py-5 text-[16px] sm:border-r md:px-10"><span className="font-mono text-[12px] leading-6 text-red">0{i + 1}</span>{c}</li>)}</ul>
      <div className="px-5 py-12 md:px-10 lg:px-14">
        <p className="label mb-6 text-mute">Data handling · Local first, governed hybrid</p>
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center" role="img" aria-label="Sensitive workloads go to approved local processing. External models need an allowed data classification, approved provider terms and an authorized route.">
          <div className="twin-glass p-4 text-[15px] font-medium md:w-[170px] md:shrink-0">Workload</div>
          <span aria-hidden className="ai-link" />
          <div className="twin-glass border-red p-4 text-[15px] font-medium md:w-[170px] md:shrink-0"><span className="block text-red">Gate</span>Data classification</div>
          <span aria-hidden className="ai-link" />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="keep-white rounded-[6px] bg-red p-4 text-white"><span className="block text-[15px] font-medium">Approved local processing</span><span className="text-[14px]">Sensitive workloads are intended for this route.</span></div>
            <div className="rounded-[6px] border border-dashed border-mute p-4"><span className="block text-[15px] font-medium">External model, only if all three are met</span><span className="text-[14px] text-soft">Allowed data classification · approved provider terms · authorized route</span></div>
          </div>
        </div>
        <p className="mt-5 text-[15px] text-soft">A timeout does not authorize sending private data elsewhere.</p>
      </div>
      <div className="grid grid-cols-1 border-t border-line-dark md:grid-cols-3">{GOV.map(([t, b]) => <div key={t} className="flex flex-col gap-3 border-b border-line-dark p-7 md:border-b-0 md:border-r md:last:border-r-0 md:p-10"><span className="text-[20px] font-medium">{t}</span><span className="text-[15px] leading-[23px] text-soft">{b}</span></div>)}</div>
    </Frame>
  );
}

/* Delivery and Bangladesh pathway */
const DELIVERY = [["Commission and accept", "Validate the platform, security controls, backup recovery and operational ownership."], ["Pilot within Daffodil", "Start with an institutional knowledge assistant, service-desk drafting and a supervised academic cohort."], ["Measure and improve", "Review answer quality, adoption, time saved, service reliability and cost per useful outcome."], ["Qualify external services", "Confirm spare non-reserve capacity, tenant isolation, data terms, support and commercial readiness."]];
const SERVICES = [["Private enterprise AI", "Company knowledge assistants and employee productivity support. The first candidate."], ["Managed model and API services", "Approved models served through managed APIs."], ["Research and GPU workloads", "Supported research, training and inference workloads."], ["GPU colocation", "Space, power and connectivity for customer GPU systems, where facilities allow."]];
export function AIPathway() {
  return (
    <Frame n="07.12" light tag="Delivery pathway" title={<>Prove value internally.<br />Expand responsibly.</>} sub="After successful internal implementation, Daffodil intends to explore selected enterprise pilots in Bangladesh."
      note="These are readiness stages, not completed milestones or promised launch dates. Future services are subject to capacity, facility readiness and service agreements.">
      <ol className="grid grid-cols-1 items-end border-t border-line bg-white md:grid-cols-4">
        {DELIVERY.map(([t, b], i) => <li key={t} className="flex flex-col gap-3 border-b border-line p-7 md:border-b-0 md:border-r md:last:border-r-0"><span className="font-mono text-[12px] text-red">0{i + 1}</span><span aria-hidden className="hidden w-full bg-ink/10 md:block" style={{ height: 16 + i * 34 }} /><span className="text-[20px] font-medium leading-tight">{t}</span><span className="min-h-[92px] text-[15px] leading-[23px] text-body">{b}</span></li>)}
      </ol>
      <div className="flex flex-col border-t border-line lg:flex-row">
        <div className="mx-auto aspect-[3/4] w-full max-w-[460px] p-6 lg:w-[40%] lg:shrink-0"><BdMap /></div>
        <div className="grid min-w-0 flex-1 grid-cols-1 border-t border-line bg-white sm:grid-cols-2 lg:border-l lg:border-t-0">{SERVICES.map(([t, b]) => <div key={t} className="flex flex-col justify-between gap-8 border-b border-r border-line p-7"><span className="label text-mute">Future service pathway</span><span className="flex flex-col gap-2"><span className="text-[22px] font-medium leading-7">{t}</span><span className="text-[15px] leading-[23px] text-body">{b}</span></span></div>)}</div>
      </div>
    </Frame>
  );
}
