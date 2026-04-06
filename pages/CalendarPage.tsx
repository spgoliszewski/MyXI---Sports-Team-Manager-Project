import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MatchDialog from '@/components/features/MatchDialog';
import MatchResultDialog from '@/components/features/MatchResultDialog';
import { getMatches, deleteMatch, updateMatch } from '@/lib/storage';
import { Plus, Edit, Trash2, Calendar as CalendarIcon, MapPin, Trophy } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { Match } from '@/types';

export default function CalendarPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [resultFilter, setResultFilter] = useState<'all' | 'win' | 'draw' | 'loss'>('all');

  const loadMatches = () => {
    setMatches(getMatches().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    if (filter !== 'completed') return match.status === filter;
    
    // For completed filter, apply result filter too
    if (match.status !== 'completed') return false;
    if (resultFilter === 'all') return true;
    
    if (!match.score) return false;
    if (resultFilter === 'win') return match.score.team > match.score.opponent;
    if (resultFilter === 'draw') return match.score.team === match.score.opponent;
    if (resultFilter === 'loss') return match.score.team < match.score.opponent;
    
    return true;
  });

  const handleAddMatch = () => {
    setSelectedMatch(null);
    setDialogOpen(true);
  };

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
    setDialogOpen(true);
  };

  const handleRecordResult = (match: Match) => {
    setSelectedMatch(match);
    setResultDialogOpen(true);
  };

  const handleCancelMatch = (match: Match) => {
    if (confirm(`Are you sure you want to cancel the match against ${match.opponent}?`)) {
      updateMatch(match.id, { status: 'cancelled' });
      toast.success('Match cancelled');
      loadMatches();
    }
  };

  const handleDeleteMatch = (match: Match) => {
    if (confirm(`Are you sure you want to delete the match against ${match.opponent}?`)) {
      deleteMatch(match.id);
      toast.success('Match deleted successfully');
      loadMatches();
    }
  };

  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Match['type']) => {
    switch (type) {
      case 'home': return 'bg-primary/10 text-primary';
      case 'away': return 'bg-orange-100 text-orange-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Match Calendar</h1>
            <p className="text-gray-500 mt-1">{matches.length} matches in total</p>
          </div>
          <Button onClick={handleAddMatch}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Match
          </Button>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex space-x-2">
            {(['all', 'scheduled', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setResultFilter('all'); // Reset result filter when changing main filter
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  filter === status
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-accent'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Result Filter for Completed Matches */}
          {filter === 'completed' && (
            <div className="flex space-x-2 pl-4 border-l-2 border-gray-300">
              {(['all', 'win', 'draw', 'loss'] as const).map((result) => (
                <button
                  key={result}
                  onClick={() => setResultFilter(result)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors capitalize ${
                    resultFilter === result
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-accent'
                  }`}
                >
                  {result}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Matches List */}
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <Card key={match.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold">vs {match.opponent}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(match.status)} capitalize`}>
                        {match.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(match.type)} capitalize`}>
                        {match.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatDate(match.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{match.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4" />
                        <span>Formation: {match.formation}</span>
                      </div>
                    </div>

                    {match.status === 'completed' && match.score && (
                      <div className="flex items-center space-x-4 mt-3 pt-3 border-t">
                        <div className="text-2xl font-bold">
                          {match.score.team} - {match.score.opponent}
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          match.score.team > match.score.opponent
                            ? 'bg-green-100 text-green-800'
                            : match.score.team < match.score.opponent
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {match.score.team > match.score.opponent
                            ? 'WIN'
                            : match.score.team < match.score.opponent
                            ? 'LOSS'
                            : 'DRAW'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    {match.status === 'scheduled' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleRecordResult(match)}
                          className="whitespace-nowrap"
                        >
                          Record Result
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditMatch(match)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelMatch(match)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {match.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRecordResult(match)}
                      >
                        Edit Result
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteMatch(match)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMatches.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' 
                ? 'Get started by scheduling your first match'
                : `No ${filter} matches at the moment`}
            </p>
            {filter === 'all' && (
              <Button onClick={handleAddMatch}>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Your First Match
              </Button>
            )}
          </div>
        )}
      </div>

      <MatchDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        match={selectedMatch}
        onSuccess={loadMatches}
      />

      {selectedMatch && (
        <MatchResultDialog
          open={resultDialogOpen}
          onOpenChange={setResultDialogOpen}
          match={selectedMatch}
          onSuccess={loadMatches}
        />
      )}
    </DashboardLayout>
  );
}
