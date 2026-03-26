const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3099";

describe("GET /api/moods", () => {
  test("returns 200 with array of 5 moods", async () => {
    const res = await fetch(`${BASE_URL}/api/moods`);
    expect(res.status).toBe(200);
    const moods = await res.json();
    expect(Array.isArray(moods)).toBe(true);
    expect(moods).toHaveLength(5);
  });

  test("each mood has id, label, emoji, description", async () => {
    const res = await fetch(`${BASE_URL}/api/moods`);
    const moods = await res.json();
    for (const mood of moods) {
      expect(mood).toHaveProperty("id");
      expect(mood).toHaveProperty("label");
      expect(mood).toHaveProperty("emoji");
      expect(mood).toHaveProperty("description");
    }
  });

  test("moods do NOT expose internal weatherKeywords", async () => {
    const res = await fetch(`${BASE_URL}/api/moods`);
    const moods = await res.json();
    for (const mood of moods) {
      expect(mood).not.toHaveProperty("weatherKeywords");
      expect(mood).not.toHaveProperty("moodMessages");
      expect(mood).not.toHaveProperty("recommendations");
    }
  });
});

describe("POST /api/weather", () => {
  test("returns 200 with valid mood", async () => {
    const res = await fetch(`${BASE_URL}/api/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood: "happy" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("temperature");
    expect(data).toHaveProperty("condition");
    expect(data).toHaveProperty("mood_message");
    expect(data).toHaveProperty("recommendation");
    expect(data).toHaveProperty("icon");
    expect(data).toHaveProperty("location");
    expect(data).toHaveProperty("mood");
    expect(data.mood).toBe("happy");
  });

  test("returns 200 with valid mood and location", async () => {
    const res = await fetch(`${BASE_URL}/api/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood: "sad", location: "London" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.mood).toBe("sad");
    expect(data.location).toBe("London");
  });

  test("returns correct schema for all 5 moods", async () => {
    const moods = ["happy", "sad", "energetic", "calm", "anxious"];
    for (const mood of moods) {
      const res = await fetch(`${BASE_URL}/api/weather`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, location: "TestCity" }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(typeof data.temperature).toBe("number");
      expect(typeof data.condition).toBe("string");
      expect(typeof data.mood_message).toBe("string");
      expect(typeof data.recommendation).toBe("string");
      expect(typeof data.icon).toBe("string");
      expect(typeof data.location).toBe("string");
      expect(data.mood).toBe(mood);
    }
  });

  test("returns 400 for invalid mood", async () => {
    const res = await fetch(`${BASE_URL}/api/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood: "INVALID_MOOD" }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Invalid mood");
    expect(data.error).toContain("INVALID_MOOD");
  });

  test("returns 400 for missing mood field", async () => {
    const res = await fetch(`${BASE_URL}/api/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location: "London" }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Missing required field: mood");
  });

  test("returns 400 for empty body", async () => {
    const res = await fetch(`${BASE_URL}/api/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  test("returns 400 for invalid JSON", async () => {
    const res = await fetch(`${BASE_URL}/api/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Invalid JSON");
  });

  test("returns 400 for numeric mood value", async () => {
    const res = await fetch(`${BASE_URL}/api/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood: 123 }),
    });
    expect(res.status).toBe(400);
  });

  test("cached response returns same data", async () => {
    // First request
    const res1 = await fetch(`${BASE_URL}/api/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood: "calm", location: "CacheTestCity" }),
    });
    const data1 = await res1.json();

    // Second request (should be cached)
    const res2 = await fetch(`${BASE_URL}/api/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood: "calm", location: "CacheTestCity" }),
    });
    const data2 = await res2.json();

    // Cached response should be identical
    expect(data2.temperature).toBe(data1.temperature);
    expect(data2.condition).toBe(data1.condition);
    expect(data2.mood_message).toBe(data1.mood_message);
    expect(data2.recommendation).toBe(data1.recommendation);
  });

  test("different moods return different responses", async () => {
    const results: Record<string, { temperature: number; condition: string }> = {};
    for (const mood of ["happy", "sad"]) {
      const res = await fetch(`${BASE_URL}/api/weather`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, location: "DiffTest" }),
      });
      results[mood] = await res.json();
    }
    expect(results.happy.temperature).not.toBe(results.sad.temperature);
    expect(results.happy.condition).not.toBe(results.sad.condition);
  });
});
