export interface MoodDefinition {
  id: string;
  label: string;
  emoji: string;
  description: string;
  weatherKeywords: string[];
  moodMessages: string[];
  recommendations: string[];
}

export interface WeatherRequest {
  mood: string;
  location?: string;
}

export interface WeatherResponse {
  temperature: number;
  condition: string;
  mood_message: string;
  recommendation: string;
  icon: string;
  location: string;
  mood: string;
}

export interface OpenWeatherResponse {
  main: {
    temp: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
}
