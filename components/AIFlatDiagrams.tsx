"use client";

import { useEffect, useState } from "react";

export const LAB_PATH = ["Lab project", "Faculty review", "Technical review", "Approval", "Isolated pilot", "Adoption decision"];

const Lab = ({ name }: { name: string }) => (
  <div className="twin-flat flex flex-col gap-3 p-4">
    <div><p className="text-[18px] font-medium">{name}</p><p className="text-[13px] opacity-70">25 students + 1 instructor</p></div>
    <span aria-hidden className="mx-auto h-2.5 w-1/3 rounded-sm bg-red" />
    <span aria-hidden className="grid grid-cols-5 gap-1.5">{Array.from({ length: 25 }, (_, i) => <i key={i} className="h-3 rounded-[2px] border border-mute/60 bg-mute/10" />)}</span>
  </div>
);

/** Isolated academic zone, shared pool and the reviewed route to the central platform. */
export function LabsFlat({ step = -1 }: { step?: number }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[10px] border border-dashed border-red p-4 md:p-6">
        <p className="label mb-4 text-red">Isolated academic zone</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Lab name="AI Lab A" /><Lab name="AI Lab B" /></div>
        <div aria-hidden className="grid grid-cols-2"><i className="mx-auto h-6 w-px bg-red" /><i className="mx-auto h-6 w-px bg-red" /></div>
        <div className="twin-flat flex flex-wrap items-center gap-4 p-4">
          <span aria-hidden className="flex gap-1.5">{[0, 1].map((i) => <i key={i} className="keep-white flex h-14 w-10 items-center justify-center rounded-[4px] bg-red"><b className="h-3 w-3 rounded-full border border-white" /></i>)}</span>
          <span><span className="block text-[13px] opacity-70">Shared academic GPU pool</span><span className="block text-[20px] font-medium">2 × H200 NVL-class</span><span className="block text-[13px] opacity-70">or validated equivalent</span></span>
        </div>
      </div>
      <div>
        <p className="label mb-3 opacity-70">From lab to real use</p>
        <ol className="grid grid-cols-2 gap-2 md:grid-cols-6">{LAB_PATH.map((s, i) => <li key={s} className={`twin-flat flex min-h-[64px] items-center justify-center p-3 text-center text-[14px] font-medium transition-colors duration-300 ${i === step ? "keep-white !border-red !bg-red !text-white" : i < step ? "!border-red" : ""}`}>{s}</li>)}</ol>
        <p className="mt-3 text-right text-[14px] font-medium text-red">↑ Central AI platform, only after adoption decision</p>
      </div>
    </div>
  );
}

const toMap = (lon: number, lat: number) => [(lon - 87.9) * 92, (26.7 - lat) * 100];
export function BdMap() {
  const [d, setD] = useState("");
  useEffect(() => { fetch("/bd.json").then((r) => r.json()).then((polys: number[][][][]) => setD(polys.flatMap((p) => p.map((ring) => "M" + ring.map(([x, y]) => toMap(x, y).map((n) => n.toFixed(1)).join(",")).join("L") + "Z")).join(""))).catch(() => {}); }, []);
  const [ax, ay] = toMap(90.32, 23.89), [dx, dy] = toMap(90.374, 23.746);
  return (
    <svg viewBox="0 0 450 600" className="h-full w-full" role="img" aria-label="Map of Bangladesh with the planned AI infrastructure at Daffodil Smart City, Ashulia and a recovery copy at Dhanmondi. Planned pathway, not current service coverage.">
      <path d={d} fill="var(--iso-l)" stroke="var(--iso-line)" strokeWidth="1" />
      <line x1={ax} y1={ay} x2={dx} y2={dy} stroke="#E31E24" strokeWidth="1.2" strokeDasharray="3 2" />
      <circle cx={ax} cy={ay} r="11" fill="none" stroke="#E31E24" /><circle cx={ax} cy={ay} r="4.5" fill="#E31E24" /><circle cx={dx} cy={dy} r="3" fill="none" stroke="#E31E24" strokeWidth="1.4" />
      <text x={ax - 16} y={ay - 4} textAnchor="end" fontSize="14" fontWeight="500" fill="currentColor">Ashulia · AI compute</text>
      <text x={dx + 10} y={dy + 16} fontSize="12" fill="currentColor">Dhanmondi · recovery copy</text>
    </svg>
  );
}
