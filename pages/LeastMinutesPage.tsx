import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlayers } from '@/lib/storage';
import { Clock } from 'lucide-react';
import { getCountryFlag, calculatePlayerRating, getRatingColor, getRatingBgColor } from '@/lib/utils';
import type { Player } from '@/types';

export default function LeastMinutesPage() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    setPlayers(getPlayers());
  }, []);

  const leastMinutes = useMemo(() => {
    return players.sort((a, b) => {
      // First sort by matches (ascending), then by minutes
      if (a.stats.matchesPlayed !== b.stats.matchesPlayed) {
        return a.stats.matchesPlayed - b.stats.matchesPlayed;
      }
      return a.stats.minutesPlayed - b.stats.minutesPlayed;
    });
  }, [players]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Least Minutes Played</h1>
          <p className="text-gray-500 mt-1">All players ranked by lowest total minutes</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Minutes Played Ranking (Least)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Player</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Position</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Minutes</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Matches</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Avg/Match</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {leastMinutes.map((player, index) => {
                    const rating = calculatePlayerRating(player.stats);
                    return (
                    <tr key={player.id} className="border-b hover:bg-accent">
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-700">{index + 1}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 cursor-pointer hover:text-primary" onClick={() => navigate(`/player/${player.id}`)}>
                          <span className="text-sm font-medium">{player.jerseyNumber ? `#${player.jerseyNumber}` : '-'}</span>
                          <span className="font-medium hover:underline">{player.firstName} {player.lastName}</span>
                          <img
                            src={getCountryFlag(player.nationality)}
                            alt={player.nationality}
                            className="w-6 h-4 object-cover shadow-sm border"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {player.positions.join(', ')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-lg">{player.stats.minutesPlayed}'</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-gray-600">{player.stats.matchesPlayed}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-gray-600">
                          {player.stats.matchesPlayed > 0 
                            ? (player.stats.minutesPlayed / player.stats.matchesPlayed).toFixed(0)
                            : '-'
                          }'
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className={`px-2 py-1 rounded inline-block font-bold text-sm ${getRatingBgColor(rating)} ${getRatingColor(rating)}`}>
                          {rating.toFixed(1)}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {players.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">
                No players added yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
