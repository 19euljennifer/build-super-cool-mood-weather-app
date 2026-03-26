"use client";

import { clsx } from "clsx";
import { Mood } from "../types";

interface MoodCardProps {
  mood: Mood;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (mood: Mood) => void;
}

export function MoodCard({ mood, isSelected, isDisabled, onSelect }: MoodCardProps) {
  return (
    <button
      onClick={() => onSelect(mood)}
      disabled={isDisabled}
      className={clsx(
        "group relative flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all duration-300",
        "hover:scale-105 hover:shadow-xl active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        isSelected
          ? "border-white/60 bg-white/25 shadow-lg shadow-white/10 backdrop-blur-md"
          : "border-white/20 bg-white/10 backdrop-blur-sm hover:border-white/40 hover:bg-white/20"
      )}
      style={{
        "--tw-ring-color": mood.color,
      } as React.CSSProperties}
    >
      <span
        className={clsx(
          "text-5xl transition-transform duration-300",
          isSelected ? "scale-110 animate-bounce" : "group-hover:scale-110"
        )}
      >
        {mood.emoji}
      </span>
      <span className="text-sm font-semibold text-white">{mood.label}</span>
      <span className="text-xs text-white/70">{mood.description}</span>
      {isSelected && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs">
          ✓
        </span>
      )}
    </button>
  );
}
