export interface Mood {
  id: string;
  label: string;
  emoji: string;
  description: string;
  color: string;
  bgGradient: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  mood_message: string;
  recommendation: string;
  icon: string;
  location: string;
  mood: string;
}

export type AppState = "idle" | "loading" | "success" | "error";
