import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, CloudRain, Sun, Wind, Droplets, Sunrise, Sunset } from 'lucide-react';
import { DailyForecast, UnitSystem } from '../types';
import { getWeatherCodeDetails, formatTemp, formatWind, formatPrecip } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface SevenDayForecastViewProps {
  daily: DailyForecast;
  unit: UnitSystem;
}

export const SevenDayForecastView: React.FC<SevenDayForecastViewProps> = ({ daily, unit }) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(0);

  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Calculate overall min & max across 7 days for normalized temperature bar graph
  const allMins = daily.temperatureMin;
  const allMaxs = daily.temperatureMax;
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const globalRange = Math.max(1, globalMax - globalMin);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          7-Day Forecast
        </h2>
        <span className="text-xs text-slate-400 font-medium">Click day for details</span>
      </div>

      <div className="space-y-2.5">
        {daily.time.slice(0, 7).map((dateStr, idx) => {
          const date = new Date(dateStr + 'T00:00:00');
          const isToday = idx === 0;
          const dayName = isToday
            ? 'Today'
            : date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

          const weatherCode = daily.weatherCode[idx] ?? 0;
          const maxTemp = daily.temperatureMax[idx] ?? 0;
          const minTemp = daily.temperatureMin[idx] ?? 0;
          const precipSum = daily.precipitationSum[idx] ?? 0;
          const precipProb = daily.precipitationProbabilityMax[idx] ?? 0;
          const windSpeed = daily.windSpeedMax[idx] ?? 0;
          const uvMax = daily.uvIndexMax[idx] ?? 0;
          const sunriseStr = daily.sunrise[idx] ? new Date(daily.sunrise[idx]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
          const sunsetStr = daily.sunset[idx] ? new Date(daily.sunset[idx]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

          const weatherDetails = getWeatherCodeDetails(weatherCode, true);
          const isExpanded = selectedDayIdx === idx;

          // Bar calculation for relative visualization
          const barLeftPct = Math.max(0, ((minTemp - globalMin) / globalRange) * 100);
          const barWidthPct = Math.max(8, ((maxTemp - minTemp) / globalRange) * 100);

          return (
            <div
              key={`day-${dateStr}-${idx}`}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-blue-50/70 border-blue-200 shadow-2xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              {/* Row Summary */}
              <button
                onClick={() => setSelectedDayIdx(isExpanded ? null : idx)}
                className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none gap-3"
                id={`forecast-day-row-${idx}`}
              >
                {/* Day & Condition Icon */}
                <div className="flex items-center gap-3 w-36 sm:w-48 shrink-0">
                  <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 shrink-0">
                    <WeatherIcon iconName={weatherDetails.icon} className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${isToday ? 'text-blue-600' : 'text-slate-900'}`}>
                      {dayName}
                    </div>
                    <div className="text-xs text-slate-500 truncate max-w-[120px]">
                      {weatherDetails.description}
                    </div>
                  </div>
                </div>

                {/* Rain probability pill */}
                <div className="hidden sm:flex items-center gap-1 text-xs text-blue-600 font-semibold w-16 shrink-0">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>{precipProb}%</span>
                </div>

                {/* Visual Temperature Bar Graph */}
                <div className="flex-1 mx-2 hidden md:block">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1 px-1">
                    <span>{formatTemp(minTemp, unit)}</span>
                    <span>{formatTemp(maxTemp, unit)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 relative border border-slate-200 overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-blue-600 rounded-full"
                      style={{
                        left: `${barLeftPct}%`,
                        width: `${barWidthPct}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Compact Min/Max for small screens */}
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 shrink-0">
                  <span className="text-slate-400 font-normal">{formatTemp(minTemp, unit)}</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-900">{formatTemp(maxTemp, unit)}</span>
                </div>

                {/* Chevron Toggle */}
                <div className="text-slate-400 shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded Day Details Breakdown */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-blue-200/60 bg-white/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    <span className="text-slate-500 block mb-0.5 font-medium">Precipitation Sum</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5 text-blue-600" /> {formatPrecip(precipSum, unit)} ({precipProb}%)
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    <span className="text-slate-500 block mb-0.5 font-medium">Max Wind Speed</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-blue-600" /> {formatWind(windSpeed, unit)}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    <span className="text-slate-500 block mb-0.5 font-medium">Max UV Index</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-500" /> {uvMax} / 12
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    <span className="text-slate-500 block mb-0.5 font-medium">Daylight Period</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Sunrise className="w-3.5 h-3.5 text-amber-500" /> {sunriseStr} - <Sunset className="w-3.5 h-3.5 text-orange-500" /> {sunsetStr}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
