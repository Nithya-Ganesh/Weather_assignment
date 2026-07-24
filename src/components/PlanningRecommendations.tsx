import React from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shirt,
  Luggage,
  Clock,
  Sparkles,
  Footprints,
  Bike,
  Trees,
  Utensils,
  MapPin,
} from 'lucide-react';
import { CompleteWeatherData, UnitSystem } from '../types';
import { generatePlanningInsight } from '../utils/weatherUtils';

interface PlanningRecommendationsProps {
  weather: CompleteWeatherData;
  unit: UnitSystem;
  onOpenAiPlanner?: () => void;
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({
  weather,
  unit,
  onOpenAiPlanner,
}) => {
  const { current, daily } = weather;

  const tempC = current.temperature;
  const precipProbMax = daily.precipitationProbabilityMax[0] ?? 0;
  const windKmh = current.windSpeed;
  const uvIndexMax = daily.uvIndexMax[0] ?? current.uvIndex ?? 0;
  const weatherCode = current.weatherCode;

  const insight = generatePlanningInsight(tempC, precipProbMax, windKmh, uvIndexMax, weatherCode, daily);

  const getActivityIcon = (category: string) => {
    switch (category) {
      case 'running':
        return <Footprints className="w-4 h-4 text-blue-600" />;
      case 'cycling':
        return <Bike className="w-4 h-4 text-blue-600" />;
      case 'hiking':
        return <Trees className="w-4 h-4 text-blue-600" />;
      case 'outdoor_dining':
        return <Utensils className="w-4 h-4 text-blue-600" />;
      case 'sightseeing':
        return <MapPin className="w-4 h-4 text-blue-600" />;
      default:
        return <Compass className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ideal':
      case 'Good':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {status}
          </span>
        );
      case 'Caution':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> {status}
          </span>
        );
      case 'Not Recommended':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" /> Avoid
          </span>
        );
    }
  };

  return (
    <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-6 shadow-sm text-blue-900 space-y-6">
      {/* Title & AI Assistant Prompt Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-200/60 pb-4">
        <div>
          <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            Outdoor Planning & Insights
          </h3>
          <p className="text-xs text-blue-700/80 mt-0.5 font-medium">
            Automated weather-based scoring for outdoor pursuits, packing, and gear
          </p>
        </div>

        {onOpenAiPlanner && (
          <button
            onClick={onOpenAiPlanner}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 transition"
            id="open-ai-planner-btn"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            AI Itinerary Assistant
          </button>
        )}
      </div>

      {/* Weather Alerts if present */}
      {insight.weatherAlerts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-rose-900">Weather Advisory</div>
            {insight.weatherAlerts.map((alert, i) => (
              <div key={i}>{alert}</div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Banner & Best Hours */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
            Overall Outlook: {insight.overallSuitability}
          </span>
          <p className="text-xs font-medium text-slate-700">{insight.summaryText}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" /> Best Outdoor Hours
          </span>
          <p className="text-xs font-bold text-slate-900 mt-1">{insight.bestTimeWindow}</p>
        </div>
      </div>

      {/* Activity Suitability Cards Grid */}
      <div>
        <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
          Activity Suitability Scores
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {insight.activityRecommendations.map((act) => (
            <div
              key={act.category}
              className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-2xs flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-100">
                    {getActivityIcon(act.category)}
                  </div>
                  <span className="text-xs font-bold text-slate-900">{act.title}</span>
                </div>
                {getStatusBadge(act.status)}
              </div>

              {/* Progress score bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Suitability Score</span>
                  <span className="font-mono font-bold text-slate-900">{act.score}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      act.score >= 70 ? 'bg-emerald-500' : act.score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${act.score}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-100 flex items-center gap-1.5">
                <Shirt className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="truncate" title={act.clothingTip}>{act.clothingTip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Packing Checklist Recommendations */}
      {insight.gearChecklist.length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <Luggage className="w-4 h-4 text-blue-600" /> Recommended Packing Checklist
          </h4>
          <div className="flex flex-wrap gap-2">
            {insight.gearChecklist.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-100 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
