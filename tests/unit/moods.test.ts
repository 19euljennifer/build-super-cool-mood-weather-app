import { MOODS, getMoodById, getValidMoodIds } from "@/backend/moods";

describe("Moods module", () => {
  test("MOODS contains exactly 5 moods", () => {
    expect(MOODS).toHaveLength(5);
  });

  test("all expected mood IDs are present", () => {
    const ids = MOODS.map((m) => m.id);
    expect(ids).toEqual(["happy", "sad", "energetic", "calm", "anxious"]);
  });

  test("each mood has required fields", () => {
    for (const mood of MOODS) {
      expect(mood.id).toBeTruthy();
      expect(mood.label).toBeTruthy();
      expect(mood.emoji).toBeTruthy();
      expect(mood.description).toBeTruthy();
      expect(mood.weatherKeywords.length).toBeGreaterThan(0);
      expect(mood.moodMessages.length).toBeGreaterThan(0);
      expect(mood.recommendations.length).toBeGreaterThan(0);
    }
  });

  test("each mood has distinct moodMessages", () => {
    const allMessages = new Set<string>();
    for (const mood of MOODS) {
      for (const msg of mood.moodMessages) {
        expect(allMessages.has(msg)).toBe(false);
        allMessages.add(msg);
      }
    }
  });

  test("each mood has distinct recommendations", () => {
    const allRecs = new Set<string>();
    for (const mood of MOODS) {
      for (const rec of mood.recommendations) {
        expect(allRecs.has(rec)).toBe(false);
        allRecs.add(rec);
      }
    }
  });

  describe("getMoodById", () => {
    test("returns mood for valid ID", () => {
      const happy = getMoodById("happy");
      expect(happy).toBeDefined();
      expect(happy!.id).toBe("happy");
      expect(happy!.label).toBe("Happy");
    });

    test("returns undefined for invalid ID", () => {
      expect(getMoodById("nonexistent")).toBeUndefined();
    });

    test("returns undefined for empty string", () => {
      expect(getMoodById("")).toBeUndefined();
    });
  });

  describe("getValidMoodIds", () => {
    test("returns all 5 mood IDs", () => {
      const ids = getValidMoodIds();
      expect(ids).toHaveLength(5);
      expect(ids).toContain("happy");
      expect(ids).toContain("sad");
      expect(ids).toContain("energetic");
      expect(ids).toContain("calm");
      expect(ids).toContain("anxious");
    });
  });
});
