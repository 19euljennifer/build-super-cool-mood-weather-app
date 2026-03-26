"use client";

import { Mood } from "../types";
import { MoodCard } from "./MoodCard";

interface MoodSelectorProps {
  moods: Mood[];
  selectedMood: Mood | null;
  isLoading: boolean;
  onSelect: (mood: Mood) => void;
}

export function MoodSelector({ moods, selectedMood, isLoading, onSelect }: MoodSelectorProps) {
  return (
    <section className="w-full max-w-3xl">
      <h2 className="mb-6 text-center text-xl font-medium text-white/90">
        How are you feeling today?
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {moods.map((mood) => (
          <MoodCard
            key={mood.id}
            mood={mood}
            isSelected={selectedMood?.id === mood.id}
            isDisabled={isLoading}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
