import React, { useEffect, useState } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useAdmin } from "../context/AdminContext.jsx";
import { getJob, getReview } from "../api/client.js";
import Loader from "../components/Loader.jsx";
import CandidateCard from "../components/CandidateCard.jsx";

const sections = [
  { key: "high_fit", label: "High Fit Candidates", dot: "bg-emerald-500" },
  { key: "medium_fit", label: "Medium Fit Candidates", dot: "bg-amber-500" },
  { key: "low_fit", label: "Low Fit Candidates", dot: "bg-rose-500" },
];

export default function AdminReview() {
  const { isLoggedIn } = useAdmin();
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    Promise.all([getJob(id), getReview(id)])
      .then(([jobData, reviewData]) => {
        setJob(jobData);
        setReview(reviewData);
      })
      .catch(() => setError("Could not load candidates for this job."))
      .finally(() => setLoading(false));
  }, [id, isLoggedIn]);

  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <Link
        to="/admin/dashboard"
        className="mb-6 flex w-fit items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

      <h1 className="font-display text-3xl font-bold text-slate-900">
        {job ? `Candidates for "${job.title}"` : "Candidate Evaluation"}
      </h1>
      <p className="mt-2 text-slate-500">
        Applicants ranked by relevance, with AI-generated improvement suggestions for each.
      </p>

      {loading && <Loader label="Scoring and generating feedback for candidates..." />}

      {error && (
        <div className="mt-8 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {!loading && !error && review && (
        <div className="mt-8 space-y-10">
          {sections.map(({ key, label, dot }) => {
            const list = review[key] || [];
            return (
              <div key={key}>
                <div className="mb-4 flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                  <h2 className="font-display text-lg font-semibold text-slate-900">
                    {label} ({list.length})
                  </h2>
                </div>
                {list.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-400">
                    No candidates in this category yet.
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {list.map((c) => (
                      <CandidateCard key={c.id} candidate={c} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
