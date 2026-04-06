export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  nationality: string;
  height: number; // cm
  weight: number; // kg
  positions: string[];
  jerseyNumber?: string;
  stats: PlayerStats;
  photoUrl?: string;
}

export interface PlayerStats {
  goals: number;
  assists: number;
  secondAssists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  matchesPlayed: number;
}

export interface Team {
  id: string;
  name: string;
  formation: string;
  foundedDate: string;
  logoUrl?: string;
    abbreviation?: string;
  colors: {
    primary: string;
    secondary: string;
  };
  theme?: 'light' | 'dark';
}

export interface Match {
  id: string;
  opponent: string;
  date: string;
  location: string;
  type: 'home' | 'away' | 'neutral';
  status: 'scheduled' | 'completed' | 'cancelled';
  score?: {
    team: number;
    opponent: number;
  };
  formation?: string;
  playerRatings?: { [playerId: string]: number };
  playerStats?: { [playerId: string]: MatchPlayerStats };
}

export interface MatchPlayerStats {
  goals: number;
  assists: number;
  secondAssists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  rating?: number;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  password: string;
}
