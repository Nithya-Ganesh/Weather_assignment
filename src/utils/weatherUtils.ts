import { ActivityRecommendation, DailyForecast, PlanningInsight, UnitSystem, WeatherCodeDetails } from '../types';

/**
 * Maps World Meteorological Organization (WMO) weather code to human readable info
 */
export function getWeatherCodeDetails(code: number, isDay: boolean = true): WeatherCodeDetails {
  switch (code) {
    case 0:
      return {
        code,
        description: 'Clear Sky',
        icon: isDay ? 'Sun' : 'Moon',
        category: 'clear',
        bgGradient: isDay
          ? 'from-sky-400/20 via-amber-200/15 to-blue-500/10'
          : 'from-slate-900/40 via-indigo-950/40 to-slate-800/30',
      };
    case 1:
      return {
        code,
        description: 'Mainly Clear',
        icon: isDay ? 'SunMedium' : 'MoonStar',
        category: 'clear',
        bgGradient: 'from-sky-400/20 via-blue-200/15 to-sky-500/10',
      };
    case 2:
      return {
        code,
        description: 'Partly Cloudy',
        icon: isDay ? 'CloudSun' : 'CloudMoon',
        category: 'cloudy',
        bgGradient: 'from-sky-500/15 via-slate-300/15 to-blue-600/10',
      };
    case 3:
      return {
        code,
        description: 'Overcast',
        icon: 'Cloud',
        category: 'cloudy',
        bgGradient: 'from-slate-500/20 via-slate-400/15 to-slate-600/15',
      };
    case 45:
    case 48:
      return {
        code,
        description: code === 48 ? 'Depositing Rime Fog' : 'Foggy',
        icon: 'CloudFog',
        category: 'fog',
        bgGradient: 'from-slate-400/20 via-zinc-400/15 to-slate-500/15',
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        description: 'Light Drizzle',
        icon: 'CloudDrizzle',
        category: 'drizzle',
        bgGradient: 'from-cyan-600/15 via-slate-500/15 to-blue-700/15',
      };
    case 56:
    case 57:
      return {
        code,
        description: 'Freezing Drizzle',
        icon: 'CloudHail',
        category: 'drizzle',
        bgGradient: 'from-blue-400/20 via-slate-400/15 to-cyan-700/15',
      };
    case 61:
      return {
        code,
        description: 'Slight Rain',
        icon: 'CloudRain',
        category: 'rain',
        bgGradient: 'from-blue-600/20 via-cyan-600/15 to-slate-700/15',
      };
    case 63:
      return {
        code,
        description: 'Moderate Rain',
        icon: 'CloudRain',
        category: 'rain',
        bgGradient: 'from-blue-700/20 via-slate-600/20 to-blue-900/15',
      };
    case 65:
      return {
        code,
        description: 'Heavy Rain',
        icon: 'CloudRainWind',
        category: 'rain',
        bgGradient: 'from-indigo-800/25 via-blue-800/20 to-slate-900/20',
      };
    case 66:
    case 67:
      return {
        code,
        description: 'Freezing Rain',
        icon: 'CloudHail',
        category: 'rain',
        bgGradient: 'from-cyan-800/20 via-blue-700/20 to-slate-800/20',
      };
    case 71:
      return {
        code,
        description: 'Slight Snowfall',
        icon: 'Snowflake',
        category: 'snow',
        bgGradient: 'from-slate-200/25 via-sky-200/20 to-blue-300/15',
      };
    case 73:
      return {
        code,
        description: 'Moderate Snowfall',
        icon: 'Snowflake',
        category: 'snow',
        bgGradient: 'from-slate-300/25 via-cyan-200/20 to-slate-400/20',
      };
    case 75:
      return {
        code,
        description: 'Heavy Snowfall',
        icon: 'CloudSnow',
        category: 'snow',
        bgGradient: 'from-sky-300/25 via-slate-300/25 to-blue-500/20',
      };
    case 77:
      return {
        code,
        description: 'Snow Grains',
        icon: 'Snowflake',
        category: 'snow',
        bgGradient: 'from-slate-200/20 via-sky-100/20 to-slate-300/20',
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        description: 'Rain Showers',
        icon: 'CloudRain',
        category: 'rain',
        bgGradient: 'from-blue-600/20 via-teal-600/15 to-slate-700/15',
      };
    case 85:
    case 86:
      return {
        code,
        description: 'Snow Showers',
        icon: 'CloudSnow',
        category: 'snow',
        bgGradient: 'from-slate-300/20 via-sky-300/20 to-indigo-400/15',
      };
    case 95:
      return {
        code,
        description: 'Thunderstorm',
        icon: 'CloudLightning',
        category: 'thunderstorm',
        bgGradient: 'from-purple-900/25 via-slate-800/25 to-blue-950/20',
      };
    case 96:
    case 99:
      return {
        code,
        description: 'Thunderstorm with Hail',
        icon: 'CloudLightning',
        category: 'thunderstorm',
        bgGradient: 'from-purple-950/30 via-slate-900/30 to-red-950/20',
      };
    default:
      return {
        code,
        description: 'Unknown Weather',
        icon: 'Cloud',
        category: 'cloudy',
        bgGradient: 'from-slate-500/20 via-gray-400/15 to-slate-600/15',
      };
  }
}

