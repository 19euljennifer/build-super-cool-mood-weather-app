"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { Cloud, MapPin, Search } from "lucide-react";
import { Mood } from "../types";
import { MOODS } from "../data/moods";
import { MoodSelector } from "./MoodSelector";
import { WeatherDisplay } from "./WeatherDisplay";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { useWeatherApi } from "../hooks/useWeatherApi";

export function MoodWeatherApp() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const { weather, appState, errorMessage, fetchWeather } = useWeatherApi();
  const [locationName, setLocationName] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState("");
  const locationRef = useRef<string | undefined>(undefined);
  const geoRequestedRef = useRef(false);

  useEffect(() => {
    if (geoRequestedRef.current) return;
    geoRequestedRef.current = true;

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        locationRef.current = `${latitude},${longitude}`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county;
          if (city) {
            setLocationName(city);
            setLocationInput(city);
          }
        } catch {
          // Reverse geocoding failed — we still have lat,lon for the API
        }
      },
      () => {
        // User denied location — backend will use default
      },
      { timeout: 5000, maximumAge: 300000 }
    );
  }, []);

  const handleLocationSubmit = useCallback(() => {
    const trimmed = locationInput.trim();
    if (trimmed) {
      locationRef.current = trimmed;
      setLocationName(trimmed);
      if (selectedMood) {
        fetchWeather(selectedMood.id, trimmed);
      }
    }
  }, [locationInput, selectedMood, fetchWeather]);

  const handleMoodSelect = useCallback(
    (mood: Mood) => {
      setSelectedMood(mood);
      fetchWeather(mood.id, locationRef.current);
    },
    [fetchWeather]
  );

  const handleRetry = useCallback(() => {
    if (selectedMood) {
      fetchWeather(selectedMood.id, locationRef.current);
    }
  }, [selectedMood, fetchWeather]);

  const bgGradient =
    selectedMood?.bgGradient ?? "from-slate-700 via-slate-800 to-slate-900";

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
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
              <MapPin className="mr-2 h-3.5 w-3.5 text-white/50" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLocationSubmit();
                }}
                placeholder="Enter a city..."
                className="w-40 bg-transparent text-sm text-white/80 placeholder-white/30 outline-none"
              />
              <button
                onClick={handleLocationSubmit}
                className="ml-1 rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
                aria-label="Search location"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
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
          {appState === "success" && weather && (
            <WeatherDisplay weather={weather} />
          )}
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
