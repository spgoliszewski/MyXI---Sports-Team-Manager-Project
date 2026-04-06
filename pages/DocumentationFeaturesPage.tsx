import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Trophy, BarChart3, Settings, FileText } from 'lucide-react';

export default function DocumentationFeaturesPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Player Management',
      description: 'Comprehensive player profiles with positions, ratings, and performance history.',
      details: [
        'Add, edit, and remove squad members',
        'Track player positions and jersey numbers',
        'Maintain detailed player statistics',
        'View individual player performance over time'
      ],
      color: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
    },
    {
      icon: Calendar,
      title: 'Match Scheduling',
      description: 'Plan and organize your team\'s fixtures with detailed match information.',
      details: [
        'Schedule matches with opponents and dates',
        'Set venue types (home/away)',
        'Configure formations and tactics',
        'Track upcoming and past fixtures'
      ],
      color: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
    },
    {
      icon: Trophy,
      title: 'Result Tracking',
      description: 'Record match outcomes and detailed player performance statistics.',
      details: [
        'Log final scores and match results',
        'Track individual goals, assists, and minutes played',
        'Record disciplinary actions (yellow/red cards)',
        'Maintain comprehensive match history'
      ],
      color: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Powerful insights and visualizations of team and player performance.',
      details: [
        'View top scorers and assist leaders',
        'Track minutes played statistics',
        'Analyze team form and performance trends',
        'Generate performance reports and rankings'
      ],
      color: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800'
    },
    {
      icon: Settings,
      title: 'Team Settings',
      description: 'Customize your team information and app preferences.',
      details: [
        'Set team name and basic information',
        'Configure app settings and preferences',
        'Manage team data and configurations',
        'Customize display options'
      ],
      color: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800'
    },
    {
      icon: FileText,
      title: 'Data Export',
      description: 'Export your team data for external use and reporting.',
      details: [
        'Export player statistics and match data',
        'Generate printable reports',
        'Share team information externally',
        'Backup and restore team data'
      ],
      color: 'bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Card className="overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="space-y-2 bg-green-50 dark:bg-green-950 border-b border-green-200 dark:border-green-800 px-6 py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-8 w-8 text-green-600" />
                <div>
                  <CardTitle className="text-3xl text-slate-900 dark:text-white">Features</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Explore the capabilities of MyXI Team Manager
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => navigate('/documentation')}>Back to Docs</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 px-6 py-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Core Features</h2>
              <p className="text-slate-700 dark:text-slate-300">
                MyXI Team Manager offers a comprehensive suite of tools designed to streamline soccer team management.
                Each feature is built with usability and performance in mind.
              </p>
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className={`overflow-hidden ${feature.color}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg text-slate-900 dark:text-white">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {feature.description}
                      </p>
                      <ul className="space-y-1">
                        {feature.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start space-x-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span className="text-slate-600 dark:text-slate-400">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Technical Highlights</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4 text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">100%</div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Browser-based - No installation required</p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4 text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">Real-time</div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Instant updates and calculations</p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4 text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">Responsive</div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Works on desktop, tablet, and mobile</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" onClick={() => navigate('/documentation/overview')}>
                ← Previous: Overview
              </Button>
              <Button onClick={() => navigate('/documentation/usage')}>
                Next: Usage Guide →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}