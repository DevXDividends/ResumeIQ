import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Target,
  MessageSquareText,
  Gauge,
  ArrowRight,
  Briefcase,
  ShieldCheck,
  UploadCloud,
  ScanSearch,
  ListChecks,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Precision AI Matching",
    desc: "Semantic similarity scoring compares resumes against job descriptions for an accurate relevance score - not just keyword matching.",
  },
  {
    icon: MessageSquareText,
    title: "Personalized Feedback",
    desc: "Candidates get AI-generated, actionable suggestions on missing skills, certifications, and projects to strengthen their profile.",
  },
  {
    icon: Gauge,
    title: "Instant Verdicts",
    desc: "Every application is automatically sorted into High, Medium, or Low fit - so recruiters focus only where it matters.",
  },
];

const steps = [
  {
    icon: Briefcase,
    title: "Recruiter posts a JD",
    desc: "Admins upload a job description (PDF/DOCX) which is parsed and stored.",
  },
  {
    icon: UploadCloud,
    title: "Candidate applies",
    desc: "Applicants browse open roles and submit their resume for instant evaluation.",
  },
  {
    icon: ScanSearch,
    title: "AI scores the fit",
    desc: "A sentence-embedding model computes semantic relevance between resume and JD.",
  },
  {
    icon: ListChecks,
    title: "Recruiter reviews",
    desc: "Candidates are ranked and categorized, complete with AI feedback for each.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:44px_44px] opacity-40" />
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
          <span className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-brand-200">
            <Sparkles size={14} /> AI-powered recruitment screening
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
            Automated Resume <br className="hidden sm:block" />
            Relevance Check System
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            An AI-powered platform that intelligently matches resumes with job descriptions,
            ranks applicants by relevance, and delivers instant, personalized feedback -
            streamlining recruitment for both recruiters and candidates.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/jobs"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-900 shadow-soft transition hover:bg-slate-100"
            >
              View Job Listings <ArrowRight size={18} />
            </Link>
            <Link
              to="/admin/login"
              className="flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              <ShieldCheck size={18} /> Admin Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900">Why ResumeIQ?</h2>
          <p className="mt-3 text-slate-500">
            Purpose-built to cut screening time while keeping decisions fair and explainable.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                <Icon size={22} />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-slate-900">How it works</h2>
            <p className="mt-3 text-slate-500">From job post to ranked candidates, in four steps.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, desc }, idx) => (
              <div key={title} className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-600 shadow-card">
                  <Icon size={20} />
                </div>
                <span className="absolute right-0 top-0 font-display text-4xl font-bold text-slate-100">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display font-semibold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-center justify-between gap-8 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 text-center shadow-soft sm:flex-row sm:text-left">
          <div>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Ready to see how you stack up?
            </h2>
            <p className="mt-2 max-w-md text-brand-100">
              Browse open roles and get an instant relevance score on your resume.
            </p>
          </div>
          <Link
            to="/jobs"
            className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-brand-700 shadow-lg transition hover:bg-slate-100"
          >
            Explore Jobs <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
