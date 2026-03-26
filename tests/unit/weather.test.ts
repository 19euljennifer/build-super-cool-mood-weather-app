import { getWeather } from "@/backend/weather";
import { getMoodById } from "@/backend/moods";

// No OPENWEATHER_API_KEY set, so fallback weather is used
describe("Weather module (fallback mode)", () => {
  test("returns weather response for happy mood", async () => {
    const mood = getMoodById("happy")!;
    const result = await getWeather(mood, "TestCity");
    expect(result).toEqual(
      expect.objectContaining({
        temperature: 75,
        condition: "clear sky",
        icon: "sun",
        location: "TestCity",
        mood: "happy",
      })
    );
    expect(mood.moodMessages).toContain(result.mood_message);
    expect(mood.recommendations).toContain(result.recommendation);
  });

  test("returns weather response for sad mood", async () => {
    const mood = getMoodById("sad")!;
    const result = await getWeather(mood, "TestCity");
    expect(result.temperature).toBe(55);
    expect(result.condition).toBe("light rain");
    expect(result.icon).toBe("cloud-rain");
    expect(result.mood).toBe("sad");
    expect(mood.moodMessages).toContain(result.mood_message);
  });

  test("returns weather response for energetic mood", async () => {
    const mood = getMoodById("energetic")!;
    const result = await getWeather(mood, "TestCity");
    expect(result.temperature).toBe(68);
    expect(result.condition).toBe("scattered clouds");
    expect(result.mood).toBe("energetic");
  });

  test("returns weather response for calm mood", async () => {
    const mood = getMoodById("calm")!;
    const result = await getWeather(mood, "TestCity");
    expect(result.temperature).toBe(70);
    expect(result.condition).toBe("gentle breeze");
    expect(result.mood).toBe("calm");
  });

  test("returns weather response for anxious mood", async () => {
    const mood = getMoodById("anxious")!;
    const result = await getWeather(mood, "TestCity");
    expect(result.temperature).toBe(60);
    expect(result.condition).toBe("misty");
    expect(result.icon).toBe("wind");
    expect(result.mood).toBe("anxious");
  });

  test("each mood produces a distinct temperature in fallback mode", async () => {
    const temps = new Set<number>();
    for (const id of ["happy", "sad", "energetic", "calm", "anxious"]) {
      const mood = getMoodById(id)!;
      const result = await getWeather(mood, "Test");
      temps.add(result.temperature);
    }
    expect(temps.size).toBe(5);
  });

  test("defaults to New York when no location provided", async () => {
    const mood = getMoodById("happy")!;
    const result = await getWeather(mood);
    expect(result.location).toBe("New York");
  });

  test("defaults to New York when empty location provided", async () => {
    const mood = getMoodById("happy")!;
    const result = await getWeather(mood, "  ");
    expect(result.location).toBe("New York");
  });

  test("response schema matches contract", async () => {
    const mood = getMoodById("happy")!;
    const result = await getWeather(mood, "London");
    expect(typeof result.temperature).toBe("number");
    expect(typeof result.condition).toBe("string");
    expect(typeof result.mood_message).toBe("string");
    expect(typeof result.recommendation).toBe("string");
    expect(typeof result.icon).toBe("string");
    expect(typeof result.location).toBe("string");
    expect(typeof result.mood).toBe("string");
    // Verify all fields are present (no undefined)
    expect(Object.values(result).every((v) => v !== undefined)).toBe(true);
  });
});
