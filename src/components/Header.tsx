import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Star, Loader2, X, Compass, RefreshCw } from 'lucide-react';
import { GeoLocationItem, UnitSystem } from '../types';
import { searchCities } from '../services/weatherService';

interface HeaderProps {
  currentLocation: GeoLocationItem | null;
  onSelectLocation: (location: GeoLocationItem) => void;
  onUseMyLocation: () => void;
  isLoadingLocation: boolean;
  unit: UnitSystem;
  onToggleUnit: () => void;
  favorites: GeoLocationItem[];
  onToggleFavorite: (location: GeoLocationItem) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  onUseMyLocation,
  isLoadingLocation,
  unit,
  onToggleUnit,
  favorites,
  onToggleFavorite,
  onRefresh,
  isRefreshing,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsOpenDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const cities = await searchCities(query);
      setResults(cities);
      setIsSearching(false);
      setIsOpenDropdown(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: GeoLocationItem) => {
    onSelectLocation(item);
    setQuery('');
    setIsOpenDropdown(false);
  };

  const isFavorite = currentLocation
    ? favorites.some((f) => f.latitude === currentLocation.latitude && f.longitude === currentLocation.longitude)
    : false;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Logo & Current Location Label */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase flex items-center gap-1.5">
                Sky<span className="text-blue-600 font-extrabold">Point</span>
              </h1>
            </div>
          </div>

          {/* Quick Refresh & Favorite Button for Mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
              title="Refresh weather"
              id="refresh-btn-mobile"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>
            {currentLocation && (
              <button
                onClick={() => onToggleFavorite(currentLocation)}
                className={`p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition ${
                  isFavorite ? 'text-amber-500' : 'text-slate-500 hover:text-amber-500'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Save as favorite'}
                id="fav-btn-mobile"
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar & Auto-complete */}
        <div className="relative flex-1 max-w-md w-full" ref={dropdownRef}>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setIsOpenDropdown(true)}
              placeholder="Search city (e.g. San Francisco)..."
              className="w-full bg-slate-100 hover:bg-slate-100/80 text-slate-900 placeholder-slate-400 text-sm rounded-full pl-10 pr-20 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-xs"
              id="city-search-input"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-12 p-1 text-slate-400 hover:text-slate-600 transition"
                id="clear-search-btn"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onUseMyLocation}
              disabled={isLoadingLocation}
              className="absolute right-1.5 p-1.5 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-full border border-slate-200 transition disabled:opacity-50 shadow-xs"
              title="Use current GPS location"
              id="geo-btn"
            >
              {isLoadingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Dropdown Results */}
          {isOpenDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Searching cities...
                </div>
              ) : results.length > 0 ? (
                results.map((city) => (
                  <button
                    key={`${city.id}-${city.latitude}-${city.longitude}`}
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-4 py-2.5 hover:bg-blue-50/60 transition flex items-center justify-between group"
                    id={`search-item-${city.id}`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition">
                        {city.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {[city.admin1, city.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                    {city.country_code && (
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase font-mono font-medium">
                        {city.country_code}
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500 text-sm">
                  No cities found for &quot;{query}&quot;. Try another name.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Controls: Refresh, Favorites, Units */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition flex items-center gap-1.5 text-xs font-semibold border border-slate-200/80"
            title="Refresh weather data"
            id="refresh-btn-desktop"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            Refresh
          </button>

          {currentLocation && (
            <button
              onClick={() => onToggleFavorite(currentLocation)}
              className={`px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition flex items-center gap-1.5 text-xs font-semibold border border-slate-200/80 ${
                isFavorite ? 'text-amber-500' : 'text-slate-600 hover:text-amber-500'
              }`}
              id="fav-btn-desktop"
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Saved' : 'Favorite'}
            </button>
          )}

          {/* Unit Switcher Button */}
          <button
            onClick={onToggleUnit}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold tracking-wider transition border border-slate-200 flex items-center gap-1"
            title="Toggle °C / °F"
            id="unit-toggle-btn"
          >
            <span className={unit === 'metric' ? 'text-blue-600 font-extrabold' : 'text-slate-400'}>°C</span>
            <span className="text-slate-300">/</span>
            <span className={unit === 'imperial' ? 'text-blue-600 font-extrabold' : 'text-slate-400'}>°F</span>
          </button>
        </div>
      </div>
    </header>
  );
};
