import type { Manager, Team, Player, Match } from '@/types';

const STORAGE_KEYS = {
  MANAGER: 'team-manager-auth',
  TEAM: 'team-manager-team',
  PLAYERS: 'team-manager-players',
  MATCHES: 'team-manager-matches',
} as const;

// Manager functions
export function saveManager(manager: Manager): void {
  localStorage.setItem(STORAGE_KEYS.MANAGER, JSON.stringify(manager));
}

export function getManager(): Manager | null {
  const data = localStorage.getItem(STORAGE_KEYS.MANAGER);
  return data ? JSON.parse(data) : null;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.MANAGER);
}

// Team functions
export function saveTeam(team: Team): void {
  localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
}

export function getTeam(): Team | null {
  const data = localStorage.getItem(STORAGE_KEYS.TEAM);
  return data ? JSON.parse(data) : null;
}

// Players functions
export function savePlayers(players: Player[]): void {
  localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
}

export function getPlayers(): Player[] {
  const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
  return data ? JSON.parse(data) : [];
}

export function addPlayer(player: Player): void {
  const players = getPlayers();
  players.push(player);
  savePlayers(players);
}

export function updatePlayer(id: string, updates: Partial<Player>): void {
  const players = getPlayers();
  const index = players.findIndex(p => p.id === id);
  if (index !== -1) {
    players[index] = { ...players[index], ...updates };
    savePlayers(players);
  }
}

export function deletePlayer(id: string): void {
  const players = getPlayers().filter(p => p.id !== id);
  savePlayers(players);
}

// Matches functions
export function saveMatches(matches: Match[]): void {
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
}

export function getMatches(): Match[] {
  const data = localStorage.getItem(STORAGE_KEYS.MATCHES);
  return data ? JSON.parse(data) : [];
}

export function addMatch(match: Match): void {
  const matches = getMatches();
  matches.push(match);
  saveMatches(matches);
}

export function updateMatch(id: string, updates: Partial<Match>): void {
  const matches = getMatches();
  const index = matches.findIndex(m => m.id === id);
  if (index !== -1) {
    matches[index] = { ...matches[index], ...updates };
    saveMatches(matches);
  }
}

export function deleteMatch(id: string): void {
  const matches = getMatches().filter(m => m.id !== id);
  saveMatches(matches);
  recalculateAllPlayerStats();
}

// Recalculate player stats from all matches
export function recalculateAllPlayerStats(): void {
  const players = getPlayers();
  const matches = getMatches();

  // Reset all player stats
  const updatedPlayers = players.map(player => ({
    ...player,
    stats: {
      goals: 0,
      assists: 0,
      secondAssists: 0,
      yellowCards: 0,
      redCards: 0,
      matchesPlayed: 0,
      minutesPlayed: 0,
    },
  }));

  // Recalculate from all matches
  matches.forEach(match => {
    if (match.playerStats) {
      Object.entries(match.playerStats).forEach(([playerId, stats]) => {
        const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
        if (playerIndex !== -1) {
          const playerStats = updatedPlayers[playerIndex].stats;
          playerStats.goals += stats.goals || 0;
          playerStats.assists += stats.assists || 0;
          playerStats.secondAssists += stats.secondAssists || 0;
          playerStats.yellowCards += stats.yellowCards || 0;
          playerStats.redCards += stats.redCards || 0;
          playerStats.matchesPlayed += 1;
          playerStats.minutesPlayed += stats.minutesPlayed || 0;
        }
      });
    }
  });

  savePlayers(updatedPlayers);
}

// Initialize default data
export function initializeDefaultData(): void {
  // Create default manager if none exists
  if (!getManager()) {
    const defaultManager: Manager = {
      id: 'default-manager',
      name: 'Manager',
      email: 'manager@example.com',
      password: 'password123',
    };
    saveManager(defaultManager);
  }

  // Create default team if none exists
  if (!getTeam()) {
    const defaultTeam: Team = {
      id: 'default-team',
      name: 'My Team',
      formation: '4-4-2',
      foundedDate: new Date().toISOString(),
      abbreviation: 'TM',
      theme: 'dark',
      colors: {
        primary: '#22c55e',
        secondary: '#ffffff',
      },
    };
    saveTeam(defaultTeam);
  }
}
