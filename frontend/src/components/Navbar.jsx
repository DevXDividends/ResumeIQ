import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FileSearch, Menu, X, LogOut } from "lucide-react";
import { useAdmin } from "../context/AdminContext.jsx";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-brand-600" : "text-slate-600 hover:text-brand-600"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, username, logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
            <FileSearch size={18} />
          </span>
          Resume<span className="text-brand-600">IQ</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/jobs" className={navLinkClass}>
            Job Listings
          </NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/admin/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/manage" className={navLinkClass}>
                Manage Admins
              </NavLink>
              <span className="text-sm text-slate-400">|</span>
              <span className="text-sm text-slate-500">
                Hi, <span className="font-semibold text-slate-700">{username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
            >
              Admin Login
            </Link>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink to="/" onClick={() => setOpen(false)} className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/jobs" onClick={() => setOpen(false)} className={navLinkClass}>
              Job Listings
            </NavLink>
            {isLoggedIn ? (
              <>
                <NavLink to="/admin/dashboard" onClick={() => setOpen(false)} className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/manage" onClick={() => setOpen(false)} className={navLinkClass}>
                  Manage Admins
                </NavLink>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600"
                >
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setOpen(false)}
                className="w-fit rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
