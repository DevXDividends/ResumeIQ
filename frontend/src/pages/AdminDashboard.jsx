import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  UploadCloud,
  FileCheck2,
  Loader2,
  Trash2,
  Users,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext.jsx";
import { listJobs, createJob, deleteJob } from "../api/client.js";
import Loader from "../components/Loader.jsx";

export default function AdminDashboard() {
  const { isLoggedIn } = useAdmin();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);
  const [uploadErr, setUploadErr] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const fetchJobs = () => {
    setLoading(true);
    listJobs()
      .then(setJobs)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isLoggedIn) fetchJobs();
  }, [isLoggedIn]);

  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadErr(null);
    setUploadMsg(null);
    if (!file || !title) {
      setUploadErr("Job title and JD file are required.");
      return;
    }
    setUploading(true);
    try {
      const data = await createJob(title, file);
      setUploadMsg(data.message);
      setTitle("");
      setFile(null);
      fetchJobs();
    } catch (err) {
      setUploadErr(err?.response?.data?.detail || "Could not upload JD.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (jd) => {
    if (!window.confirm(`Delete "${jd.title}" and all its resumes?`)) return;
    setDeletingId(jd.id);
    try {
      await deleteJob(jd.id);
      fetchJobs();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="font-display text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="mt-2 text-slate-500">Upload job descriptions and manage postings.</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="mb-4 font-display text-lg font-semibold text-slate-900">
          Upload Job Description (JD)
        </h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Job Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Data Analyst"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">JD File (PDF/DOCX)</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500 transition hover:border-brand-300 hover:bg-brand-50/50">
              {file ? (
                <span className="flex items-center gap-2 text-slate-700">
                  <FileCheck2 size={16} className="text-brand-600" /> {file.name}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UploadCloud size={16} /> Click to select JD file
                </span>
              )}
              <input
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {uploadErr && (
            <p className="flex items-center gap-1.5 text-sm text-rose-600">
              <AlertTriangle size={14} /> {uploadErr}
            </p>
          )}
          {uploadMsg && (
            <p className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle2 size={14} /> {uploadMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-60"
          >
            {uploading && <Loader2 size={16} className="animate-spin" />}
            {uploading ? "Uploading..." : "Upload JD"}
          </button>
        </form>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="mb-4 font-display text-lg font-semibold text-slate-900">Uploaded Job Descriptions</h2>

        {loading ? (
          <Loader label="Loading jobs..." />
        ) : jobs.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No JDs uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-2 pr-4">JD ID</th>
                  <th className="py-2 pr-4">Title</th>
                  <th className="py-2 pr-4">Uploaded</th>
                  <th className="py-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 pr-4 text-slate-400">#{job.id}</td>
                    <td className="py-3 pr-4 font-medium text-slate-800">{job.title}</td>
                    <td className="py-3 pr-4 text-slate-500">{job.upload_date?.split(" ")[0]}</td>
                    <td className="py-3 pr-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/review/${job.id}`}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-600"
                        >
                          <Users size={13} /> Review
                        </Link>
                        <button
                          onClick={() => handleDelete(job)}
                          disabled={deletingId === job.id}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-rose-300 hover:text-rose-600 disabled:opacity-60"
                        >
                          {deletingId === job.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Trash2 size={13} />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
