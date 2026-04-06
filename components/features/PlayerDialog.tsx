import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { getPlayers } from '@/lib/storage';
import { POSITIONS, NATIONALITIES } from '@/constants/positions';
import { addPlayer, updatePlayer } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { toast } from 'sonner';
import type { Player } from '@/types';

interface PlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player?: Player | null;
  onSuccess: () => void;
}

export default function PlayerDialog({ open, onOpenChange, player, onSuccess }: PlayerDialogProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    photoUrl: '',
    jerseyNumber: '',
    nationality: 'Poland',
    height: '',
    weight: '',
    positions: [] as string[],
  });

  useEffect(() => {
    if (player) {
      setFormData({
        firstName: player.firstName,
        lastName: player.lastName,
        age: player.age.toString(),
        photoUrl: player.photoUrl || '',
        jerseyNumber: player.jerseyNumber && player.jerseyNumber !== '-' ? player.jerseyNumber : '',
        nationality: player.nationality,
        height: player.height.toString(),
        weight: player.weight.toString(),
        positions: player.positions,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        photoUrl: '',
        jerseyNumber: '',
        nationality: 'Poland',
        height: '',
        weight: '',
        positions: [],
      });
    }
  }, [player, open]);

  const handlePositionToggle = (position: string) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.includes(position)
        ? prev.positions.filter(p => p !== position)
        : [...prev.positions, position],
    }));
  };

  const handleJerseyConflict = (): boolean => {
    const val = formData.jerseyNumber?.toString()?.trim();
    if (!val) return true;
    const players = getPlayers();
    const conflict = players.find(p => p.jerseyNumber && p.jerseyNumber !== '-' && p.jerseyNumber === val && p.id !== player?.id);
    if (!conflict) return true;

    const used = new Set(players.map(p => (p.jerseyNumber && p.jerseyNumber !== '-') ? Number(p.jerseyNumber) : -1));
    let firstUnassigned = -1;
    for (let i = 1; i <= 99; i++) {
      if (!used.has(i)) { firstUnassigned = i; break; }
    }
    if (firstUnassigned === -1) {
      alert(`Number ${val} is already assigned to ${conflict.firstName} ${conflict.lastName}, and no unassigned numbers available to auto-move.`);
      setFormData(prev => ({ ...prev, jerseyNumber: '' }));
      return false;
    }

    const confirmMsg = `Number ${val} is already assigned to ${conflict.firstName} ${conflict.lastName}.\nDo you want to change ${conflict.firstName} ${conflict.lastName}'s number to ${firstUnassigned} so you can assign ${val} to this player?`;
    if (confirm(confirmMsg)) {
      updatePlayer(conflict.id, { jerseyNumber: String(firstUnassigned) });
      return true;
    } else {
      setFormData(prev => ({ ...prev, jerseyNumber: '' }));
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.positions.length === 0) {
      toast.error('Please select at least one position');
      return;
    }

    const playerData: Player = {
      id: player?.id || generateId(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: parseInt(formData.age),
      photoUrl: formData.photoUrl || undefined,
      jerseyNumber: formData.jerseyNumber && formData.jerseyNumber.trim() !== '' ? String(formData.jerseyNumber) : '-',
      nationality: formData.nationality,
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
      positions: formData.positions,
      stats: player?.stats || {
        goals: 0,
        assists: 0,
        secondAssists: 0,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 0,
        matchesPlayed: 0,
      },
    };

    if (player) {
      updatePlayer(player.id, playerData);
      toast.success('Player updated successfully');
    } else {
      addPlayer(playerData);
      toast.success('Player added successfully');
    }

    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{player ? 'Edit Player' : 'Add New Player'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="jersey">Jersey number</Label>
              <Input
                id="jersey"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.jerseyNumber}
                onChange={(e) => {
                  // allow only digits, max 2 characters
                  const sanitized = (e.target.value || '').replace(/\D/g, '').slice(0, 2);
                  setFormData(prev => ({ ...prev, jerseyNumber: sanitized }));
                }}
                onBlur={() => { handleJerseyConflict(); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleJerseyConflict();
                  }
                }}
                placeholder="-"
              />
            </div>
            <div className="space-y-2">
              <Label>Photo</Label>
              <div>
                <label className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted border border-dashed border-border cursor-pointer overflow-hidden hover:bg-accent transition-colors">
                  {formData.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={formData.photoUrl} alt="Player" className="w-full h-full object-cover" />
                  ) : (
                    <Plus className="w-6 h-6 text-muted-foreground" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                min="15"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality *</Label>
              <Select
                id="nationality"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                required
              >
                {NATIONALITIES.map((nat) => (
                  <option key={nat} value={nat}>{nat}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm) *</Label>
              <Input
                id="height"
                type="number"
                min="100"
                max="250"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                min="30"
                max="200"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Positions *</Label>
              <div className="grid grid-cols-5 gap-2">
                {POSITIONS.map((position) => (
                  <button
                    key={position}
                    type="button"
                    onClick={() => handlePositionToggle(position)}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                      formData.positions.includes(position)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {player ? 'Update Player' : 'Add Player'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
