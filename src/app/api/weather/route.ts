import { NextRequest, NextResponse } from "next/server";
import { getMoodById, getValidMoodIds } from "@/backend/moods";
import { getWeather } from "@/backend/weather";
import { WeatherRequest, WeatherResponse } from "@/backend/types";
import { weatherCache } from "@/backend/cache";
import { getLocationFromIp } from "@/backend/geolocation";

function getClientIp(request: NextRequest): string | null {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null
  );
}

export async function POST(request: NextRequest) {
  let body: WeatherRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { mood: moodId, location } = body;

  if (!moodId || typeof moodId !== "string") {
    return NextResponse.json(
      { error: "Missing required field: mood" },
      { status: 400 }
    );
  }

  const mood = getMoodById(moodId);
  if (!mood) {
    return NextResponse.json(
      {
        error: `Invalid mood: "${moodId}". Valid moods: ${getValidMoodIds().join(", ")}`,
      },
      { status: 400 }
    );
  }

  // Resolve location: use provided location, or fall back to IP geolocation
  let resolvedLocation = location?.trim() || "";
  if (!resolvedLocation) {
    const clientIp = getClientIp(request);
    resolvedLocation = await getLocationFromIp(clientIp);
  }

  // Check cache first
  const cacheKey = weatherCache.makeKey("weather", moodId, resolvedLocation);
  const cached = weatherCache.get<WeatherResponse>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const weatherResponse = await getWeather(mood, resolvedLocation);

    // Store in cache (5-minute TTL)
    weatherCache.set(cacheKey, weatherResponse);

    return NextResponse.json(weatherResponse);
  } catch (err) {
    console.error("Weather API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch weather data. Please try again." },
      { status: 500 }
    );
  }
}
