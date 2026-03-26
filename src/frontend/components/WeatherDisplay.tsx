"use client";

import { CloudSun, MapPin, Thermometer, MessageCircle, Lightbulb } from "lucide-react";
import { WeatherData } from "../types";

interface WeatherDisplayProps {
  weather: WeatherData;
}

export function WeatherDisplay({ weather }: WeatherDisplayProps) {
  return (
    <div className="w-full max-w-2xl animate-fade-in rounded-3xl border border-white/20 bg-white/15 p-8 shadow-2xl backdrop-blur-lg">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/80">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">{weather.location}</span>
        </div>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white/90">
          {weather.mood}
        </span>
      </div>

      <div className="mb-8 flex items-center justify-center gap-6">
        <div className="flex flex-col items-center">
          <CloudSun className="mb-2 h-16 w-16 text-white drop-shadow-lg" />
          <span className="text-sm text-white/70">{weather.condition}</span>
        </div>
        <div className="flex items-start">
          <Thermometer className="mr-1 mt-1 h-5 w-5 text-white/70" />
          <span className="text-6xl font-light tracking-tight text-white">
            {Math.round(weather.temperature)}°
          </span>
          <span className="mt-2 text-lg text-white/60">F</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl bg-white/10 p-5">
          <div className="mb-2 flex items-center gap-2 text-white/90">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Mood Message</span>
          </div>
          <p className="text-sm leading-relaxed text-white/80">{weather.mood_message}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-5">
          <div className="mb-2 flex items-center gap-2 text-white/90">
            <Lightbulb className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Recommendation</span>
          </div>
          <p className="text-sm leading-relaxed text-white/80">{weather.recommendation}</p>
        </div>
      </div>
    </div>
  );
}
