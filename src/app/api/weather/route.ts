import { NextRequest, NextResponse } from "next/server";
import { getMoodById, getValidMoodIds } from "@/backend/moods";
import { getWeather } from "@/backend/weather";
import { WeatherRequest } from "@/backend/types";

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

  try {
    const weatherResponse = await getWeather(mood, location);
    return NextResponse.json(weatherResponse);
  } catch (err) {
    console.error("Weather API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch weather data. Please try again." },
      { status: 500 }
    );
  }
}
