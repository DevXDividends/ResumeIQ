import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, ArrowRight, Calendar } from "lucide-react";

export default function JobCard({ job }) {
  const preview = (job.description || "").replace(/\s+/g, " ").trim().slice(0, 140);

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft">
      <div>
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Briefcase size={20} />
        </div>
        <h3 className="font-display text-lg font-semibold text-slate-900">{job.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {preview}
          {preview.length === 140 ? "..." : ""}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        {job.upload_date && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={12} /> {job.upload_date.split(" ")[0]}
          </span>
        )}
        <Link
          to={`/jobs/${job.id}`}
          className="flex items-center gap-1 text-sm font-semibold text-brand-600 transition group-hover:gap-2"
        >
          View Details <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
