import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlayers, getMatches } from '@/lib/storage';
import { Trophy, Target, Calendar, Clock } from 'lucide-react';
import { formatDate, getCountryFlag, calculatePlayerRating, calculatePerGameRating, getRatingColor, getRatingBgColor } from '@/lib/utils';
import type { Match, Player } from '@/types';

export default function DashboardPage() {
  const navigate = useNavigate();
  const players = getPlayers();
  const matches = getMatches();

  const stats = useMemo(() => {
    const topScorer = players.reduce((prev: Player | null, current) =>
      !prev || current.stats.goals > prev.stats.goals ? current : prev
      , null);

    const topAssister = players.reduce((prev: Player | null, current) =>
      !prev || current.stats.assists > prev.stats.assists ? current : prev
      , null);

    const mostCards = players.reduce((prev: Player | null, current) => {
      const prevCards = prev ? prev.stats.yellowCards + prev.stats.redCards : 0;
      const currentCards = current.stats.yellowCards + current.stats.redCards;
      return currentCards > prevCards ? current : prev;
    }, null);

    const nextMatch = matches
      .filter(m => m.status === 'scheduled' && new Date(m.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    const completedMatches = matches.filter(m => m.status === 'completed');
    const wins = completedMatches.filter(m => m.score && m.score.team > m.score.opponent).length;
    const draws = completedMatches.filter(m => m.score && m.score.team === m.score.opponent).length;
    const losses = completedMatches.filter(m => m.score && m.score.team < m.score.opponent).length;

    const highestGameRating = completedMatches.reduce<{
      match: Match;
      playerId: string;
      playerName: string;
      rating: number;
    } | null>((best, match) => {
      if (!match.playerStats) {
        return best;
      }

      Object.entries(match.playerStats).forEach(([playerId, stats]) => {
        const rating = parseFloat(calculatePerGameRating(stats));

        if (!best || rating > best.rating) {
          const player = players.find((p) => p.id === playerId);
          best = {
            match,
            playerId,
            playerName: player ? `${player.firstName} ${player.lastName}` : 'Unknown Player',
            rating,
          };
        }
      });

      return best;
    }, null);

    return {
      topScorer,
      topAssister,
      mostCards,
      nextMatch,
      totalPlayers: players.length,
      totalMatches: matches.length,
      wins,
      draws,
      losses,
      highestGameRating,
    };
  }, [players, matches]);

  const topScorer = stats.topScorer;
  const topAssister = stats.topAssister;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of your team's performance</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/players')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Players</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlayers}</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/calendar')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Matches</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMatches}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.wins}W - {stats.draws}D - {stats.losses}L
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/top-scorers')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Top Scorer</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {topScorer ? (
                <div onClick={(e) => { e.stopPropagation(); navigate(`/player/${topScorer.id}`); }} className="cursor-pointer hover:text-primary">
                  <div className="text-lg font-bold flex items-center gap-2 hover:underline">
                    <span className="text-sm font-medium">{topScorer.jerseyNumber ? `#${topScorer.jerseyNumber}` : '-'}</span>
                    <span>{topScorer.firstName} {topScorer.lastName}</span>
                  </div>
                  <p className="text-xs text-gray-500">{topScorer.stats.goals} goals</p>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No data</div>
              )}
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/top-assisters')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Top Assister</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {topAssister ? (
                <div onClick={(e) => { e.stopPropagation(); navigate(`/player/${topAssister.id}`); }} className="cursor-pointer hover:text-primary">
                  <div className="text-lg font-bold flex items-center gap-2 hover:underline">
                    <span className="text-sm font-medium">{topAssister.jerseyNumber ? `#${topAssister.jerseyNumber}` : '-'}</span>

                    <span>{topAssister.firstName} {topAssister.lastName}</span>
                  </div>
                  <p className="text-xs text-gray-500">{topAssister.stats.assists} assists</p>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No data</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Next Match */}
        {stats.nextMatch && (
          <Card>
            <CardHeader>
              <CardTitle>Next Match</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">vs {stats.nextMatch.opponent}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(stats.nextMatch.date)} • {stats.nextMatch.location}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 capitalize">
                    {stats.nextMatch.type} match
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Upcoming
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Highest Match Rating</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.highestGameRating ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">{stats.highestGameRating.playerName}</p>
                  <p className="text-sm text-gray-500">
                    vs {stats.highestGameRating.match.opponent} • {formatDate(stats.highestGameRating.match.date)}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg text-xl font-bold ${getRatingBgColor(stats.highestGameRating.rating)} ${getRatingColor(stats.highestGameRating.rating)}`}>
                  {stats.highestGameRating.rating.toFixed(1)}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No completed match ratings available yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {players
                  .slice()
                  .sort((a, b) => {
                    const ratingA = calculatePlayerRating(a.stats);
                    const ratingB = calculatePlayerRating(b.stats);
                    if (ratingB !== ratingA) {
                      return ratingB - ratingA;
                    }
                    return (b.stats.goals + b.stats.assists) - (a.stats.goals + a.stats.assists);
                  })
                  .slice(0, 5)
                  .map((player) => {
                    const rating = calculatePlayerRating(player.stats);
                    return (
                    <div key={player.id} className="flex items-center justify-between cursor-pointer hover:bg-accent p-2 rounded transition-colors" onClick={() => navigate(`/player/${player.id}`)}>
                      <div>
                        <p className="font-medium flex items-center gap-2 hover:text-primary">
                          <span className="text-sm font-medium">{player.jerseyNumber ? `#${player.jerseyNumber}` : '-'}</span>
                          <span>{player.firstName} {player.lastName}</span>
                          <img
                            src={getCountryFlag(player.nationality)}
                            alt={player.nationality}
                            className="w-6 h-4 object-cover shadow-sm border"
                          />
                        </p>
                        <p className="text-xs text-gray-500">
                          {player.positions.join(', ')}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="font-semibold">{player.stats.goals}G / {player.stats.assists}A</p>
                          <p className="text-xs text-gray-500">{player.stats.matchesPlayed} matches</p>
                        </div>
                        <div className={`px-3 py-1 rounded-lg font-bold text-sm ${getRatingBgColor(rating)} ${getRatingColor(rating)}`}>
                          {rating.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                {players.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No players added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Discipline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {players
                  .filter(p => p.stats.yellowCards > 0 || p.stats.redCards > 0)
                  .sort((a, b) =>
                    (b.stats.yellowCards + b.stats.redCards * 2) -
                    (a.stats.yellowCards + a.stats.redCards * 2)
                  )
                  .slice(0, 5)
                  .map((player) => {
                    const rating = calculatePlayerRating(player.stats);
                    return (
                    <div key={player.id} className="flex items-center justify-between cursor-pointer hover:bg-accent p-2 rounded transition-colors" onClick={() => navigate(`/player/${player.id}`)}>
                      <div>
                        <p className="font-medium flex items-center gap-2 hover:text-primary hover:underline">
                          <span className="text-sm inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100">#</span>
                          <span className="text-sm font-medium">{player.jerseyNumber || '-'}</span>
                          <span>{player.firstName} {player.lastName}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {player.positions.join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {player.stats.yellowCards > 0 && (
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-5 bg-yellow-400 rounded-sm" />
                            <span className="text-sm font-medium">{player.stats.yellowCards}</span>
                          </div>
                        )}
                        {player.stats.redCards > 0 && (
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-5 bg-red-500 rounded-sm" />
                            <span className="text-sm font-medium">{player.stats.redCards}</span>
                          </div>
                        )}
                        <div className={`px-3 py-1 rounded-lg font-bold text-sm ${getRatingBgColor(rating)} ${getRatingColor(rating)}`}>
                          {rating.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                {players.filter(p => p.stats.yellowCards > 0 || p.stats.redCards > 0).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No cards recorded
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Minutes Played Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/most-minutes')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Most Minutes Played
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {players
                  .sort((a, b) => b.stats.minutesPlayed - a.stats.minutesPlayed)
                  .slice(0, 5)
                  .map((player) => {
                    const rating = calculatePlayerRating(player.stats);
                    return (
                    <div key={player.id} className="flex items-center justify-between cursor-pointer hover:bg-accent p-2 rounded transition-colors" onClick={() => navigate(`/player/${player.id}`)}>
                      <div>
                        <p className="font-medium flex items-center gap-2 hover:text-primary hover:underline">
                          <span className="text-sm font-medium">{player.jerseyNumber ? `#${player.jerseyNumber}` : '-'}</span>
                          <span>{player.firstName} {player.lastName}</span>
                          <img
                            src={getCountryFlag(player.nationality)}
                            alt={player.nationality}
                            className="w-6 h-4 object-cover shadow-sm border"
                          />
                        </p>
                        <p className="text-xs text-gray-500">
                          {player.positions.join(', ')}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="font-semibold">{player.stats.minutesPlayed}'</p>
                          <p className="text-xs text-gray-500">{player.stats.matchesPlayed} matches</p>
                        </div>
                        <div className={`px-3 py-1 rounded-lg font-bold text-sm ${getRatingBgColor(rating)} ${getRatingColor(rating)}`}>
                          {rating.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                {players.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No players added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/least-minutes')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Least Minutes Played
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {players
                  .sort((a, b) => {
                    // First sort by matches (ascending), then by minutes
                    if (a.stats.matchesPlayed !== b.stats.matchesPlayed) {
                      return a.stats.matchesPlayed - b.stats.matchesPlayed;
                    }
                    return a.stats.minutesPlayed - b.stats.minutesPlayed;
                  })
                  .slice(0, 5)
                  .map((player) => {
                    const rating = calculatePlayerRating(player.stats);
                    return (
                    <div key={player.id} className="flex items-center justify-between cursor-pointer hover:bg-accent p-2 rounded transition-colors" onClick={() => navigate(`/player/${player.id}`)}>
                      <div>
                        <p className="font-medium flex items-center gap-2 hover:text-primary hover:underline">
                          <span className="text-sm font-medium">{player.jerseyNumber ? `#${player.jerseyNumber}` : '-'}</span>
                          <span>{player.firstName} {player.lastName}</span>
                          <img
                            src={getCountryFlag(player.nationality)}
                            alt={player.nationality}
                            className="w-6 h-4 object-cover shadow-sm border"
                          />
                        </p>
                        <p className="text-xs text-gray-500">
                          {player.positions.join(', ')}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="font-semibold">{player.stats.minutesPlayed}'</p>
                          <p className="text-xs text-gray-500">{player.stats.matchesPlayed} matches</p>
                        </div>
                        <div className={`px-3 py-1 rounded-lg font-bold text-sm ${getRatingBgColor(rating)} ${getRatingColor(rating)}`}>
                          {rating.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                {players.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
