import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJob, summarizeJob, applyToJob } from "../api/client.js";
import Loader from "../components/Loader.jsx";
import {
  ArrowLeft,
  Wand2,
  UploadCloud,
  FileCheck2,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const verdictStyles = {
  "High Fit": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Medium Fit": "bg-amber-50 text-amber-700 border-amber-200",
  "Low Fit": "bg-rose-50 text-rose-700 border-rose-200",
};

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [summary, setSummary] = useState(null);
  const [summarizing, setSummarizing] = useState(false);

  const [candidateName, setCandidateName] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    getJob(id)
      .then(setJob)
      .catch(() => setError("Job not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      const data = await summarizeJob(id);
      setSummary(data.summary);
    } catch {
      setSummary("Could not generate summary right now.");
    } finally {
      setSummarizing(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyError(null);
    if (!candidateName) {
      setApplyError("Enter your name");
      return;
    }
    if (!resumeFile) {
      setApplyError("Upload your resume");
      return;
    }
    setApplying(true);
    try {
      const data = await applyToJob(id, candidateName, resumeFile);
      setResult(data);
    } catch (err) {
      setApplyError(err?.response?.data?.detail || "Could not evaluate your resume. Try again.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loader label="Loading job..." />;
  if (error || !job) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-slate-500">{error || "Job not found."}</p>
        <Link to="/jobs" className="mt-4 inline-block text-brand-600 hover:underline">
          Back to job listings
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <Link to="/jobs" className="mb-6 flex w-fit items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600">
        <ArrowLeft size={15} /> Back to listings
      </Link>

      <h1 className="font-display text-3xl font-bold text-slate-900">{job.title}</h1>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            {summary ? "Job Description (Simplified)" : "Job Description"}
          </h2>
          {!summary && (
            <button
              onClick={handleSummarize}
              disabled={summarizing}
              className="flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-100 disabled:opacity-60"
            >
              {summarizing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
              {summarizing ? "Summarizing..." : "Simplify with AI"}
            </button>
          )}
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
          {summary || job.description}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="mb-4 font-display text-lg font-semibold text-slate-900">Apply for this role</h2>

        {!result ? (
          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Your Name</label>
              <input
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Resume (PDF/DOCX)</label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500 transition hover:border-brand-300 hover:bg-brand-50/50">
                {resumeFile ? (
                  <span className="flex items-center gap-2 text-slate-700">
                    <FileCheck2 size={16} className="text-brand-600" /> {resumeFile.name}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UploadCloud size={16} /> Click to upload your resume
                  </span>
                )}
                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            {applyError && (
              <p className="flex items-center gap-1.5 text-sm text-rose-600">
                <AlertTriangle size={14} /> {applyError}
              </p>
            )}

            <button
              type="submit"
              disabled={applying}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-60"
            >
              {applying && <Loader2 size={16} className="animate-spin" />}
              {applying ? "Evaluating your resume..." : "Check Relevance / Apply"}
            </button>
          </form>
        ) : (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <CheckCircle2 className="mx-auto mb-3 text-emerald-600" size={32} />
            <p className="font-semibold text-emerald-800">{result.message}</p>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-600">Relevance Score</p>
                <p className="font-display text-3xl font-bold text-emerald-800">
                  {result.relevance_score}%
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-600">Verdict</p>
                <span
                  className={`mt-1 inline-block rounded-full border px-3 py-1 text-sm font-semibold ${
                    verdictStyles[result.verdict] || "bg-white"
                  }`}
                >
                  {result.verdict}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
