import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserPlus, Trash2, Loader2, AlertTriangle, CheckCircle2, Users } from "lucide-react";
import { useAdmin } from "../context/AdminContext.jsx";
import { listAdmins, createAdmin, deleteAdmin } from "../api/client.js";
import Loader from "../components/Loader.jsx";

export default function AdminManage() {
  const { isLoggedIn } = useAdmin();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [adding, setAdding] = useState(false);
  const [addMsg, setAddMsg] = useState(null);
  const [addErr, setAddErr] = useState(null);

  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchAdmins = () => {
    setLoading(true);
    listAdmins()
      .then((data) => {
        setAdmins(data);
        if (data.length > 0) setSelectedAdmin((prev) => prev || data[0].username);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isLoggedIn) fetchAdmins();
  }, [isLoggedIn]);

  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;

  const handleAdd = async (e) => {
    e.preventDefault();
    setAddErr(null);
    setAddMsg(null);
    if (!newUsername || !newPassword) {
      setAddErr("Please enter both username and password!");
      return;
    }
    setAdding(true);
    try {
      await createAdmin(newUsername, newPassword);
      setAddMsg(`Admin '${newUsername}' added successfully`);
      setNewUsername("");
      setNewPassword("");
      fetchAdmins();
    } catch (err) {
      setAddErr(err?.response?.data?.detail || "Username already exists!");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    if (!window.confirm(`Delete admin '${selectedAdmin}'?`)) return;
    setDeleting(true);
    try {
      await deleteAdmin(selectedAdmin);
      fetchAdmins();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-3xl font-bold text-slate-900">Manage Admins</h1>
      <p className="mt-2 text-slate-500">Add or remove recruiter/admin accounts.</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
          <UserPlus size={18} className="text-brand-600" /> Add New Admin
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
              <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          {addErr && (
            <p className="flex items-center gap-1.5 text-sm text-rose-600">
              <AlertTriangle size={14} /> {addErr}
            </p>
          )}
          {addMsg && (
            <p className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle2 size={14} /> {addMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={adding}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-60"
          >
            {adding && <Loader2 size={16} className="animate-spin" />}
            {adding ? "Adding..." : "Add Admin"}
          </button>
        </form>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
          <Users size={18} className="text-brand-600" /> Delete Admin
        </h2>

        {loading ? (
          <Loader label="Loading admins..." />
        ) : admins.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">No admins found.</p>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <select
              value={selectedAdmin}
              onChange={(e) => setSelectedAdmin(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:w-64"
            >
              {admins.map((a) => (
                <option key={a.username} value={a.username}>
                  {a.username}
                </option>
              ))}
            </select>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
            >
              {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              {deleting ? "Deleting..." : "Delete Admin"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
