# 🌤️ Weather Intelligence App

A Weather Intelligence application built using **Google AI Studio App Build**, connected directly to **GitHub**, and deployed live on **Cloudflare Pages**.

---

## 📋 Overview

This project outlines the end-to-end process of creating a React/Vite-based weather dashboard via Google AI Studio, maintaining code in GitHub, and hosting it with continuous delivery using Cloudflare Pages.

### ✨ Features
* Real-time weather and forecast via Open-Meteo API.
* Interactive charts, city search, and smart recommendations.
* Continuous deployment via Cloudflare Pages.
* Robust error handling for invalid locations and missing parameters.

---

## 🛠️ Project Structure

```text
├── src/
│   ├── components/      # Reusable UI components (Charts, Cards, Search)
│   ├── App.tsx          # Main application logic
│   └── main.tsx         # App entry point
├── public/              # Static assets and Cloudflare configuration
├── package.json         # Scripts and project dependencies
├── vite.config.ts       # Vite configuration
└── README.md            # Setup and deployment documentation

Deployment Pipeline Instructions
Step 1: Build in Google AI Studio
Open Google AI Studio App Build.
Select or prompt the Weather Intelligence App prompt.
Validate feature implementation inside the preview window (city search, weather data display, forecast charts).

Step 2: Push to GitHub
In Google AI Studio, select the Direct GitHub Connection option.
Link your approved GitHub account and select/create your repository.
Verify the generated code (src/, package.json, vite.config.ts) is pushed to the target branch.

Step 3: Configure Cloudflare PagesLog in to Cloudflare and navigate to Workers & Pages.
Click Create Application > Pages > Connect to Git.
Authorize and select your weather app repository.
Set up the build configuration:
  Framework Preset: Vite (or None)
  Build Command: npm run build
  Build Output Directory: dist
Click Save and Deploy
