const IP_API_URL = "http://ip-api.com/json";
const DEFAULT_FALLBACK_CITY = "New York";

interface IpApiResponse {
  status: string;
  city?: string;
  lat?: number;
  lon?: number;
}

export async function getLocationFromIp(
  ip: string | null
): Promise<string> {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1") {
    return DEFAULT_FALLBACK_CITY;
  }

  try {
    const res = await fetch(`${IP_API_URL}/${ip}?fields=status,city,lat,lon`, {
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return DEFAULT_FALLBACK_CITY;
    }

    const data: IpApiResponse = await res.json();

    if (data.status === "success" && data.city) {
      return data.city;
    }
  } catch {
    // IP geolocation failed, fall back gracefully
  }

  return DEFAULT_FALLBACK_CITY;
}
