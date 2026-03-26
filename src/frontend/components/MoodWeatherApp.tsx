"use client";

import { useState, useCallback } from "react";
import { clsx } from "clsx";
import { Cloud } from "lucide-react";
import { Mood, WeatherData, AppState } from "../types";
import { MOODS } from "../data/moods";
import { MoodSelector } from "./MoodSelector";
import { WeatherDisplay } from "./WeatherDisplay";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";

const DEMO_WEATHER: Record<string, WeatherData> = {
  happy: {
    temperature: 75,
    condition: "Sunny",
    mood_message:
      "The sky matches your vibe! It's sunny and 75°F — a perfect day to ride this wave of happiness.",
    recommendation:
      "Head outside and soak up the good energy — a walk, a picnic, or just people-watching.",
    icon: "01d",
    location: "San Francisco, CA",
    mood: "Happy",
  },
  sad: {
    temperature: 52,
    condition: "Overcast",
    mood_message:
      "It's overcast and 52°F outside. Even grey skies pass — and so will this feeling.",
    recommendation:
      "A gentle walk outside can lift your spirits — fresh air is underrated medicine.",
    icon: "04d",
    location: "San Francisco, CA",
    mood: "Sad",
  },
  energetic: {
    temperature: 68,
    condition: "Partly Cloudy",
    mood_message:
      "68°F and partly cloudy — the world is your playground! Channel that energy!",
    recommendation:
      "Go for a run, hit the gym, or start that project you've been putting off!",
    icon: "02d",
    location: "San Francisco, CA",
    mood: "Energetic",
  },
  calm: {
    temperature: 62,
    condition: "Clear",
    mood_message:
      "A serene clear day at 62°F. The weather is at peace, just like you.",
    recommendation:
      "Find a quiet spot outside — read a book, meditate, or just breathe in the calm.",
    icon: "01d",
    location: "San Francisco, CA",
    mood: "Calm",
  },
  anxious: {
    temperature: 55,
    condition: "Drizzle",
    mood_message:
      "It's drizzle and 55°F. Take a breath — you're safe, and this moment will pass.",
    recommendation:
      "Try a quick breathing exercise: 4 counts in, 7 hold, 8 out. You've got this.",
    icon: "09d",
    location: "San Francisco, CA",
    mood: "Anxious",
  },
};

export function MoodWeatherApp() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [appState, setAppState] = useState<AppState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleMoodSelect = useCallback(async (mood: Mood) => {
    setSelectedMood(mood);
    setAppState("loading");
    setWeather(null);
    setErrorMessage("");

    // Simulate API call with demo data for frontend-1
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const data = DEMO_WEATHER[mood.id];
      if (data) {
        setWeather(data);
        setAppState("success");
      } else {
        throw new Error("Could not fetch weather data");
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setAppState("error");
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (selectedMood) {
      handleMoodSelect(selectedMood);
    }
  }, [selectedMood, handleMoodSelect]);

  const bgGradient = selectedMood?.bgGradient ?? "from-slate-700 via-slate-800 to-slate-900";

  return (
    <div
      className={clsx(
        "relative flex min-h-screen flex-col items-center overflow-hidden bg-gradient-to-br transition-all duration-700 ease-in-out",
        bgGradient
      )}
    >
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={clsx(
            "absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-20 blur-3xl transition-all duration-1000",
            selectedMood ? "bg-white/30 scale-110" : "bg-white/10 scale-100"
          )}
        />
        <div
          className={clsx(
            "absolute -right-32 -bottom-32 h-96 w-96 rounded-full opacity-20 blur-3xl transition-all duration-1000 delay-200",
            selectedMood ? "bg-white/20 scale-125" : "bg-white/5 scale-100"
          )}
        />
        <div
          className={clsx(
            "absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl transition-all duration-1000 delay-500",
            selectedMood ? "bg-white/30 scale-150" : "bg-white/5 scale-100"
          )}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-4xl flex-1 flex-col items-center gap-10 px-4 py-12 sm:px-8">
        {/* Header */}
        <header className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <Cloud className="h-10 w-10 text-white drop-shadow-lg" />
            <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl">
              Mood Weather
            </h1>
          </div>
          <p className="max-w-md text-base text-white/70">
            Your mood shapes how you experience the weather. Pick your vibe and
            see the sky through your feelings.
          </p>
        </header>

        {/* Mood Selection */}
        <MoodSelector
          moods={MOODS}
          selectedMood={selectedMood}
          isLoading={appState === "loading"}
          onSelect={handleMoodSelect}
        />

        {/* Results Area */}
        <div className="flex w-full flex-col items-center">
          {appState === "loading" && <LoadingSpinner />}
          {appState === "success" && weather && <WeatherDisplay weather={weather} />}
          {appState === "error" && (
            <ErrorMessage message={errorMessage} onRetry={handleRetry} />
          )}
          {appState === "idle" && (
            <p className="py-12 text-center text-sm text-white/40">
              Select a mood above to see your personalized weather
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
