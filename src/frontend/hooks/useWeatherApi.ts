"use client";

import { useState, useCallback, useRef } from "react";
import { WeatherData, AppState } from "../types";

interface WeatherApiState {
  weather: WeatherData | null;
  appState: AppState;
  errorMessage: string;
}

export function useWeatherApi() {
  const [state, setState] = useState<WeatherApiState>({
    weather: null,
    appState: "idle",
    errorMessage: "",
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchWeather = useCallback(
    async (moodId: string, location?: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setState({ weather: null, appState: "loading", errorMessage: "" });

      try {
        const body: Record<string, string> = { mood: moodId };
        if (location) {
          body.location = location;
        }

        const response = await fetch("/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.error || `Server error (${response.status})`
          );
        }

        const data: WeatherData = await response.json();
        setState({ weather: data, appState: "success", errorMessage: "" });
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setState({
          weather: null,
          appState: "error",
          errorMessage: message,
        });
      }
    },
    []
  );

  return { ...state, fetchWeather };
}
