import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PlayerDialog from '@/components/features/PlayerDialog';
import { getPlayers, deletePlayer } from '@/lib/storage';
import { Plus, Search, Trash2, Edit, User } from 'lucide-react';
import { toast } from 'sonner';
import { getCountryFlag, calculatePlayerRating, getRatingColor, getRatingBgColor } from '@/lib/utils';
import type { Player } from '@/types';

export default function PlayersPage() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const loadPlayers = () => {
    setPlayers(getPlayers());
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  // Helper to get primary position category and priority (Forwards first)
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

  const filteredPlayers = players
    .filter(player =>
      `${player.firstName} ${player.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.positions.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      const catA = getPositionCategory(a.positions);
      const catB = getPositionCategory(b.positions);
      if (catA.priority !== catB.priority) return catA.priority - catB.priority;
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    });

  // Group players by category for display
  const groupedPlayers = filteredPlayers.reduce((acc, player) => {
    const { category } = getPositionCategory(player.positions);
    if (!acc[category]) acc[category] = [];
    acc[category].push(player);
    return acc;
  }, {} as { [category: string]: Player[] });

  // Compact view + sorting state
  const [compactView, setCompactView] = useState(false);
  const [sortBy, setSortBy] = useState<string>('goals');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const getStatValue = (p: Player, key: string) => {
    // Return either a number or a string depending on the key
    switch (key) {
      case 'goals': return p.stats.goals || 0;
      case 'goalsPerGame': return p.stats.matchesPlayed > 0 ? (p.stats.goals || 0) / (p.stats.matchesPlayed || 1) : 0;
      case 'assists': return p.stats.assists || 0;
      case 'secondAssists': return (p.stats as any).secondAssists || 0;
      case 'minutesPlayed': return p.stats.minutesPlayed || 0;
      case 'matchesPlayed': return p.stats.matchesPlayed || 0;
      case 'yellowCards': return p.stats.yellowCards || 0;
      case 'redCards': return p.stats.redCards || 0;
      case 'nationality': return p.nationality || '';
      case 'weight': return p.weight || 0;
      case 'height': return p.height || 0;
      case 'position': return getPositionCategory(p.positions).priority || 0;
      case 'number': return p.jerseyNumber ? parseInt(p.jerseyNumber as string, 10) || 0 : 0;
      case 'age': return p.age || 0;
      case 'lastName': return p.lastName || '';
      default: return 0;
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      // default direction: strings ascending, numbers descending
      const stringCols = new Set(['nationality', 'position', 'lastName']);
      setSortBy(column);
      setSortDir(stringCols.has(column) ? 'asc' : 'desc');
    }
  };

  const displayedPlayers = useMemo(() => {
    const list = filteredPlayers.slice();
    if (compactView) {
      list.sort((a, b) => {
        // If sorting by number, prioritize players with jersey numbers first
        if (sortBy === 'number') {
          const aHasNumber = a.jerseyNumber && a.jerseyNumber !== '-';
          const bHasNumber = b.jerseyNumber && b.jerseyNumber !== '-';
          if (aHasNumber !== bHasNumber) {
            return aHasNumber ? -1 : 1; // Players with numbers first
          }
        }

        const aVal = getStatValue(a, sortBy);
        const bVal = getStatValue(b, sortBy);

        const aIsNum = typeof aVal === 'number';
        const bIsNum = typeof bVal === 'number';

        if (aIsNum && bIsNum) {
          if (aVal === bVal) return a.lastName.localeCompare(b.lastName);
          return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
        }

        const aStr = String(aVal || '');
        const bStr = String(bVal || '');
        if (aStr === bStr) return a.lastName.localeCompare(b.lastName);
        return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }
    return list;
  }, [filteredPlayers, compactView, sortBy, sortDir]);

  const handleAddPlayer = () => {
    setSelectedPlayer(null);
    setDialogOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setDialogOpen(true);
  };

  const handleDeletePlayer = (player: Player) => {
    if (confirm(`Are you sure you want to remove ${player.firstName} ${player.lastName} from the squad?`)) {
      deletePlayer(player.id);
      toast.success('Player deleted successfully');
      loadPlayers();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Squad</h1>
            <p className="text-gray-500 mt-1 dark:text-gray-400">{players.length} players in total</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setCompactView(v => !v)}>
              {compactView ? 'Detailed View' : 'Compact View'}
            </Button>
            <Button onClick={handleAddPlayer}>
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search players by name or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Players List (grouped by position) */}
        {compactView ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort('lastName')}>Player {sortBy === 'lastName' ? (sortDir === 'desc' ? '▼' : '▲') : ''}</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort('position')}>Position {sortBy === 'position' ? (sortDir === 'desc' ? '▼' : '▲') : ''}</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort('number')}>No. {sortBy === 'number' ? (sortDir === 'desc' ? '▼' : '▲') : ''}</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort('goals')}>Goals {sortBy === 'goals' ? (sortDir === 'desc' ? '▼' : '▲') : ''}</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort('goalsPerGame')}>Goals/Game {sortBy === 'goalsPerGame' ? (sortDir === 'desc' ? '▼' : '▲') : ''}</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort('assists')}>Assists {sortBy === 'assists' ? (sortDir === 'desc' ? '▼' : '▲') : ''}</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort('secondAssists')}>2nd Assists {sortBy === 'secondAssists' ? (sortDir === 'desc' ? '▼' : '▲') : ''}</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort('yellowCards')}>Yellow {sortBy === 'yellowCards' ? (sortDir === 'desc' ? '▼' : '▲') : ''}</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort('redCards')}>Red {sortBy === 'redCards' ? (sortDir === 'desc' ? '▼' : '▲') : ''}</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort('matchesPlayed')}>Matches {sortBy === 'matchesPlayed' ? (sortDir === 'desc' ? '▼' : '▲') : ''}</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort('minutesPlayed')}>Minutes {sortBy === 'minutesPlayed' ? (sortDir === 'desc' ? '▼' : '▲') : ''}</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort('height')}>Height {sortBy === 'height' ? (sortDir === 'desc' ? '▼' : '▲') : ''}</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort('weight')}>Weight {sortBy === 'weight' ? (sortDir === 'desc' ? '▼' : '▲') : ''}</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort('age')}>Age {sortBy === 'age' ? (sortDir === 'desc' ? '▼' : '▲') : ''}</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort('nationality')}>Nationality {sortBy === 'nationality' ? (sortDir === 'desc' ? '▼' : '▲') : ''}</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {displayedPlayers.map(player => (
                  <tr key={player.id} className="hover:bg-accent">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" onClick={() => handleEditPlayer(player)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeletePlayer(player)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                          {player.photoUrl ? (
                            <img src={player.photoUrl} alt={`${player.firstName} ${player.lastName}`} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div onClick={() => navigate(`/player/${player.id}`)} className="cursor-pointer hover:text-primary">
                          <div className="font-medium hover:underline">{player.firstName} {player.lastName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{player.positions.join(', ')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getPositionCategory(player.positions).position}</td>
                    <td className="px-4 py-3">{player.jerseyNumber ? player.jerseyNumber : '--'}</td>
                    <td className="px-4 py-3 text-center">{player.stats.goals}</td>
                    <td className="px-4 py-3 text-center">{player.stats.matchesPlayed > 0 ? ((player.stats.goals || 0) / (player.stats.matchesPlayed || 1)).toFixed(2) : '-'}</td>
                    <td className="px-4 py-3 text-center">{player.stats.assists}</td>
                    <td className="px-4 py-3 text-center">{(player.stats as any).secondAssists || 0}</td>
                    <td className="px-4 py-3 text-center">{player.stats.yellowCards}</td>
                    <td className="px-4 py-3 text-center">{player.stats.redCards}</td>
                    <td className="px-4 py-3 text-center">{player.stats.matchesPlayed}</td>
                    <td className="px-4 py-3 text-center">{player.stats.minutesPlayed}</td>
                    <td className="px-4 py-3 text-center">{player.height}cm</td>
                    <td className="px-4 py-3 text-center">{player.weight}kg</td>
                    <td className="px-4 py-3 text-center">{player.age}</td>
                    <td className="px-4 py-3 text-center">{player.nationality}</td>
                    <td className="px-4 py-3 text-center">
                      <div className={`px-2 py-1 rounded inline-block font-bold text-sm ${getRatingBgColor(calculatePlayerRating(player.stats))} ${getRatingColor(calculatePlayerRating(player.stats))}`}>
                        {calculatePlayerRating(player.stats).toFixed(1)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-6">
            {['Forward', 'Midfielder', 'Defender', 'Goalkeeper'].map(category => {
              const categoryPlayers = groupedPlayers[category] || [];
              if (categoryPlayers.length === 0) return null;

              return (
                <div key={category}>
                  <h2 className="text-lg font-semibold mb-2">{category}s</h2>
                  <div className="flex flex-col gap-4">
                    {categoryPlayers.map((player) => {
                      const rating = calculatePlayerRating(player.stats);
                      return (
                      <Card key={player.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                                {player.photoUrl ? (
                                  <img src={player.photoUrl} alt={`${player.firstName} ${player.lastName}`} className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-6 h-6 text-primary" />
                                )}
                              </div>
                              <div onClick={() => navigate(`/player/${player.id}`)} className="cursor-pointer hover:text-primary">
                                <h3 className="font-semibold text-lg flex items-center gap-2 hover:underline">
                                  <span className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{player.jerseyNumber ? `#${player.jerseyNumber}` : '-'}</span>

                                    <span>{player.firstName} {player.lastName}</span>
                                  </span>
                                  <img
                                    src={getCountryFlag(player.nationality)}
                                    alt={player.nationality}
                                    className="w-6 h-4 object-cover  shadow-sm border border-gray-200"
                                  />
                                </h3>
                                <p className="text-sm text-gray-500">{player.age} years • {player.nationality}</p>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEditPlayer(player)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDeletePlayer(player)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-1">
                              {player.positions.map((position) => (
                                <span
                                  key={position}
                                  className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded"
                                >
                                  {position}
                                </span>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                             
                              <div>
                                <p className="text-gray-500">Height/Weight</p>
                                <p className="font-medium">{player.height}cm / {player.weight}kg</p>
                              </div>
                            </div>

                            <div className="pt-3 border-t">
                              <p className="text-xs text-gray-500 mb-2">Season Stats & Rating</p>
                              <div className="grid grid-cols-5 gap-2 text-center">
                                <div>
                                  <p className="text-lg font-bold text-primary">{player.stats.goals}</p>
                                  <p className="text-xs text-gray-500">Goals</p>
                                </div>
                                <div>
                                  <p className="text-lg font-bold text-primary">{player.stats.assists}</p>
                                  <p className="text-xs text-gray-500">Assists</p>
                                </div>
                                <div>
                                  <p className="text-lg font-bold text-yellow-500">{player.stats.yellowCards}</p>
                                  <p className="text-xs text-gray-500">Yellow</p>
                                </div>
                                <div>
                                  <p className="text-lg font-bold text-red-500">{player.stats.redCards}</p>
                                  <p className="text-xs text-gray-500">Red</p>
                                </div>
                                <div>
                                  <p className={`text-lg font-bold ${getRatingColor(rating)}`}>{rating.toFixed(1)}</p>
                                  <p className="text-xs text-gray-500">Rating</p>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-2 text-center">
                                {player.stats.matchesPlayed} matches • {player.stats.minutesPlayed} minutes
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No players found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first player'}
            </p>
            {!searchQuery && (
              <Button onClick={handleAddPlayer}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Player
              </Button>
            )}
          </div>
        )}
      </div>

      <PlayerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        player={selectedPlayer}
        onSuccess={loadPlayers}
      />
    </DashboardLayout>
  );
}