/** Converts temperature °C to °F or vice versa */
export function formatTemp(tempC: number, unit: UnitSystem): string {
  if (unit === 'imperial') {
    const tempF = Math.round((tempC * 9) / 5 + 32);
    return `${tempF}°F`;
  }
  return `${Math.round(tempC)}°C`;
}

/** Format raw speed (km/h) to km/h or mph */
export function formatWind(speedKmh: number, unit: UnitSystem): string {
  if (unit === 'imperial') {
    const mph = Math.round(speedKmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

/** Format precipitation (mm to in) */
export function formatPrecip(mm: number, unit: UnitSystem): string {
  if (unit === 'imperial') {
    const inches = (mm * 0.0393701).toFixed(2);
    return `${inches} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

/** Convert wind direction angle (0-360) to cardinal direction */
export function getWindCardinal(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/** Interpret US Air Quality Index */
export function getAqiDetails(usAqi?: number): { label: string; color: string; badgeBg: string } {
  if (usAqi === undefined) return { label: 'Unknown', color: 'text-slate-500', badgeBg: 'bg-slate-100 dark:bg-slate-800' };
  if (usAqi <= 50) return { label: 'Good', color: 'text-emerald-600 dark:text-emerald-400', badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200' };
  if (usAqi <= 100) return { label: 'Moderate', color: 'text-amber-600 dark:text-amber-400', badgeBg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200' };
  if (usAqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'text-orange-600 dark:text-orange-400', badgeBg: 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200' };
  if (usAqi <= 200) return { label: 'Unhealthy', color: 'text-red-600 dark:text-red-400', badgeBg: 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200' };
  if (usAqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-600 dark:text-purple-400', badgeBg: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200' };
  return { label: 'Hazardous', color: 'text-rose-700 dark:text-rose-400', badgeBg: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-300' };
}

/** Interpret UV Index level */
export function getUvDetails(uv?: number): { label: string; color: string; advice: string } {
  if (uv === undefined) return { label: 'Low', color: 'text-emerald-600', advice: 'No protection needed.' };
  if (uv <= 2) return { label: 'Low', color: 'text-emerald-600', advice: 'Low risk. Sun protection not strictly required.' };
  if (uv <= 5) return { label: 'Moderate', color: 'text-amber-600', advice: 'Wear sunglasses & SPF 30+ if outdoors for long.' };
  if (uv <= 7) return { label: 'High', color: 'text-orange-600', advice: 'Cover up, wear hat & SPF 30+ sunscreen.' };
  if (uv <= 10) return { label: 'Very High', color: 'text-red-600', advice: 'Avoid midday sun, reapply sunscreen every 2 hrs.' };
  return { label: 'Extreme', color: 'text-purple-700', advice: 'Take extra precautions. Stay in shade when possible.' };
}

/** Compute intelligent planning recommendations based on forecast */
export function generatePlanningInsight(
  tempC: number,
  precipProbMax: number,
  windKmh: number,
  uvIndexMax: number,
  weatherCode: number,
  daily: DailyForecast
): PlanningInsight {
  const alerts: string[] = [];
  const gearChecklist: string[] = [];

  // Evaluate alerts & gear
  if (precipProbMax >= 60 || weatherCode >= 50 && weatherCode < 70) {
    alerts.push(`High probability of rain (${precipProbMax}%). Carry an umbrella or rain coat.`);
    gearChecklist.push('Waterproof Rain Jacket / Umbrella');
  } else if (precipProbMax >= 30) {
    gearChecklist.push('Compact Umbrella / Light Windbreaker');
  }

  if (weatherCode >= 70 && weatherCode < 80) {
    alerts.push('Snowfall expected. Drive carefully and wear insulated winter boots.');
    gearChecklist.push('Insulated Winter Coat', 'Gloves & Beanie', 'Thermal Underwear');
  } else if (weatherCode >= 95) {
    alerts.push('Thunderstorms predicted. Limit open field and water activities.');
  }

  if (windKmh > 35) {
    alerts.push(`Strong wind gusts up to ${Math.round(windKmh)} km/h expected.`);
  }

  if (uvIndexMax >= 6) {
    gearChecklist.push('Sunglasses & Sunscreen (SPF 30+)', 'Sun Hat');
  }

  if (tempC < 5) {
    gearChecklist.push('Heavy Coat & Warm Layers');
  } else if (tempC < 15) {
    gearChecklist.push('Light Jacket or Sweater');
  } else if (tempC > 28) {
    gearChecklist.push('Breathable Cotton Clothing', 'Reusable Water Bottle');
  }

  // Activity recommendations generator helper
  const evaluateActivity = (
    category: ActivityRecommendation['category'],
    title: string,
    idealTempMin: number,
    idealTempMax: number,
    maxWind: number,
    maxRainProb: number
  ): ActivityRecommendation => {
    let score = 100;
    const reasons: string[] = [];

    // Temp penalty
    if (tempC < idealTempMin) {
      const diff = idealTempMin - tempC;
      score -= Math.min(diff * 4, 40);
      reasons.push(`Colder than optimal (${Math.round(tempC)}°C)`);
    } else if (tempC > idealTempMax) {
      const diff = tempC - idealTempMax;
      score -= Math.min(diff * 4, 40);
      reasons.push(`Warm/Hot conditions (${Math.round(tempC)}°C)`);
    }

    // Rain penalty
    if (precipProbMax > maxRainProb) {
      score -= Math.min((precipProbMax - maxRainProb) * 1.2, 50);
      reasons.push(`${precipProbMax}% rain chance`);
    }

    // Wind penalty
    if (windKmh > maxWind) {
      score -= Math.min((windKmh - maxWind) * 1.5, 30);
      reasons.push(`Windy (${Math.round(windKmh)} km/h)`);
    }

    // Thunderstorm penalty
    if (weatherCode >= 95) {
      score = 0;
      reasons.push('Thunderstorm risk');
    }

    score = Math.max(0, Math.min(100, Math.round(score)));

    let status: ActivityRecommendation['status'] = 'Ideal';
    if (score < 35) status = 'Not Recommended';
    else if (score < 65) status = 'Caution';
    else if (score < 85) status = 'Good';

    let clothingTip = '';
    if (category === 'running' || category === 'cycling') {
      clothingTip = tempC > 22 ? 'Moisture-wicking shorts & tee' : tempC < 10 ? 'Thermal tights & windproof top' : 'Standard activewear';
    } else if (category === 'hiking' || category === 'sightseeing') {
      clothingTip = precipProbMax > 40 ? 'Sturdy waterproof shoes & rain layer' : 'Comfortable walking sneakers & sunglasses';
    } else {
      clothingTip = tempC < 18 ? 'Bring a cardigan or light outer jacket' : 'Casual summer attire';
    }

    return {
      category,
      title,
      score,
      status,
      reason: reasons.length ? reasons.join(', ') : 'Optimal weather conditions',
      clothingTip,
    };
  };

  const activityRecommendations: ActivityRecommendation[] = [
    evaluateActivity('running', 'Outdoor Running & Jogging', 10, 22, 25, 30),
    evaluateActivity('cycling', 'Cycling & Biking', 12, 25, 22, 25),
    evaluateActivity('hiking', 'Hiking & Nature Walks', 12, 24, 30, 35),
    evaluateActivity('sightseeing', 'City Walking & Sightseeing', 14, 26, 35, 40),
    evaluateActivity('outdoor_dining', 'Patio & Outdoor Dining', 18, 28, 20, 20),
  ];

  // Calculate best time window from hourly if possible or daytime heuristic
  let bestTimeWindow = '10:00 AM – 2:00 PM';
  if (precipProbMax > 50) {
    bestTimeWindow = 'Morning hours (7:00 AM – 10:00 AM) prior to rain showers';
  } else if (tempC > 30) {
    bestTimeWindow = 'Early Morning (6:30 AM – 9:00 AM) or Evening (6:00 PM – 8:30 PM)';
  } else if (tempC < 8) {
    bestTimeWindow = 'Midday (12:00 PM – 3:00 PM) when sun temperature peaks';
  }

  // Overall suitability
  let overallSuitability: PlanningInsight['overallSuitability'] = 'Favorable';
  if (weatherCode >= 95 || windKmh > 50) overallSuitability = 'Hazardous';
  else if (precipProbMax >= 70 || tempC < -5 || tempC > 38) overallSuitability = 'Challenging';
  else if (precipProbMax >= 40 || tempC < 5 || tempC > 32) overallSuitability = 'Moderate';
  else if (precipProbMax < 20 && tempC >= 15 && tempC <= 26) overallSuitability = 'Excellent';

  const summaryText =
    overallSuitability === 'Excellent'
      ? 'Perfect outdoor weather! Pleasant temperatures with low rain probability.'
      : overallSuitability === 'Favorable'
      ? 'Great conditions overall for outdoor plans and travel.'
      : overallSuitability === 'Moderate'
      ? 'Fair weather. Keep an eye on cloud coverage and minor temperature shifts.'
      : overallSuitability === 'Challenging'
      ? 'Unfavorable weather. Consider indoor alternatives or equip appropriate weather gear.'
      : 'Hazardous weather detected. Stay safe and avoid non-essential outdoor travel.';

  return {
    overallSuitability,
    summaryText,
    bestTimeWindow,
    gearChecklist: Array.from(new Set(gearChecklist)),
    weatherAlerts: alerts,
    activityRecommendations,
  };
}
