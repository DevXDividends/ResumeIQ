import React from "react";
import { Loader2 } from "lucide-react";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
      <Loader2 className="animate-spin text-brand-500" size={32} />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
