import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route for AI Planning Assistant
app.post('/api/ai-plan', async (req: express.Request, res: express.Response) => {
  try {
    const { locationName, country, tripType, customQuestion, forecastSummary } = req.body;

    if (!locationName || !forecastSummary) {
      return res.status(400).json({ error: 'Missing required parameters (locationName, forecastSummary)' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key is missing. Please configure GEMINI_API_KEY in environment secrets.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are an expert travel weather planner and outdoor activity concierge.
Location: ${locationName}${country ? `, ${country}` : ''}
Focus Area: ${tripType || 'general outdoor and city activities'}
User Query / Preference: ${customQuestion || 'Provide an actionable 3-part weather-optimized recommendation plan for visiting this city over the upcoming week.'}

Weather Forecast Context (Data from Open-Meteo):
${forecastSummary}

Task:
Provide a concise, practical, and highly specific planning recommendation based strictly on the weather numbers provided above.
Return your response in standard structured JSON with the following keys:
1. "recommendation": A friendly 2-3 sentence overall summary recommendation.
2. "highlights": An array of 3-4 bullet strings (key activity ideas with optimal day/time windows).
3. "packingItems": An array of 3-5 specific clothing/gear items to pack.
4. "dayByDayPlan": An array of objects for key days, each having {"day": "Mon / Tue etc", "title": "Headline", "advice": "Practical advice"}.

Respond strictly in valid JSON format. Do not surround with markdown code blocks if possible, or use standard JSON syntax.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';
    let parsedJson;
    try {
      parsedJson = JSON.parse(responseText);
    } catch (e) {
      // Fallback text structure
      parsedJson = {
        recommendation: responseText,
        highlights: ['Check local forecasts daily', 'Prepare appropriate clothing layers'],
        packingItems: ['Umbrella', 'Comfortable walking shoes', 'Layered clothing'],
      };
    }

    return res.json(parsedJson);
  } catch (error: any) {
    console.error('Error in /api/ai-plan:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate AI plan.',
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
