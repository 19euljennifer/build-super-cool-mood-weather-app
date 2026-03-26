import { MoodDefinition } from "./types";

export const MOODS: MoodDefinition[] = [
  {
    id: "happy",
    label: "Happy",
    emoji: "😊",
    description: "Feeling joyful and upbeat",
    weatherKeywords: ["sunny", "clear", "warm"],
    moodMessages: [
      "The sun is shining just like your smile!",
      "Perfect weather to match your radiant mood!",
      "The world feels brighter when you're happy!",
    ],
    recommendations: [
      "Go for a walk in the park and soak up the good vibes",
      "Call a friend and share your positive energy",
      "Try something new today — your mood is perfect for adventure",
    ],
  },
  {
    id: "sad",
    label: "Sad",
    emoji: "😢",
    description: "Feeling down or melancholic",
    weatherKeywords: ["rain", "clouds", "overcast"],
    moodMessages: [
      "Even cloudy skies eventually clear — hang in there.",
      "The rain washes away yesterday's worries.",
      "It's okay to feel this way. Storms don't last forever.",
    ],
    recommendations: [
      "Wrap up in a blanket with your favorite warm drink",
      "Listen to some soothing music and let yourself feel",
      "Write down three things you're grateful for today",
    ],
  },
  {
    id: "energetic",
    label: "Energetic",
    emoji: "⚡",
    description: "Pumped and full of energy",
    weatherKeywords: ["wind", "storm", "dynamic"],
    moodMessages: [
      "The wind is at your back — go conquer the day!",
      "Your energy could power a thunderstorm!",
      "The atmosphere is as electric as you are!",
    ],
    recommendations: [
      "Hit the gym or go for a run to channel that energy",
      "Start that project you've been putting off",
      "Dance like nobody's watching — your body wants to move",
    ],
  },
  {
    id: "calm",
    label: "Calm",
    emoji: "🧘",
    description: "Peaceful and relaxed",
    weatherKeywords: ["mild", "gentle", "breeze"],
    moodMessages: [
      "A gentle breeze matches your peaceful state of mind.",
      "The weather is as serene as your spirit today.",
      "Nature is calm and so are you — perfect harmony.",
    ],
    recommendations: [
      "Try a meditation session or some gentle yoga",
      "Read a book in a cozy spot",
      "Take a slow walk and really notice the world around you",
    ],
  },
  {
    id: "anxious",
    label: "Anxious",
    emoji: "😰",
    description: "Worried or uneasy",
    weatherKeywords: ["fog", "mist", "uncertain"],
    moodMessages: [
      "The fog will lift — clarity is just around the corner.",
      "Even uncertain skies hold hidden beauty.",
      "Take a deep breath. The weather changes, and so will this feeling.",
    ],
    recommendations: [
      "Try box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s",
      "Ground yourself — name 5 things you can see right now",
      "Step outside for fresh air, even just for 2 minutes",
    ],
  },
];

export function getMoodById(id: string): MoodDefinition | undefined {
  return MOODS.find((m) => m.id === id);
}

export function getValidMoodIds(): string[] {
  return MOODS.map((m) => m.id);
}
