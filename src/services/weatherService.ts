import { AirQuality, CompleteWeatherData, GeoLocationItem } from '../types';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

/** Search for cities using Open-Meteo Geocoding API */
export async function searchCities(query: string): Promise<GeoLocationItem[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(query.trim())}&count=10&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Geocoding search failed');
    const data = await response.json();

    if (!data.results) return [];

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      admin1: item.admin1,
      country_code: item.country_code,
      timezone: item.timezone,
      elevation: item.elevation,
    }));
  } catch (error) {
    console.error('Error in searchCities:', error);
    return [];
  }
}

/** Reverse geocode lat & lng into a city location */
export async function reverseGeocode(latitude: number, longitude: number): Promise<GeoLocationItem> {
  try {
    // Try BigDataCloud free client-side reverse geocoding API
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const cityName = data.city || data.locality || data.principalSubdivision || 'Current Location';
      return {
        id: Date.now(),
        name: cityName,
        latitude,
        longitude,
        country: data.countryName || '',
        admin1: data.principalSubdivision || '',
        country_code: data.countryCode || '',
      };
    }
  } catch (err) {
    console.warn('Reverse geocoding client error, using fallback name:', err);
  }

  return {
    id: Date.now(),
    name: 'Your Location',
    latitude,
    longitude,
  };
}

/** Fetch full weather forecast & air quality for location */
export async function fetchWeatherData(location: GeoLocationItem): Promise<CompleteWeatherData> {
  const { latitude, longitude } = location;

  const weatherUrl = `${WEATHER_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto`;

  const airQualityUrl = `${AIR_QUALITY_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide&timezone=auto`;

  // Fetch weather and air quality in parallel
  const [weatherRes, airQualityRes] = await Promise.allSettled([
    fetch(weatherUrl),
    fetch(airQualityUrl),
  ]);

  if (weatherRes.status === 'rejected' || !weatherRes.value.ok) {
    throw new Error('Failed to fetch weather data from Open-Meteo');
  }

  const weatherData = await weatherRes.value.json();

  let airQuality: AirQuality | undefined = undefined;
  if (airQualityRes.status === 'fulfilled' && airQualityRes.value.ok) {
    try {
      const aqData = await airQualityRes.value.json();
      if (aqData.current) {
        airQuality = {
          usAqi: aqData.current.us_aqi ?? 0,
          pm2_5: aqData.current.pm2_5 ?? 0,
          pm10: aqData.current.pm10 ?? 0,
          ozone: aqData.current.ozone ?? 0,
          nitrogenDioxide: aqData.current.nitrogen_dioxide ?? 0,
        };
      }
    } catch (e) {
      console.warn('Air quality parsing error:', e);
    }
  }

  const current = weatherData.current || {};
  const hourly = weatherData.hourly || {};
  const daily = weatherData.daily || {};

  return {
    location,
    current: {
      temperature: current.temperature_2m ?? 0,
      apparentTemperature: current.apparent_temperature ?? current.temperature_2m ?? 0,
      humidity: current.relative_humidity_2m ?? 0,
      windSpeed: current.wind_speed_10m ?? 0,
      windDirection: current.wind_direction_10m ?? 0,
      windGusts: current.wind_gusts_10m ?? current.wind_speed_10m ?? 0,
      weatherCode: current.weather_code ?? 0,
      isDay: current.is_day !== undefined ? Boolean(current.is_day) : true,
      precipitation: current.precipitation ?? 0,
      cloudCover: current.cloud_cover ?? 0,
      pressure: current.surface_pressure ?? current.pressure_msl ?? 1013,
      uvIndex: hourly.uv_index ? hourly.uv_index[0] : 0,
    },
    hourly: {
      time: hourly.time || [],
      temperature: hourly.temperature_2m || [],
      apparentTemperature: hourly.apparent_temperature || [],
      precipitationProbability: hourly.precipitation_probability || [],
      precipitation: hourly.precipitation || [],
      weatherCode: hourly.weather_code || [],
      windSpeed: hourly.wind_speed_10m || [],
      uvIndex: hourly.uv_index || [],
      relativeHumidity: hourly.relative_humidity_2m || [],
    },
    daily: {
      time: daily.time || [],
      weatherCode: daily.weather_code || [],
      temperatureMax: daily.temperature_2m_max || [],
      temperatureMin: daily.temperature_2m_min || [],
      apparentTemperatureMax: daily.apparent_temperature_max || [],
      apparentTemperatureMin: daily.apparent_temperature_min || [],
      precipitationSum: daily.precipitation_sum || [],
      precipitationProbabilityMax: daily.precipitation_probability_max || [],
      windSpeedMax: daily.wind_speed_10m_max || [],
      uvIndexMax: daily.uv_index_max || [],
      sunrise: daily.sunrise || [],
      sunset: daily.sunset || [],
    },
    airQuality,
    fetchedAt: new Date().toISOString(),
  };
}

/** Default popular cities for quick selection */
export const POPULAR_CITIES: GeoLocationItem[] = [
  { id: 1, name: 'Tokyo', latitude: 35.6895, longitude: 139.6917, country: 'Japan', country_code: 'JP' },
  { id: 2, name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France', country_code: 'FR' },
  { id: 3, name: 'New York', latitude: 40.7128, longitude: -74.006, country: 'United States', admin1: 'New York', country_code: 'US' },
  { id: 4, name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', country_code: 'GB' },
  { id: 5, name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia', country_code: 'AU' },
  { id: 6, name: 'San Francisco', latitude: 37.7749, longitude: -122.4194, country: 'United States', admin1: 'California', country_code: 'US' },
  { id: 7, name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'United Arab Emirates', country_code: 'AE' },
  { id: 8, name: 'Singapore', latitude: 1.3521, longitude: 103.8198, country: 'Singapore', country_code: 'SG' },
];
