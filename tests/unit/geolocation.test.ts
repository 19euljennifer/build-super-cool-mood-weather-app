import { getLocationFromIp } from "@/backend/geolocation";

describe("Geolocation module", () => {
  test("returns New York for null IP", async () => {
    expect(await getLocationFromIp(null)).toBe("New York");
  });

  test("returns New York for localhost 127.0.0.1", async () => {
    expect(await getLocationFromIp("127.0.0.1")).toBe("New York");
  });

  test("returns New York for localhost ::1", async () => {
    expect(await getLocationFromIp("::1")).toBe("New York");
  });

  test("returns New York for localhost ::ffff:127.0.0.1", async () => {
    expect(await getLocationFromIp("::ffff:127.0.0.1")).toBe("New York");
  });

  test("returns New York for empty string", async () => {
    expect(await getLocationFromIp("")).toBe("New York");
  });
});
