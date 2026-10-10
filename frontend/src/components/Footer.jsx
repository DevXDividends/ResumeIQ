import React from "react";
import { FileSearch } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">
        <div className="flex items-center gap-2 font-display font-semibold text-slate-700">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white">
            <FileSearch size={14} />
          </span>
          ResumeIQ
        </div>
        <p>Built for Hackathon &middot; Powered by AI, FastAPI & React &middot; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
