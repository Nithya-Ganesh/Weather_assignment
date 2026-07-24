import React from 'react';
import {
  Thermometer,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  CloudRain,
  Sun,
  ShieldAlert,
  Compass,
  Clock,
} from 'lucide-react';
import { CompleteWeatherData, UnitSystem } from '../types';
import {
  getWeatherCodeDetails,
  formatTemp,
  formatWind,
  formatPrecip,
  getWindCardinal,
  getAqiDetails,
  getUvDetails,
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  weather: CompleteWeatherData;
  unit: UnitSystem;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather, unit }) => {
  const { location, current, daily, airQuality } = weather;
  const weatherDetails = getWeatherCodeDetails(current.weatherCode, current.isDay);

  const todayMax = daily.temperatureMax[0] ?? current.temperature;
  const todayMin = daily.temperatureMin[0] ?? current.temperature;
  const todayRainProb = daily.precipitationProbabilityMax[0] ?? 0;

  const aqiInfo = getAqiDetails(airQuality?.usAqi);
  const uvInfo = getUvDetails(current.uvIndex);

  // Format local sunrise and sunset
  const formatTimeStr = (isoStr?: string) => {
    if (!isoStr) return '--:--';
    try {
      const date = new Date(isoStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  const sunriseTime = formatTimeStr(daily.sunrise[0]);
  const sunsetTime = formatTimeStr(daily.sunset[0]);

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-slate-900 transition-all">
      {/* Hero Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900" id="current-city-name">
              {location.name}
            </h1>
            {location.country_code && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold uppercase border border-slate-200">
                {location.country_code}
              </span>
            )}
          </div>
          <p className="text-slate-500 font-medium text-sm sm:text-base mt-1">
            {formattedDate} • <span className="text-slate-700 font-semibold">{weatherDetails.description}</span>
          </p>

          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-7xl sm:text-8xl font-light tracking-tighter text-slate-900" id="current-temp-display">
              {unit === 'imperial' ? Math.round((current.temperature * 9) / 5 + 32) : Math.round(current.temperature)}°
            </span>
            <span className="text-2xl font-normal text-slate-400">
              {unit === 'imperial' ? 'F' : 'C'}
            </span>
            <span className="text-xs text-slate-500 font-medium ml-3">
              (Feels like {formatTemp(current.apparentTemperature, unit)})
            </span>
          </div>
        </div>

        {/* Icon & Primary Highlights Column */}
        <div className="text-left md:text-right flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-blue-50/80 border border-blue-100 rounded-2xl flex items-center justify-center mb-0 md:mb-2 shadow-xs">
            <WeatherIcon iconName={weatherDetails.icon} className="w-14 h-14 text-blue-600" />
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-xs font-semibold text-slate-500">
              High <span className="text-slate-900 font-bold">{formatTemp(todayMax, unit)}</span> • Low <span className="text-slate-900 font-bold">{formatTemp(todayMin, unit)}</span>
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Humidity <span className="text-slate-900 font-bold">{current.humidity}%</span>
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Wind <span className="text-slate-900 font-bold">{formatWind(current.windSpeed, unit)} {getWindCardinal(current.windDirection)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Detail Conditions Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-100">
        {/* Wind Speed */}
        <div className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 transition">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-blue-600" /> Wind
            </span>
          </div>
          <div className="text-base font-bold text-slate-900">
            {formatWind(current.windSpeed, unit)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 truncate">
            Gusts: {formatWind(current.windGusts, unit)}
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 transition">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-600" /> Humidity
            </span>
          </div>
          <div className="text-base font-bold text-slate-900">{current.humidity}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5 truncate">
            {current.humidity > 70 ? 'High moisture' : current.humidity < 30 ? 'Dry air' : 'Comfortable'}
          </div>
        </div>

        {/* Rain / Precip Chance */}
        <div className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 transition">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-blue-600" /> Precip
            </span>
            <span className="text-[10px] text-blue-700 font-bold">{todayRainProb}%</span>
          </div>
          <div className="text-base font-bold text-slate-900">
            {formatPrecip(current.precipitation, unit)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 truncate">
            Cloud: {current.cloudCover}%
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 transition">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-500" /> UV Index
            </span>
          </div>
          <div className="text-base font-bold text-slate-900 flex items-center gap-1.5">
            <span>{current.uvIndex ?? 0}</span>
            <span className={`text-xs font-bold ${uvInfo.color}`}>{uvInfo.label}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 truncate" title={uvInfo.advice}>
            {uvInfo.advice}
          </div>
        </div>

        {/* Air Quality Index */}
        <div className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 transition">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" /> Air Quality
            </span>
          </div>
          <div className="text-base font-bold text-slate-900 flex items-center gap-1.5">
            <span>{airQuality?.usAqi ?? '--'}</span>
            <span className={`text-xs font-bold ${aqiInfo.color}`}>{aqiInfo.label}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 truncate">
            {airQuality ? `PM2.5: ${airQuality.pm2_5.toFixed(1)}` : 'AQI standard'}
          </div>
        </div>

        {/* Pressure & Sun */}
        <div className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 transition">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-indigo-600" /> Sunset
            </span>
          </div>
          <div className="text-base font-bold text-slate-900">{sunsetTime}</div>
          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
            <span>Sunrise: {sunriseTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
