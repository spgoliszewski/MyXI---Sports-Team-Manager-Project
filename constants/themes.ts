export interface TeamThemePreset {
  id: string;
  name: string;
  description: string;
  theme: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
  };
}

export const TEAM_THEME_PRESETS: TeamThemePreset[] = [
  {
    id: 'emerald-light',
    name: 'Emerald Light',
    description: 'Clean green look',
    theme: 'light',
    colors: {
      primary: '#22c55e',
      secondary: '#ffffff',
    },
  },
  {
    id: 'royal-blue',
    name: 'Royal Blue',
    description: 'Classic blue identity',
    theme: 'light',
    colors: {
      primary: '#2563eb',
      secondary: '#eff6ff',
    },
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Energetic orange accent',
    theme: 'light',
    colors: {
      primary: '#ea580c',
      secondary: '#fff7ed',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark mode with violet accent',
    theme: 'dark',
    colors: {
      primary: '#7c3aed',
      secondary: '#0f172a',
    },
  },
];

export const DEFAULT_TEAM_THEME_ID = TEAM_THEME_PRESETS[3].id;

export function getThemePresetById(themeId: string): TeamThemePreset {
  return TEAM_THEME_PRESETS.find((preset) => preset.id === themeId) ?? TEAM_THEME_PRESETS[0];
}

export function getThemePresetIdFromTeam(team: {
  theme?: 'light' | 'dark';
  colors?: { primary?: string; secondary?: string };
}): string {
  const matchedPreset = TEAM_THEME_PRESETS.find(
    (preset) =>
      preset.theme === (team.theme ?? 'light') &&
      preset.colors.primary.toLowerCase() === (team.colors?.primary ?? '').toLowerCase() &&
      preset.colors.secondary.toLowerCase() === (team.colors?.secondary ?? '').toLowerCase()
  );

  return matchedPreset?.id ?? DEFAULT_TEAM_THEME_ID;
}
