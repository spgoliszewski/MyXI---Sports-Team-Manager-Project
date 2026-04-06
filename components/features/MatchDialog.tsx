import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { FORMATIONS } from '@/constants/positions';
import { addMatch, updateMatch } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { toast } from 'sonner';
import type { Match } from '@/types';

interface MatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match?: Match | null;
  onSuccess: () => void;
}

export default function MatchDialog({ open, onOpenChange, match, onSuccess }: MatchDialogProps) {
  const [formData, setFormData] = useState({
    opponent: '',
    date: '',
    location: '',
    type: 'home' as 'home' | 'away' | 'neutral',
    formation: '4-4-2',
  });

  useEffect(() => {
    if (match) {
      setFormData({
        opponent: match.opponent,
        date: match.date.split('T')[0],
        location: match.location,
        type: match.type,
        formation: match.formation || '4-4-2',
      });
    } else {
      setFormData({
        opponent: '',
        date: '',
        location: '',
        type: 'home',
        formation: '4-4-2',
      });
    }
  }, [match, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const matchData: Match = {
      id: match?.id || generateId(),
      opponent: formData.opponent,
      date: new Date(formData.date).toISOString(),
      location: formData.location,
      type: formData.type,
      status: match?.status || 'scheduled',
      formation: formData.formation,
      score: match?.score,
      playerStats: match?.playerStats,
    };

    if (match) {
      updateMatch(match.id, matchData);
      toast.success('Match updated successfully');
    } else {
      addMatch(matchData);
      toast.success('Match added successfully');
    }

    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[1400px]">
        <DialogHeader>
          <DialogTitle>{match ? 'Edit Match' : 'Schedule New Match'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="opponent">Opponent *</Label>
              <Input
                id="opponent"
                placeholder="e.g., FC Barcelona"
                value={formData.opponent}
                onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Camp Nou, Barcelona"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Match Type *</Label>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'home' | 'away' | 'neutral' })}
                required
              >
                <option value="home">Home</option>
                <option value="away">Away</option>
                <option value="neutral">Neutral</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="formation">Formation *</Label>
              <Select
                id="formation"
                value={formData.formation}
                onChange={(e) => setFormData({ ...formData, formation: e.target.value })}
                required
              >
                {FORMATIONS.map((formation) => (
                  <option key={formation} value={formation}>{formation}</option>
                ))}
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {match ? 'Update Match' : 'Schedule Match'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
