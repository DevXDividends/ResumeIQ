import React, { useEffect, useState } from "react";
import { listJobs } from "../api/client.js";
import JobCard from "../components/JobCard.jsx";
import Loader from "../components/Loader.jsx";
import { AlertCircle, Search } from "lucide-react";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    listJobs()
      .then(setJobs)
      .catch(() => setError("Could not load jobs. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter((j) => j.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Explore Opportunities</h1>
          <p className="mt-2 text-slate-500">Choose a job and submit your resume for instant AI evaluation.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      {loading && <Loader label="Loading job listings..." />}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-400">
          No jobs available yet. Check back soon.
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
