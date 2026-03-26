import { weatherCache } from "@/backend/cache";

describe("SimpleCache", () => {
  beforeEach(() => {
    // Clear cache by setting expired entries
    // The cache doesn't expose a clear method, so we work around it
  });

  test("returns null for non-existent key", () => {
    expect(weatherCache.get("nonexistent-key-12345")).toBeNull();
  });

  test("stores and retrieves a value", () => {
    const data = { temperature: 72, condition: "sunny" };
    weatherCache.set("test-store", data);
    expect(weatherCache.get("test-store")).toEqual(data);
  });

  test("returns null for expired entry", () => {
    weatherCache.set("test-expired", { value: 1 }, 1); // 1ms TTL
    // Wait for expiration
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(weatherCache.get("test-expired")).toBeNull();
        resolve();
      }, 10);
    });
  });

  test("cache returns identical data within TTL", () => {
    const data = { temperature: 65, condition: "cloudy", id: "cache-identical" };
    weatherCache.set("test-identical", data);
    const first = weatherCache.get("test-identical");
    const second = weatherCache.get("test-identical");
    expect(first).toEqual(second);
    expect(first).toEqual(data);
  });

  describe("makeKey", () => {
    test("joins parts with colon and lowercases", () => {
      expect(weatherCache.makeKey("weather", "happy", "New York")).toBe(
        "weather:happy:new york"
      );
    });

    test("filters out empty strings", () => {
      expect(weatherCache.makeKey("weather", "", "happy")).toBe("weather:happy");
    });

    test("handles single part", () => {
      expect(weatherCache.makeKey("weather")).toBe("weather");
    });
  });
});
