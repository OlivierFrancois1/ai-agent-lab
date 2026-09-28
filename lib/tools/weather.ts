export type WeatherArguments = {
  city: string;
};

export type WeatherResult = {
  city: string;
  temperature: number;
  temperatureUnit: string;
  windSpeed: number;
  condition: string;
};

type GeocodingResponse = {
  results?: Array<{
    name?: string;
    latitude?: number;
    longitude?: number;
    admin1?: string;
    country?: string;
  }>;
};

type ForecastResponse = {
  current?: {
    temperature_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };
  current_units?: {
    temperature_2m?: string;
  };
};

async function fetchWeatherData<T>(url: string, errorMessage: string): Promise<T> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) {
      throw new Error(errorMessage);
    }
    return (await response.json()) as T;
  } catch {
    throw new Error(errorMessage);
  }
}

export function parseWeatherArguments(value: unknown): WeatherArguments {
  if (
    typeof value !== "object" ||
    value === null ||
    !("city" in value) ||
    typeof value.city !== "string" ||
    value.city.trim().length === 0
  ) {
    throw new Error("Weather arguments must include a city name.");
  }

  return { city: value.city.trim() };
}

function describeWeatherCode(code: number): string {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown conditions";
}

export async function getWeather({ city }: WeatherArguments): Promise<WeatherResult> {
  const query = new URLSearchParams({ name: city, count: "1", language: "en", format: "json" });
  const geocodingData = await fetchWeatherData<GeocodingResponse>(
    `https://geocoding-api.open-meteo.com/v1/search?${query}`,
    "City lookup failed. Please try again.",
  );
  const location = geocodingData.results?.[0];
  if (
    !location ||
    typeof location.name !== "string" ||
    typeof location.latitude !== "number" ||
    typeof location.longitude !== "number"
  ) {
    throw new Error(`I couldn't find a city named ${city}.`);
  }

  const forecastQuery = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: "temperature_2m,wind_speed_10m,weather_code",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    timezone: "auto",
  });
  const forecastData = await fetchWeatherData<ForecastResponse>(
    `https://api.open-meteo.com/v1/forecast?${forecastQuery}`,
    "The weather service could not return current conditions. Please try again.",
  );
  const current = forecastData.current;
  if (
    !current ||
    typeof current.temperature_2m !== "number" ||
    typeof current.wind_speed_10m !== "number" ||
    typeof current.weather_code !== "number" ||
    typeof forecastData.current_units?.temperature_2m !== "string"
  ) {
    throw new Error("Current weather data is unavailable for that city.");
  }

  const cityLabel = [location.name, location.admin1, location.country]
    .filter((part): part is string => typeof part === "string" && part.length > 0)
    .filter((part, index, parts) => parts.indexOf(part) === index)
    .join(", ");

  return {
    city: cityLabel,
    temperature: current.temperature_2m,
    temperatureUnit: forecastData.current_units.temperature_2m,
    windSpeed: current.wind_speed_10m,
    condition: describeWeatherCode(current.weather_code),
  };
}
