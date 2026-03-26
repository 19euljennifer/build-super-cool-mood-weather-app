import { Mood } from "../types";

export const MOODS: Mood[] = [
  {
    id: "happy",
    label: "Happy",
    emoji: "😊",
    description: "Feeling joyful and upbeat",
    color: "#f59e0b",
    bgGradient: "from-amber-800 via-yellow-700 to-orange-800",
  },
  {
    id: "sad",
    label: "Sad",
    emoji: "😢",
    description: "Feeling down or melancholic",
    color: "#6366f1",
    bgGradient: "from-slate-900 via-gray-900 to-blue-950",
  },
  {
    id: "energetic",
    label: "Energetic",
    emoji: "⚡",
    description: "Pumped and full of energy",
    color: "#ef4444",
    bgGradient: "from-orange-800 via-red-900 to-rose-800",
  },
  {
    id: "calm",
    label: "Calm",
    emoji: "🧘",
    description: "Peaceful and relaxed",
    color: "#10b981",
    bgGradient: "from-teal-950 via-slate-900 to-emerald-950",
  },
  {
    id: "anxious",
    label: "Anxious",
    emoji: "😰",
    description: "Worried or uneasy",
    color: "#8b5cf6",
    bgGradient: "from-gray-900 via-stone-900 to-zinc-900",
  },
];
