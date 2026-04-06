import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateMatch, getPlayers, updatePlayer } from '@/lib/storage';
import { toast } from 'sonner';
import type { Match, MatchPlayerStats, Player } from '@/types';

interface MatchResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: Match;
  onSuccess: () => void;
}

export default function MatchResultDialog({ open, onOpenChange, match, onSuccess }: MatchResultDialogProps) {
  const [teamScore, setTeamScore] = useState(match.score?.team?.toString() || '0');
  const [opponentScore, setOpponentScore] = useState(match.score?.opponent?.toString() || '0');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [playerStats, setPlayerStats] = useState<{ [playerId: string]: MatchPlayerStats }>({});
  const players = getPlayers();

  // Helper function to get primary position category
  const getPositionCategory = (positions: string[]): { category: string; priority: number; position: string } => {
    const positionMap: { [key: string]: { category: string; priority: number } } = {
      'Goalkeeper': { category: 'Goalkeeper', priority: 4 },
      'Defender': { category: 'Defender', priority: 3 },
      'Midfielder': { category: 'Midfielder', priority: 2 },
      'Forward': { category: 'Forward', priority: 1 },
      // Fallback for old abbreviated positions
      'GK': { category: 'Goalkeeper', priority: 4 },
      'CB': { category: 'Defender', priority: 3 },
      'LB': { category: 'Defender', priority: 3 },
      'RB': { category: 'Defender', priority: 3 },
      'LWB': { category: 'Defender', priority: 3 },
      'RWB': { category: 'Defender', priority: 3 },
      'CDM': { category: 'Midfielder', priority: 2 },
      'CM': { category: 'Midfielder', priority: 2 },
      'CAM': { category: 'Midfielder', priority: 2 },
      'LM': { category: 'Midfielder', priority: 2 },
      'RM': { category: 'Midfielder', priority: 2 },
      'LW': { category: 'Forward', priority: 1 },
      'RW': { category: 'Forward', priority: 1 },
      'ST': { category: 'Forward', priority: 1 },
      'CF': { category: 'Forward', priority: 1 },
    };

    // Find the highest priority position (forwards first, then midfielders, defenders, goalkeeper)
    let bestPosition = positions[0];
    let bestPriority = positionMap[bestPosition]?.priority || 5;

    for (const pos of positions) {
      const priority = positionMap[pos]?.priority || 5;
      if (priority < bestPriority) {
        bestPriority = priority;
        bestPosition = pos;
      }
    }

    return {
      category: positionMap[bestPosition]?.category || 'Unknown',
      priority: bestPriority,
      position: bestPosition,
    };
  };

  // Sort players by position category
  const sortedPlayers = [...players].sort((a, b) => {
    const categoryA = getPositionCategory(a.positions);
    const categoryB = getPositionCategory(b.positions);
    
    // Sort by priority (forwards first), then by name
    if (categoryA.priority !== categoryB.priority) {
      return categoryA.priority - categoryB.priority;
    }
    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
  });

  // Group players by category for display
  const groupedPlayers = sortedPlayers.reduce((acc, player) => {
    const { category } = getPositionCategory(player.positions);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(player);
    return acc;
  }, {} as { [category: string]: Player[] });

  useEffect(() => {
    if (match.playerStats) {
      setPlayerStats(match.playerStats);
      setSelectedPlayers(Object.keys(match.playerStats));
    }
  }, [match]);

  const handlePlayerToggle = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(prev => prev.filter(id => id !== playerId));
      const newStats = { ...playerStats };
      delete newStats[playerId];
      setPlayerStats(newStats);
    } else {
      setSelectedPlayers(prev => [...prev, playerId]);
      setPlayerStats(prev => ({
        ...prev,
        [playerId]: {
          goals: 0,
          assists: 0,
          secondAssists: 0,
          yellowCards: 0,
          redCards: 0,
          minutesPlayed: 0,
        },
      }));
    }
  };

  const updatePlayerStat = (playerId: string, field: keyof MatchPlayerStats, value: number) => {
    const teamGoals = parseInt(teamScore) || 0;
    
    // Validate goals - can't exceed team's total goals
    if (field === 'goals') {
      const otherPlayersGoals = Object.entries(playerStats)
        .filter(([id]) => id !== playerId)
        .reduce((sum, [, stats]) => sum + stats.goals, 0);
      
      if (value + otherPlayersGoals > teamGoals) {
        value = Math.max(0, teamGoals - otherPlayersGoals);
      }
    }
    
    // Validate assists - can't exceed team's total goals
    // Validate assists - can't exceed team's total goals
    if (field === 'assists') {
      const otherPlayersAssists = Object.entries(playerStats)
        .filter(([id]) => id !== playerId)
        .reduce((sum, [, stats]) => sum + stats.assists, 0);
      
      if (value + otherPlayersAssists > teamGoals) {
        value = Math.max(0, teamGoals - otherPlayersAssists);
      }
    }
    
    // Validate second assists - can't exceed team's total goals
    if (field === 'secondAssists') {
      const otherPlayers2ndAssists = Object.entries(playerStats)
        .filter(([id]) => id !== playerId)
        .reduce((sum, [, stats]) => sum + stats.secondAssists, 0);
      
      if (value + otherPlayers2ndAssists > teamGoals) {
        value = Math.max(0, teamGoals - otherPlayers2ndAssists);
      }
    }
    
    
    setPlayerStats(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get fresh player data to ensure accuracy
    const currentPlayers = getPlayers();

    // Check if this is an edit (match already has playerStats)
    const isEdit = match.playerStats && Object.keys(match.playerStats).length > 0;

    // Update match
    updateMatch(match.id, {
      status: 'completed',
      score: {
        team: parseInt(teamScore),
        opponent: parseInt(opponentScore),
      },
      playerStats,
    });

    // Update player stats
    if (isEdit) {
      // When editing, we need to subtract old stats and add new stats
      const oldPlayerStats = match.playerStats || {};
      
      // First, subtract old stats from players who were in the old match
      Object.keys(oldPlayerStats).forEach(playerId => {
        const player = currentPlayers.find(p => p.id === playerId);
        if (player && oldPlayerStats[playerId]) {
          const oldMatchStats = oldPlayerStats[playerId];
          updatePlayer(playerId, {
            stats: {
              goals: Math.max(0, player.stats.goals - oldMatchStats.goals),
              assists: Math.max(0, player.stats.assists - oldMatchStats.assists),
              secondAssists: Math.max(0, player.stats.secondAssists - oldMatchStats.secondAssists),
              yellowCards: Math.max(0, player.stats.yellowCards - oldMatchStats.yellowCards),
              redCards: Math.max(0, player.stats.redCards - oldMatchStats.redCards),
              minutesPlayed: Math.max(0, player.stats.minutesPlayed - oldMatchStats.minutesPlayed),
              matchesPlayed: Math.max(0, player.stats.matchesPlayed - 1),
            },
          });
        }
      });

      // Refresh player data after subtraction
      const updatedPlayers = getPlayers();

      // Then add new stats
      selectedPlayers.forEach(playerId => {
        const player = updatedPlayers.find(p => p.id === playerId);
        if (player && playerStats[playerId]) {
          const matchStats = playerStats[playerId];
          updatePlayer(playerId, {
            stats: {
              goals: player.stats.goals + matchStats.goals,
              assists: player.stats.assists + matchStats.assists,
              secondAssists: player.stats.secondAssists + matchStats.secondAssists,
              yellowCards: player.stats.yellowCards + matchStats.yellowCards,
              redCards: player.stats.redCards + matchStats.redCards,
              minutesPlayed: player.stats.minutesPlayed + matchStats.minutesPlayed,
              matchesPlayed: player.stats.matchesPlayed + 1,
            },
          });
        }
      });
    } else {
      // First time recording - just add the stats
      selectedPlayers.forEach(playerId => {
        const player = currentPlayers.find(p => p.id === playerId);
        if (player && playerStats[playerId]) {
          const matchStats = playerStats[playerId];
          updatePlayer(playerId, {
            stats: {
              goals: player.stats.goals + matchStats.goals,
              assists: player.stats.assists + matchStats.assists,
              secondAssists: player.stats.secondAssists + matchStats.secondAssists,
              yellowCards: player.stats.yellowCards + matchStats.yellowCards,
              redCards: player.stats.redCards + matchStats.redCards,
              minutesPlayed: player.stats.minutesPlayed + matchStats.minutesPlayed,
              matchesPlayed: player.stats.matchesPlayed + 1,
            },
          });
        }
      });
    }

    toast.success(isEdit ? 'Match result updated successfully' : 'Match result recorded successfully');
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[1600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Match Result</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Score */}
            <div>
              <h3 className="font-semibold mb-3">Final Score</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Your Team</Label>
                  <Input
                    type="number"
                    min="0"
                    value={teamScore}
                    onChange={(e) => setTeamScore(e.target.value)}
                    required  
                  />
                </div>
                <div className="space-y-2">
                  <Label>{match.opponent}</Label>
                  <Input
                    type="number"
                    min="0"
                    value={opponentScore}
                    onChange={(e) => setOpponentScore(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Player Selection */}
            <div>
              <h3 className="font-semibold mb-3">Select Players Who Played</h3>
              <div className="space-y-4">
                {['Forward', 'Midfielder', 'Defender', 'Goalkeeper'].map(category => {
                  const categoryPlayers = groupedPlayers[category] || [];
                  if (categoryPlayers.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">{category}s</h4>
                      <div className="space-y-2">
                        {categoryPlayers.map(player => {
                          const { position } = getPositionCategory(player.positions);
                          return (
                            <button
                              key={player.id}
                              type="button"
                              onClick={() => handlePlayerToggle(player.id)}
                              className={`w-full px-4 py-3 rounded-md border transition-colors flex items-center justify-between ${
                                selectedPlayers.includes(player.id)
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${
                                  selectedPlayers.includes(player.id)
                                    ? 'bg-white/20'
                                    : 'bg-muted text-foreground'
                                }`}>
                                  {position}
                                </span>
                                <div className="text-left">
                                  <div className="font-medium">
                                    {player.firstName} {player.lastName}
                                  </div>
                                  <div className={`text-xs ${
                                    selectedPlayers.includes(player.id) ? 'text-white/80' : 'text-muted-foreground'
                                  }`}>
                                    Age: {player.age} • {player.nationality}
                                  </div>
                                </div>
                              </div>
                              <div className={`text-xs ${
                                selectedPlayers.includes(player.id) ? 'text-white/80' : 'text-muted-foreground'
                              }`}>
                                {player.stats.goals}G / {player.stats.assists}A
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Player Stats */}
            {selectedPlayers.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Player Statistics</h3>
                <div className="space-y-4">
                  {selectedPlayers.map(playerId => {
                    const player = players.find(p => p.id === playerId);
                    if (!player) return null;
                    const stats = playerStats[playerId];

                    return (
                      <div key={playerId} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">
                          {player.firstName} {player.lastName} ({player.positions.join(', ')})
                        </h4>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Goals</Label>
                            <Input
                              type="number"
                              min="0"
                              max={parseInt(teamScore) || 0}
                              value={stats.goals}
                              onChange={(e) => updatePlayerStat(playerId, 'goals', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Assists</Label>
                            <Input
                              type="number"
                              min="0"
                              max={parseInt(teamScore) || 0}
                              value={stats.assists}
                              onChange={(e) => updatePlayerStat(playerId, 'assists', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">2nd Assists</Label>
                            <Input
                              type="number"
                              min="0"
                              value={stats.secondAssists}
                              onChange={(e) => updatePlayerStat(playerId, 'secondAssists', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Yellow</Label>
                            <Input
                              type="number"
                              min="0"
                              max="2"
                              value={stats.yellowCards}
                              onChange={(e) => updatePlayerStat(playerId, 'yellowCards', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Red</Label>
                            <Input
                              type="number"
                              min="0"
                              max="1"
                              value={stats.redCards}
                              onChange={(e) => updatePlayerStat(playerId, 'redCards', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Minutes</Label>
                            <Input
                              type="number"
                              min="0"
                              max="90"
                              value={stats.minutesPlayed}
                              onChange={(e) => updatePlayerStat(playerId, 'minutesPlayed', parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Result
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

