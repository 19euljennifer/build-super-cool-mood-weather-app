"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-red-400/30 bg-red-500/15 p-8 text-center backdrop-blur-md">
      <AlertTriangle className="h-10 w-10 text-red-300" />
      <p className="text-sm text-white/80">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-white/30 active:scale-95"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
