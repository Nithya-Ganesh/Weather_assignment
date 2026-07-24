import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle, RefreshCw, Compass } from 'lucide-react';
import { CompleteWeatherData, GeoLocationItem, UnitSystem } from './types';
import { fetchWeatherData, POPULAR_CITIES, reverseGeocode } from './services/weatherService';
import { Header } from './components/Header';
import { FavoritesBar } from './components/FavoritesBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecastView } from './components/HourlyForecastView';
import { SevenDayForecastView } from './components/SevenDayForecastView';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { AIPlannerModal } from './components/AIPlannerModal';

const FAVORITES_STORAGE_KEY = 'weather_planner_favorites_v1';
const UNIT_STORAGE_KEY = 'weather_planner_unit_v1';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<GeoLocationItem | null>(null);
  const [weatherData, setWeatherData] = useState<CompleteWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Unit System (°C/metric vs °F/imperial)
  const [unit, setUnit] = useState<UnitSystem>(() => {
    const saved = localStorage.getItem(UNIT_STORAGE_KEY);
    return saved === 'imperial' ? 'imperial' : 'metric';
  });

  // Saved Favorites
  const [favorites, setFavorites] = useState<GeoLocationItem[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved favorites:', e);
    }
    return [POPULAR_CITIES[0], POPULAR_CITIES[1], POPULAR_CITIES[2]];
  });

  // Save favorites to local storage
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Save unit system to local storage
  useEffect(() => {
    localStorage.setItem(UNIT_STORAGE_KEY, unit);
  }, [unit]);

  // Core weather fetch function
  const loadWeather = useCallback(async (location: GeoLocationItem, isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
      setCurrentLocation(location);
    } catch (err: any) {
      console.error('Error loading weather data:', err);
      setError(err?.message || 'Unable to retrieve weather forecast. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Handle GPS location selection
  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const geoItem = await reverseGeocode(lat, lng);
          loadWeather(geoItem);
        } catch (e) {
          setError('Failed to resolve current GPS position location.');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (geoError) => {
        setIsLoadingLocation(false);
        console.warn('GPS location error:', geoError);
        // Fallback to default city if location request denied
        if (!currentLocation) {
          loadWeather(POPULAR_CITIES[0]);
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [currentLocation, loadWeather]);

  // Initial Load - Default to Tokyo or user saved favorite
  useEffect(() => {
    const initialCity = favorites.length > 0 ? favorites[0] : POPULAR_CITIES[0];
    loadWeather(initialCity);
  }, []);

  // Toggle favorite city
  const handleToggleFavorite = (location: GeoLocationItem) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) => Math.abs(f.latitude - location.latitude) < 0.01 && Math.abs(f.longitude - location.longitude) < 0.01
      );
      if (exists) {
        return prev.filter(
          (f) => !(Math.abs(f.latitude - location.latitude) < 0.01 && Math.abs(f.longitude - location.longitude) < 0.01)
        );
      }
      return [location, ...prev];
    });
  };

  const handleRemoveFavorite = (location: GeoLocationItem) => {
    setFavorites((prev) =>
      prev.filter(
        (f) => !(Math.abs(f.latitude - location.latitude) < 0.01 && Math.abs(f.longitude - location.longitude) < 0.01)
      )
    );
  };

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Header */}
      <Header
        currentLocation={currentLocation}
        onSelectLocation={(loc) => loadWeather(loc)}
        onUseMyLocation={handleUseMyLocation}
        isLoadingLocation={isLoadingLocation}
        unit={unit}
        onToggleUnit={handleToggleUnit}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onRefresh={() => currentLocation && loadWeather(currentLocation, true)}
        isRefreshing={isRefreshing}
      />

      {/* Favorites & Popular Pills Bar */}
      <FavoritesBar
        favorites={favorites}
        currentLocation={currentLocation}
        onSelectCity={(city) => loadWeather(city)}
        onRemoveFavorite={handleRemoveFavorite}
      />

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Loading Spinner View */}
        {isLoading && !weatherData && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Compass className="w-8 h-8 text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>
            </div>
            <div className="text-slate-800 font-bold text-lg">Fetching Weather & Forecast Data...</div>
            <p className="text-xs text-slate-500 max-w-sm">Connecting to Open-Meteo real-time weather stations</p>
          </div>
        )}

        {/* Error Alert Box */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 text-sm flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
            {currentLocation && (
              <button
                onClick={() => loadWeather(currentLocation)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            )}
          </div>
        )}

        {/* Weather Dashboard Layout */}
        {weatherData && (
          <div className="space-y-6 animate-fadeIn">
            {/* Current Weather Highlight Card */}
            <CurrentWeatherCard weather={weatherData} unit={unit} />

            {/* 24-Hour Hourly Forecast Slider */}
            <HourlyForecastView hourly={weatherData.hourly} unit={unit} />

            {/* Grid Layout: 7-Day Forecast & Outdoor Activity Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <SevenDayForecastView daily={weatherData.daily} unit={unit} />
              <PlanningRecommendations
                weather={weatherData}
                unit={unit}
                onOpenAiPlanner={() => setIsAiModalOpen(true)}
              />
            </div>
          </div>
        )}
      </main>

      {/* AI Travel & Activity Concierge Modal */}
      {weatherData && (
        <AIPlannerModal
          weather={weatherData}
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-8 text-center text-xs text-slate-500 font-medium space-y-1">
        <p>Weather data provided by Open-Meteo API • AI recommendations powered by Gemini</p>
        <p>© {new Date().getFullYear()} SkyPoint Weather & Forecast Planner</p>
      </footer>
    </div>
  );
}
