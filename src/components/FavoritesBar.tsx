import React from 'react';
import { Star, MapPin, X } from 'lucide-react';
import { GeoLocationItem } from '../types';
import { POPULAR_CITIES } from '../services/weatherService';

interface FavoritesBarProps {
  favorites: GeoLocationItem[];
  currentLocation: GeoLocationItem | null;
  onSelectCity: (city: GeoLocationItem) => void;
  onRemoveFavorite: (city: GeoLocationItem) => void;
}

export const FavoritesBar: React.FC<FavoritesBarProps> = ({
  favorites,
  currentLocation,
  onSelectCity,
  onRemoveFavorite,
}) => {
  const isSelected = (city: GeoLocationItem) =>
    currentLocation &&
    Math.abs(currentLocation.latitude - city.latitude) < 0.05 &&
    Math.abs(currentLocation.longitude - city.longitude) < 0.05;

  return (
    <div className="w-full bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs">
        <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 shrink-0">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Saved:
        </span>

        {favorites.length > 0 ? (
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            {favorites.map((city) => {
              const active = isSelected(city);
              return (
                <div
                  key={`fav-${city.latitude}-${city.longitude}`}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition shrink-0 ${
                    active
                      ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => onSelectCity(city)}
                    className="flex items-center gap-1 focus:outline-none"
                    id={`fav-pill-${city.name.toLowerCase()}`}
                  >
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span>{city.name}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(city);
                    }}
                    className="text-slate-400 hover:text-slate-700 ml-0.5 p-0.5 rounded-full hover:bg-slate-200 transition"
                    title="Remove"
                    id={`remove-fav-${city.name.toLowerCase()}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-slate-400 italic flex items-center gap-2 text-xs">
            <span>No saved cities yet. Try popular picks:</span>
          </div>
        )}

        {/* Popular Cities Pills */}
        <div className="flex items-center gap-1.5 ml-auto shrink-0 pl-3 border-l border-slate-200">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest hidden lg:inline">Popular:</span>
          {POPULAR_CITIES.slice(0, 5).map((city) => {
            const active = isSelected(city);
            return (
              <button
                key={`pop-${city.name}`}
                onClick={() => onSelectCity(city)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                  active
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/80'
                }`}
                id={`popular-pill-${city.name.toLowerCase()}`}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
