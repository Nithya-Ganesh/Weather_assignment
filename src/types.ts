export interface GeoLocationItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string; // State or province
  country_code?: string;
  timezone?: string;
  elevation?: number;
}

export type UnitSystem = 'metric' | 'imperial';

export interface WeatherCodeDetails {
  code: number;
  description: string;
  icon: string; // Lucide icon identifier
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  bgGradient: string;
}

export interface CurrentWeather {
  temperature: number; // °C
  apparentTemperature: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: number; // degrees
  windGusts: number; // km/h
  weatherCode: number;
  isDay: boolean;
  precipitation: number; // mm
  cloudCover: number; // %
  pressure: number; // hPa
  uvIndex?: number;
}

export interface HourlyForecast {
  time: string[]; // ISO strings
  temperature: number[]; // °C
  apparentTemperature: number[];
  precipitationProbability: number[]; // %
  precipitation: number[]; // mm
  weatherCode: number[];
  windSpeed: number[]; // km/h
  uvIndex: number[];
  relativeHumidity: number[];
}

export interface DailyForecast {
  time: string[]; // YYYY-MM-DD
  weatherCode: number[];
  temperatureMax: number[]; // °C
  temperatureMin: number[]; // °C
  apparentTemperatureMax: number[];
  apparentTemperatureMin: number[];
  precipitationSum: number[]; // mm
  precipitationProbabilityMax: number[]; // %
  windSpeedMax: number[]; // km/h
  uvIndexMax: number[];
  sunrise: string[]; // ISO strings
  sunset: string[]; // ISO strings
}

export interface AirQuality {
  usAqi: number;
  pm2_5: number;
  pm10: number;
  ozone: number;
  nitrogenDioxide: number;
}

export interface CompleteWeatherData {
  location: GeoLocationItem;
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
  airQuality?: AirQuality;
  fetchedAt: string;
}

export interface ActivityRecommendation {
  category: 'running' | 'cycling' | 'hiking' | 'outdoor_dining' | 'sightseeing' | 'water_sports';
  title: string;
  score: number; // 0 to 100
  status: 'Ideal' | 'Good' | 'Caution' | 'Not Recommended';
  reason: string;
  clothingTip: string;
}

export interface PlanningInsight {
  overallSuitability: 'Excellent' | 'Favorable' | 'Moderate' | 'Challenging' | 'Hazardous';
  summaryText: string;
  bestTimeWindow: string;
  gearChecklist: string[];
  weatherAlerts: string[];
  activityRecommendations: ActivityRecommendation[];
}

export interface AIPlanRequest {
  locationName: string;
  country?: string;
  tripDuration?: string;
  tripType?: 'general' | 'outdoor' | 'family' | 'dining_culture' | 'packing';
  customQuestion?: string;
  forecastSummary: string;
}

export interface AIPlanResponse {
  recommendation: string;
  highlights: string[];
  packingItems: string[];
  dayByDayPlan?: { day: string; title: string; advice: string }[];
}
