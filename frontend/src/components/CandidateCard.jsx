import React from "react";
import { Download, User } from "lucide-react";
import { downloadResumeUrl } from "../api/client.js";

const verdictStyles = {
  "High Fit": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Medium Fit": "bg-amber-50 text-amber-700 border-amber-200",
  "Low Fit": "bg-rose-50 text-rose-700 border-rose-200",
};

export default function CandidateCard({ candidate }) {
  const feedbackLines = (candidate.feedback || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <User size={18} />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{candidate.candidate_name}</p>
            <p className="text-xs text-slate-400">Relevance score: {candidate.score.toFixed(2)}%</p>
          </div>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            verdictStyles[candidate.verdict] || "bg-slate-50 text-slate-600 border-slate-200"
          }`}
        >
          {candidate.verdict}
        </span>
      </div>

      {feedbackLines.length > 0 && (
        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            AI Suggestions
          </p>
          <ul className="space-y-1.5 text-sm text-slate-600">
            {feedbackLines.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-brand-400" />
                {line.replace(/^[-*•]\s*/, "")}
              </li>
            ))}
          </ul>
        </div>
      )}

      <a
        href={downloadResumeUrl(candidate.id, candidate.candidate_name, candidate.filename)}
        className="mt-4 flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-600"
      >
        <Download size={14} /> Download Resume
      </a>
    </div>
  );
}
