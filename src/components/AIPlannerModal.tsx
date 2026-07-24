import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Luggage,
  Calendar,
  Compass,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { AIPlanResponse, CompleteWeatherData } from '../types';

interface AIPlannerModalProps {
  weather: CompleteWeatherData;
  isOpen: boolean;
  onClose: () => void;
}

export const AIPlannerModal: React.FC<AIPlannerModalProps> = ({ weather, isOpen, onClose }) => {
  const [tripType, setTripType] = useState<'general' | 'outdoor' | 'family' | 'dining_culture' | 'packing'>('general');
  const [customQuestion, setCustomQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<AIPlanResponse | null>(null);

  if (!isOpen) return null;

  const handleGeneratePlan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Build forecast summary string to pass to backend
      const summary = `Location: ${weather.location.name}, ${weather.location.country || ''}
Current Temp: ${Math.round(weather.current.temperature)}°C, Feels like: ${Math.round(weather.current.apparentTemperature)}°C
Precipitation Prob Max (Upcoming): ${weather.daily.precipitationProbabilityMax[0]}%
7-Day Max Temperatures: ${weather.daily.temperatureMax.slice(0, 5).join('°C, ')}°C
7-Day Min Temperatures: ${weather.daily.temperatureMin.slice(0, 5).join('°C, ')}°C
7-Day Precipitation Sums: ${weather.daily.precipitationSum.slice(0, 5).join('mm, ')}mm`;

      const response = await fetch('/api/ai-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName: weather.location.name,
          country: weather.location.country,
          tripType,
          customQuestion: customQuestion.trim() || undefined,
          forecastSummary: summary,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate plan.');
      }

      const data: AIPlanResponse = await response.json();
      setAiResponse(data);
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred while communicating with Gemini AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-xl relative my-8 text-slate-900 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition"
          id="close-ai-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm text-white shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">AI Travel & Activity Assistant</h3>
            <p className="text-xs text-slate-500 font-medium">
              Personalized recommendations for <span className="text-blue-600 font-bold">{weather.location.name}</span> powered by Gemini
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleGeneratePlan} className="space-y-4">
          {/* Trip Category Selector */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Select Trip Focus / Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'general', label: 'General Travel', icon: Compass },
                { id: 'outdoor', label: 'Outdoor Sports', icon: Calendar },
                { id: 'family', label: 'Family Trip', icon: Sparkles },
                { id: 'dining_culture', label: 'Dining & Sightseeing', icon: Lightbulb },
                { id: 'packing', label: 'Packing & Clothing', icon: Luggage },
              ].map((item) => {
                const IconComp = item.icon;
                const selected = tripType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTripType(item.id as any)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                      selected
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                    id={`ai-trip-type-${item.id}`}
                  >
                    <IconComp className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Custom Question */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
              Custom Question or Request (Optional)
            </label>
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="e.g. Is Saturday afternoon good for a picnic? What should I wear?"
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              id="ai-custom-prompt-input"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            id="generate-ai-plan-btn"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Analyzing Weather Data with Gemini...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Generate Smart Itinerary & Tips
              </>
            )}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* AI Response Display */}
        {aiResponse && !isLoading && (
          <div className="mt-6 pt-6 border-t border-slate-200 space-y-5 animate-fadeIn">
            {/* Recommendation Summary */}
            <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Gemini AI Forecast Assessment
              </span>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">{aiResponse.recommendation}</p>
            </div>

            {/* Key Highlights */}
            {aiResponse.highlights && aiResponse.highlights.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Top Recommended Highlights
                </h4>
                <div className="space-y-1.5">
                  {aiResponse.highlights.map((h, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-start gap-2 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Day-by-day plan if available */}
            {aiResponse.dayByDayPlan && aiResponse.dayByDayPlan.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Suggested Daily Schedule
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {aiResponse.dayByDayPlan.map((d, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase font-mono text-[10px]">
                          {d.day}
                        </span>
                        <span>{d.title}</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1">{d.advice}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Packing */}
            {aiResponse.packingItems && aiResponse.packingItems.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Luggage className="w-3.5 h-3.5 text-blue-600" /> What to Pack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {aiResponse.packingItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-100"
                    >
                      • {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
