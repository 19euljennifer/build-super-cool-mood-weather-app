import { Mood } from "../types";

export const MOODS: Mood[] = [
  {
    id: "happy",
    label: "Happy",
    emoji: "😊",
    description: "Feeling joyful and upbeat",
    color: "#f59e0b",
    bgGradient: "from-amber-400 via-yellow-300 to-orange-400",
  },
  {
    id: "sad",
    label: "Sad",
    emoji: "😢",
    description: "Feeling down or melancholic",
    color: "#6366f1",
    bgGradient: "from-indigo-500 via-blue-400 to-slate-500",
  },
  {
    id: "energetic",
    label: "Energetic",
    emoji: "⚡",
    description: "Pumped and full of energy",
    color: "#ef4444",
    bgGradient: "from-red-500 via-orange-400 to-yellow-500",
  },
  {
    id: "calm",
    label: "Calm",
    emoji: "🧘",
    description: "Peaceful and relaxed",
    color: "#10b981",
    bgGradient: "from-emerald-400 via-teal-300 to-cyan-400",
  },
  {
    id: "anxious",
    label: "Anxious",
    emoji: "😰",
    description: "Worried or uneasy",
    color: "#8b5cf6",
    bgGradient: "from-violet-500 via-purple-400 to-fuchsia-500",
  },
];
