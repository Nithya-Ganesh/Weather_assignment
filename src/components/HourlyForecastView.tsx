import React from 'react';
import { Clock, CloudRain, Wind, Droplets } from 'lucide-react';
import { HourlyForecast, UnitSystem } from '../types';
import { getWeatherCodeDetails, formatTemp, formatWind } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastViewProps {
  hourly: HourlyForecast;
  unit: UnitSystem;
}

export const HourlyForecastView: React.FC<HourlyForecastViewProps> = ({ hourly, unit }) => {
  // Extract next 24 hours starting from current time
  const next24Hours = hourly.time.slice(0, 24).map((timeStr, idx) => {
    const date = new Date(timeStr);
    const hourLabel = idx === 0 ? 'Now' : date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    const isDay = date.getHours() >= 6 && date.getHours() <= 19;
    const temp = hourly.temperature[idx] ?? 0;
    const weatherCode = hourly.weatherCode[idx] ?? 0;
    const rainProb = hourly.precipitationProbability[idx] ?? 0;
    const windSpeed = hourly.windSpeed[idx] ?? 0;
    const details = getWeatherCodeDetails(weatherCode, isDay);

    return {
      timeStr,
      hourLabel,
      temp,
      weatherCode,
      rainProb,
      windSpeed,
      details,
    };
  });

  // Calculate temp range for visual bar relative scaling
  const temps = next24Hours.map((h) => h.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = Math.max(1, maxTemp - minTemp);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          24-Hour Hourly Forecast
        </h3>
        <span className="text-xs text-slate-400 font-medium">Scroll horizontally →</span>
      </div>

      {/* Horizontal Scrollable Slider */}
      <div className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {next24Hours.map((item, idx) => {
          const barHeightPct = Math.min(100, Math.max(15, ((item.temp - minTemp) / tempRange) * 100));
          const isNow = idx === 0;

          return (
            <div
              key={`hourly-${item.timeStr}-${idx}`}
              className={`flex-none w-20 p-3 rounded-xl flex flex-col items-center justify-between transition-all border ${
                isNow
                  ? 'bg-blue-600 border-blue-700 text-white shadow-md'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-800'
              }`}
            >
              {/* Hour Label */}
              <span className={`text-xs font-bold ${isNow ? 'text-white' : 'text-slate-600'}`}>
                {item.hourLabel}
              </span>

              {/* Weather Icon */}
              <div className={`my-2 p-1.5 rounded-lg ${isNow ? 'bg-blue-700/60' : 'bg-white border border-slate-200'}`}>
                <WeatherIcon iconName={item.details.icon} className={`w-6 h-6 ${isNow ? 'text-white' : 'text-slate-700'}`} />
              </div>

              {/* Rain Probability Badge */}
              <div className={`flex items-center gap-0.5 text-[10px] font-bold my-1 ${isNow ? 'text-blue-100' : 'text-blue-600'}`}>
                <CloudRain className="w-2.5 h-2.5" />
                <span>{item.rainProb}%</span>
              </div>

              {/* Temp Display & Mini Visual Height Bar */}
              <div className="w-full text-center mt-1">
                <div className={`text-sm font-bold ${isNow ? 'text-white' : 'text-slate-900'}`}>{formatTemp(item.temp, unit)}</div>
                
                {/* Visual Relative Temperature Bar */}
                <div className={`w-full rounded-full h-1.5 mt-2 p-0.5 ${isNow ? 'bg-blue-800' : 'bg-slate-200'}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${isNow ? 'bg-white' : 'bg-blue-600'}`}
                    style={{ width: `${barHeightPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
