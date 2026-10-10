import React from "react";
import { Routes, Route } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminReview from "./pages/AdminReview.jsx";
import AdminManage from "./pages/AdminManage.jsx";

export default function App() {
  return (
    <AdminProvider>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/review/:id" element={<AdminReview />} />
            <Route path="/admin/manage" element={<AdminManage />} />
            <Route
              path="*"
              element={
                <div className="mx-auto max-w-xl px-6 py-24 text-center">
                  <h1 className="font-display text-3xl font-bold text-slate-900">404</h1>
                  <p className="mt-2 text-slate-500">Page not found.</p>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </AdminProvider>
  );
}
