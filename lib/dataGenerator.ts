import type { Player, Match, MatchPlayerStats } from '@/types';

// Simple UUID generator
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Player names data
const firstNames = [
  'James', 'Marcus', 'David', 'Chris', 'Michael', 'Robert', 'Thomas', 'William', 'Benjamin', 'Alexander',
  'Daniel', 'Matthew', 'Anthony', 'Joshua', 'Samuel', 'Lucas', 'Oliver', 'Jack', 'Ethan', 'Mason',
  'Liam', 'Noah', 'Aiden', 'Logan', 'Jackson', 'Caden', 'Ryan', 'Dylan', 'Tyler', 'Caleb', 'Kevin',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
];

const nationalities = [
  'England', 'Spain', 'France', 'Germany', 'Italy', 'Portugal', 'Netherlands', 'Belgium',
  'Brazil', 'Argentina', 'Uruguay', 'Colombia', 'Mexico', 'USA', 'Canada',
];

const opponents = [
  'Manchester City', 'Liverpool', 'Chelsea', 'Arsenal', 'Tottenham', 'Manchester United',
  'Brighton', 'Aston Villa', 'Newcastle', 'Fulham', 'Brentford', 'Crystal Palace',
  'West Ham', 'Everton', 'Leicester', 'Southampton', 'Wolves', 'Nottingham Forest',
];

const locations = [
  'Home Stadium', 'Away Ground', 'Old Trafford', 'Etihad Stadium', 'Anfield',
  'Stamford Bridge', 'Emirates Stadium', 'Tottenham Hotspur Stadium',
];

function generateRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateRealisticPlayers(): Player[] {
  const players: Player[] = [];
  
  // Generate 2 GKs
  for (let i = 0; i < 2; i++) {
    players.push(generatePlayer('GK', i + 1));
  }
  
  // Generate 8 Defenders
  for (let i = 0; i < 8; i++) {
    const pos = getRandomItem(['CB', 'LB', 'RB']);
    players.push(generatePlayer(pos, i + 3));
  }
  
  // Generate 10 Midfielders
  for (let i = 0; i < 10; i++) {
    const pos = getRandomItem(['CDM', 'CM', 'CAM', 'LM', 'RM']);
    players.push(generatePlayer(pos, i + 11));
  }
  
  // Generate 8 Forwards
  for (let i = 0; i < 8; i++) {
    const pos = getRandomItem(['LW', 'RW', 'ST', 'CF']);
    players.push(generatePlayer(pos, i + 21));
  }
  
  // Generate 3 more flexible players
  for (let i = 0; i < 3; i++) {
    const pos = getRandomItem(['CM', 'CAM', 'LW', 'RW']);
    players.push(generatePlayer(pos, i + 29));
  }

  return players;
}

function generatePlayer(position: string, jerseyNumber: number): Player {
  const firstName = getRandomItem(firstNames);
  const lastName = getRandomItem(lastNames);
  const nationality = getRandomItem(nationalities);
  
  return {
    id: generateId(),
    firstName,
    lastName,
    age: generateRandomInt(19, 35),
    nationality,
    height: generateRandomInt(175, 195),
    weight: generateRandomInt(70, 95),
    positions: [position],
    jerseyNumber: String(jerseyNumber),
    stats: {
      goals: 0,
      assists: 0,
      secondAssists: 0,
      yellowCards: 0,
      redCards: 0,
      minutesPlayed: 0,
      matchesPlayed: 0,
    },
  };
}

export function generateRealistic20Matches(): Match[] {
  const matches: Match[] = [];
  const startDate = new Date('2025-11-01');
  
  let currentDate = new Date(startDate);
  
  for (let i = 0; i < 20; i++) {
    const opponent = getRandomItem(opponents);
    const matchType = getRandomItem(['home', 'away', 'neutral']) as 'home' | 'away' | 'neutral';
    
    const teamGoals = generateRandomInt(0, 4);
    const opponentGoals = generateRandomInt(0, 4);
    const score = {
      team: teamGoals,
      opponent: opponentGoals,
    };
    
    // Advance date by 3-4 days for next match
    currentDate = new Date(currentDate.getTime() + generateRandomInt(3, 4) * 24 * 60 * 60 * 1000);
    
    matches.push({
      id: generateId(),
      opponent,
      date: currentDate.toISOString(),
      location: getRandomItem(locations),
      type: matchType,
      status: 'completed',
      score,
      formation: '4-4-2',
      playerStats: {}, // Will be filled in addRealisticStatsToMatches
    });
  }
  
  return matches;
}

export function addRealisticStatsToMatches(
  players: Player[],
  matches: Match[]
): Match[] {
  const updatedMatches = matches.map((match) => {
    const playerStats: { [playerId: string]: MatchPlayerStats } = {};
    let goalsToDistribute = match.score!.team;
    let assistsToDistribute = Math.max(0, goalsToDistribute - 1);

    // Select 11-14 random players who played in this match
    const numPlayers = generateRandomInt(11, Math.min(14, players.length));
    const playersInMatch = players.slice(0, numPlayers);
    
    // Get attacking players for goal distribution
    const attackingPlayers = playersInMatch.filter((p) => 
      ['ST', 'CF', 'LW', 'RW', 'CAM'].includes(p.positions[0])
    );
    
    // Distribute goals to attacking players
    const goalsToAssign = Math.min(goalsToDistribute, attackingPlayers.length);
    for (let i = 0; i < goalsToAssign; i++) {
      const playerIndex = i % attackingPlayers.length;
      const goalPlayer = attackingPlayers[playerIndex];
      
      if (!playerStats[goalPlayer.id]) {
        playerStats[goalPlayer.id] = {
          goals: 0,
          assists: 0,
          secondAssists: 0,
          yellowCards: 0,
          redCards: 0,
          minutesPlayed: generateRandomInt(85, 90),
          rating: generateRandomInt(70, 85) / 10,
        };
      }
      playerStats[goalPlayer.id].goals += 1;
    }
    
    // Process all players
    playersInMatch.forEach((player, playerIndex) => {
      if (!playerStats[player.id]) {
        const minutesPlayed = playerIndex < 11 ? generateRandomInt(85, 90) : generateRandomInt(15, 45);
        
        let yellowCards = 0;
        let redCards = 0;

        // Random cards (8% chance)
        if (Math.random() < 0.08) {
          yellowCards = 1;
          if (Math.random() < 0.1) {
            redCards = 1;
            yellowCards = 0;
          }
        }

        playerStats[player.id] = {
          goals: 0,
          assists: 0,
          secondAssists: 0,
          yellowCards,
          redCards,
          minutesPlayed,
          rating: generateRandomInt(65, 85) / 10,
        };
      }

      // Distribute assists
      if (assistsToDistribute > 0 && Math.random() < 0.5) {
        playerStats[player.id].assists += 1;
        assistsToDistribute--;
      }

      // Add random cards if not already assigned
      if (playerStats[player.id].yellowCards === 0 && playerStats[player.id].redCards === 0) {
        if (Math.random() < 0.08) {
          playerStats[player.id].yellowCards = 1;
          if (Math.random() < 0.1) {
            playerStats[player.id].redCards = 1;
            playerStats[player.id].yellowCards = 0;
          }
        }
      }
    });

    return {
      ...match,
      playerStats,
    };
  });

  return updatedMatches;
}
