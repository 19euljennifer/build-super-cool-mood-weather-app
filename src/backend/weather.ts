import { MoodDefinition, WeatherResponse, OpenWeatherResponse } from "./types";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "";
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const DEFAULT_LOCATION = "New York";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function mapWeatherIcon(owmIcon: string): string {
  const iconMap: Record<string, string> = {
    "01d": "sun",
    "01n": "moon",
    "02d": "cloud-sun",
    "02n": "cloud-moon",
    "03d": "cloud",
    "03n": "cloud",
    "04d": "clouds",
    "04n": "clouds",
    "09d": "cloud-drizzle",
    "09n": "cloud-drizzle",
    "10d": "cloud-rain",
    "10n": "cloud-rain",
    "11d": "cloud-lightning",
    "11n": "cloud-lightning",
    "13d": "snowflake",
    "13n": "snowflake",
    "50d": "wind",
    "50n": "wind",
  };
  return iconMap[owmIcon] || "cloud";
}

async function fetchWeatherByCoords(
  lat: number,
  lon: number
): Promise<OpenWeatherResponse> {
  const url = `${OPENWEATHER_BASE_URL}?lat=${lat}&lon=${lon}&units=imperial&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function fetchWeatherByCity(
  city: string
): Promise<OpenWeatherResponse> {
  const url = `${OPENWEATHER_BASE_URL}?q=${encodeURIComponent(city)}&units=imperial&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function parseLocation(location: string): { lat: number; lon: number } | null {
  const parts = location.split(",").map((s) => s.trim());
  if (parts.length === 2) {
    const lat = parseFloat(parts[0]);
    const lon = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      return { lat, lon };
    }
  }
  return null;
}

export async function getWeather(
  mood: MoodDefinition,
  location?: string
): Promise<WeatherResponse> {
  let weatherData: OpenWeatherResponse;

  const loc = location?.trim() || DEFAULT_LOCATION;
  const coords = parseLocation(loc);

  if (OPENWEATHER_API_KEY) {
    if (coords) {
      weatherData = await fetchWeatherByCoords(coords.lat, coords.lon);
    } else {
      weatherData = await fetchWeatherByCity(loc);
    }
  } else {
    weatherData = generateFallbackWeather(loc, mood);
  }

  return {
    temperature: Math.round(weatherData.main.temp),
    condition: weatherData.weather[0]?.description || "unknown",
    mood_message: pickRandom(mood.moodMessages),
    recommendation: pickRandom(mood.recommendations),
    icon: mapWeatherIcon(weatherData.weather[0]?.icon || "03d"),
    location: weatherData.name || loc,
    mood: mood.id,
  };
}

function generateFallbackWeather(
  location: string,
  mood: MoodDefinition
): OpenWeatherResponse {
  const moodWeatherMap: Record<string, { temp: number; desc: string; icon: string }> = {
    happy: { temp: 75, desc: "clear sky", icon: "01d" },
    sad: { temp: 55, desc: "light rain", icon: "10d" },
    energetic: { temp: 68, desc: "scattered clouds", icon: "03d" },
    calm: { temp: 70, desc: "gentle breeze", icon: "02d" },
    anxious: { temp: 60, desc: "misty", icon: "50d" },
  };

  const weather = moodWeatherMap[mood.id] || moodWeatherMap.calm;

  return {
    main: { temp: weather.temp },
    weather: [{ main: weather.desc, description: weather.desc, icon: weather.icon }],
    name: location || DEFAULT_LOCATION,
  };
}
