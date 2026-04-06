import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlayers, getMatches } from '@/lib/storage';
import { ArrowLeft, Target, Trophy, AlertCircle, Clock } from 'lucide-react';
import { getCountryFlag, calculatePlayerRating, getRatingColor, getRatingBgColor, calculatePerGameRating } from '@/lib/utils';
import type { Player, Match } from '@/types';

export default function PlayerProfilePage() {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [playerMatches, setPlayerMatches] = useState<Array<Match & { playerStats?: any }>>([]);

  useEffect(() => {
    const players = getPlayers();
    const foundPlayer = players.find(p => p.id === playerId);
    setPlayer(foundPlayer || null);

    const allMatches = getMatches().filter(m => m.status === 'completed');
    setMatches(allMatches);

    // Find matches this player played in
    const played = allMatches.filter(m => m.playerStats && playerId && m.playerStats[playerId]);
    setPlayerMatches(played);
  }, [playerId]);

  if (!player) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Player not found</h2>
          <button
            onClick={() => navigate('/players')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Players
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const winRate = matches.length > 0 
    ? Math.round((matches.filter(m => m.score && m.score.team > m.score.opponent).length / matches.length) * 100)
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary hover:text-primary/80 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                {player.photoUrl && (
                  <img
                    src={player.photoUrl}
                    alt={player.firstName}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {player.firstName} {player.lastName}
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xl font-semibold text-primary">#{player.jerseyNumber || '-'}</span>
                    <span className="text-gray-600">{player.positions.join(', ')}</span>
                    {player.nationality && (
                      <img
                        src={getCountryFlag(player.nationality)}
                        alt={player.nationality}
                        className="w-8 h-5 object-cover rounded"
                        title={player.nationality}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Player Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Age</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{player.age}</div>
              <p className="text-xs text-gray-500 mt-1">years</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Height</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{player.height}</div>
              <p className="text-xs text-gray-500 mt-1">cm</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{player.weight}</div>
              <p className="text-xs text-gray-500 mt-1">kg</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Nationality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">{player.nationality}</div>
              <p className="text-xs text-gray-500 mt-1">Country</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{player.stats.goals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Assists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{player.stats.assists}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Minutes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{player.stats.minutesPlayed}</div>
              <p className="text-xs text-gray-500 mt-1">minutes played</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{player.stats.matchesPlayed}</div>
              <p className="text-xs text-gray-500 mt-1">matches played</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getRatingColor(calculatePlayerRating(player.stats))}`}>
                {calculatePlayerRating(player.stats).toFixed(1)}
              </div>
              <p className="text-xs text-gray-500 mt-1">season rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Discipline Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Yellow Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-8 bg-yellow-400 rounded-sm" />
                <span className="text-2xl font-bold">{player.stats.yellowCards}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Red Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-8 bg-red-500 rounded-sm" />
                <span className="text-2xl font-bold">{player.stats.redCards}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Minutes/Match</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {player.stats.matchesPlayed > 0 
                  ? Math.round(player.stats.minutesPlayed / player.stats.matchesPlayed)
                  : 0
                }'
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Goals per Match</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {player.stats.matchesPlayed > 0
                  ? (player.stats.goals / player.stats.matchesPlayed).toFixed(2)
                  : '0.00'
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Assists per Match</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {player.stats.matchesPlayed > 0
                  ? (player.stats.assists / player.stats.matchesPlayed).toFixed(2)
                  : '0.00'
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Team Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{winRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Match History */}
        {playerMatches.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Match History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {playerMatches.map((match) => {
                  const stats = playerId ? match.playerStats?.[playerId] : undefined;
                  const result = match.score
                    ? match.score.team > match.score.opponent
                      ? 'WIN'
                      : match.score.team < match.score.opponent
                      ? 'LOSS'
                      : 'DRAW'
                    : 'N/A';

                  const resultColor = result === 'WIN' ? 'bg-green-100 text-green-800' : 
                                     result === 'LOSS' ? 'bg-red-100 text-red-800' : 
                                     'bg-gray-100 text-gray-800';

                  return (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div>
                        <p className="font-medium">vs {match.opponent}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(match.date).toLocaleDateString()} • {match.location}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold">{match.score?.team} - {match.score?.opponent}</p>
                          {stats && (
                            <p className="text-xs text-gray-600">
                              {stats.goals}G • {stats.assists}A • {stats.minutesPlayed}'
                            </p>
                          )}
                        </div>
                        <div className="text-center">
                          <div className={`px-3 py-1 rounded-lg font-bold text-sm ${getRatingBgColor(parseFloat(calculatePerGameRating(stats || {})))} ${getRatingColor(parseFloat(calculatePerGameRating(stats || {})))}`}>
                            {calculatePerGameRating(stats || {})}
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${resultColor}`}>
                          {result}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
