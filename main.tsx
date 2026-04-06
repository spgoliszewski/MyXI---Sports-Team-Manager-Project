import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { populateRealisticData } from './lib/seedData';
import { getTeam } from './lib/storage';

const LIVERPOOL_DATA_MIGRATION_KEY = 'team-manager-sample-fc-loaded';

function applySavedTheme(): void {
  if (typeof window === 'undefined') return;

  const team = getTeam();
  if (!team) return;

  const toHsl = (hex: string): [number, number, number] | null => {
    const normalized = hex.replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;

    const r = parseInt(normalized.slice(0, 2), 16) / 255;
    const g = parseInt(normalized.slice(2, 4), 16) / 255;
    const b = parseInt(normalized.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  const primaryHsl = team.colors?.primary ? toHsl(team.colors.primary) : null;
  if (primaryHsl) {
    const [h, s, l] = primaryHsl;
    document.documentElement.style.setProperty('--primary', `${h} ${s}% ${l}%`);
    document.documentElement.style.setProperty('--primary-foreground', l > 60 ? '0 0% 9%' : '0 0% 98%');
  }

  if (team.theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Apply the Sample FC dataset once on startup.
if (typeof window !== 'undefined') {
  // Always load sample data for now to ensure new data is loaded
  populateRealisticData();

  applySavedTheme();
}

// Expose populate function to window for easy access in console
(window as any).populateRealisticData = populateRealisticData;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
