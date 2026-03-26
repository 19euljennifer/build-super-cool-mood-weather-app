"use client";

import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <Loader2 className="h-10 w-10 animate-spin text-white/80" />
      <p className="animate-pulse text-lg text-white/70">
        Reading the skies for you...
      </p>
    </div>
  );
}
