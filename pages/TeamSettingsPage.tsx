import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FORMATIONS } from '@/constants/positions';
import { TEAM_THEME_PRESETS, getThemePresetById, getThemePresetIdFromTeam } from '@/constants/themes';
import { getTeam, saveTeam } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Save, Trash2 } from 'lucide-react';
import type { Team } from '@/types';

export default function TeamSettingsPage() {
  const [formData, setFormData] = useState({
    name: '',
    formation: '4-4-2',
    foundedDate: '',
    selectedThemeId: '',
    logoUrl: '',
    abbreviation: '',
  });

  const selectedTheme = formData.selectedThemeId
    ? getThemePresetById(formData.selectedThemeId)
    : null;

  useEffect(() => {
    const team = getTeam();
    if (team) {
      setFormData({
        name: team.name,
        formation: team.formation,
        foundedDate: team.foundedDate.split('T')[0],
        selectedThemeId: getThemePresetIdFromTeam(team),
        logoUrl: team.logoUrl || '',
        abbreviation: team.abbreviation || '',
      });
    }
  }, []);

  const getContrastTextColor = (hexColor: string) => {
    const hex = hexColor.replace('#', '');
    if (hex.length !== 6) return '#111827';

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    return luminance > 0.6 ? '#111827' : '#f8fafc';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const team = getTeam();
    if (!team) return;

    if (!selectedTheme) {
      toast.error('Please select a page theme');
      return;
    }

    const updatedTeam: Team = {
      ...team,
      name: formData.name,
      formation: formData.formation,
      foundedDate: new Date(formData.foundedDate).toISOString(),
      colors: {
        primary: selectedTheme.colors.primary,
        secondary: selectedTheme.colors.secondary,
      },
      logoUrl: formData.logoUrl || undefined,
      abbreviation: formData.abbreviation || undefined,
      theme: selectedTheme.theme,
    };

    saveTeam(updatedTeam);
    // Apply colors and theme immediately after save
    const hexToHsl = (hex: string) => {
      // Remove # if present
      const h = hex.replace('#', '');
      const r = parseInt(h.substring(0, 2), 16) / 255;
      const g = parseInt(h.substring(2, 4), 16) / 255;
      const b = parseInt(h.substring(4, 6), 16) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let hh = 0, s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: hh = (g - b) / d + (g < b ? 6 : 0); break;
          case g: hh = (b - r) / d + 2; break;
          case b: hh = (r - g) / d + 4; break;
        }
        hh = hh / 6;
      }
      return [Math.round(hh * 360), Math.round(s * 100), Math.round(l * 100)];
    };

    try {
      const [h, s, l] = hexToHsl(selectedTheme.colors.primary);
      // Set CSS variable in the format Tailwind expects (h s% l%)
      document.documentElement.style.setProperty('--primary', `${h} ${s}% ${l}%`);
      // Set foreground to white or black depending on lightness
      const fg = l > 60 ? '0 0% 9%' : '0 0% 98%';
      document.documentElement.style.setProperty('--primary-foreground', fg);
    } catch (err) {
      // ignore conversion errors
    }

    if (selectedTheme.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    toast.success('Team settings updated successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your team information and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., FC Barcelona"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="formation">Preferred Formation *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="foundedDate">Founded Date *</Label>
                <Input
                  id="foundedDate"
                  type="date"
                  value={formData.foundedDate}
                  onChange={(e) => setFormData({ ...formData, foundedDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="abbreviation">Club Abbreviation</Label>
                <Input
                  id="abbreviation"
                  value={formData.abbreviation}
                  onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value.toUpperCase().slice(0, 4) })}
                  placeholder="e.g., FCB"
                  maxLength={4}
                />
                <p className="text-xs text-muted-foreground">Displayed instead of &quot;TM&quot; when no logo is uploaded</p>
              </div>

              <div className="space-y-2">
                <Label>Club Logo</Label>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, logoUrl: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="flex-1"
                    />
                    {formData.logoUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, logoUrl: '' })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {formData.logoUrl && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <img src={formData.logoUrl} alt="Club Logo" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="selectedThemeId">Page Theme</Label>
                <Select
                  id="selectedThemeId"
                  value={formData.selectedThemeId}
                  onChange={(e) => setFormData({ ...formData, selectedThemeId: e.target.value })}
                >
                  <option value="">Select a theme</option>
                  {TEAM_THEME_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name} ({preset.theme})
                    </option>
                  ))}
                </Select>
                <p className="text-xs text-muted-foreground">Preview updates instantly. Theme is applied only after saving changes.</p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {TEAM_THEME_PRESETS.map((preset) => {
                    const isSelected = formData.selectedThemeId === preset.id;
                    const cardTextColor = getContrastTextColor(preset.colors.secondary);
                    const subtleTextColor = cardTextColor === '#111827' ? '#475569' : '#e2e8f0';
                    const badgeTextColor = getContrastTextColor(preset.colors.primary);

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, selectedThemeId: preset.id })}
                        className={cn(
                          'w-full rounded-lg border p-3 text-left transition-colors',
                          isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:border-gray-300'
                        )}
                        style={{ backgroundColor: preset.colors.secondary }}
                        aria-pressed={isSelected}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-semibold" style={{ color: cardTextColor }}>{preset.name}</p>
                              <p className="text-xs" style={{ color: subtleTextColor }}>{preset.description}</p>
                            </div>
                            <span className="text-[10px] uppercase tracking-wide" style={{ color: subtleTextColor }}>{preset.theme}</span>
                          </div>

                          <div
                            className="overflow-hidden rounded-md border border-black/10"
                            style={{ backgroundColor: preset.colors.secondary }}
                          >
                            <div className="h-2" style={{ backgroundColor: preset.colors.primary }} />
                            <div className="space-y-2 p-2">
                              <div
                                className="h-2 w-2/3 rounded"
                                style={{ backgroundColor: preset.colors.primary, opacity: 0.85 }}
                              />
                              <div className="h-2 w-1/2 rounded bg-black/10" />
                              <div className="flex items-center gap-2 pt-1">
                                <span
                                  className="rounded px-2 py-1 text-[10px] font-medium"
                                  style={{
                                    backgroundColor: preset.colors.primary,
                                    color: badgeTextColor,
                                  }}
                                >
                                  Match Day
                                </span>
                                <span
                                  className="text-[10px]"
                                  style={{ color: subtleTextColor }}
                                >
                                  11 Players Available
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className="h-4 w-4 rounded-full border border-gray-200"
                              style={{ backgroundColor: preset.colors.primary }}
                            />
                            <span
                              className="h-4 w-4 rounded-full border border-gray-200"
                              style={{ backgroundColor: preset.colors.secondary }}
                            />
                            <span className="text-xs" style={{ color: subtleTextColor }}>{isSelected ? 'Selected' : 'Tap to choose'}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedTheme && (
                  (() => {
                    const selectedTextColor = getContrastTextColor(selectedTheme.colors.secondary);
                    const selectedSubtleTextColor = selectedTextColor === '#111827' ? '#475569' : '#e2e8f0';

                    return (
                  <div
                    className="rounded-lg border border-gray-200 p-3"
                    style={{
                      backgroundColor: selectedTheme.colors.secondary,
                      borderColor: selectedTheme.colors.secondary,
                    }}
                  >
                      <div className="space-y-2">
                        <p className="text-sm font-medium" style={{ color: selectedTextColor }}>{selectedTheme.name}</p>
                        <p className="text-xs" style={{ color: selectedSubtleTextColor }}>{selectedTheme.description}</p>
                        <div className="flex items-center space-x-3 pt-1">
                          <div className="flex items-center space-x-2">
                            <span
                              className="h-5 w-5 rounded-full border border-gray-200"
                              style={{ backgroundColor: selectedTheme.colors.primary }}
                            />
                            <span className="text-xs" style={{ color: selectedSubtleTextColor }}>Primary</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className="h-5 w-5 rounded-full border border-gray-200"
                              style={{ backgroundColor: selectedTheme.colors.secondary }}
                            />
                            <span className="text-xs" style={{ color: selectedSubtleTextColor }}>Secondary</span>
                          </div>
                        </div>
                      </div>
                  </div>
                    );
                  })()
                )}
              </div>

              <div className="pt-4 border-t">
                <Button type="submit" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manager Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p className="text-sm font-medium mt-1">manager@example.com</p>
              </div>
              
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
