import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Users, BarChart3, FileText, Smartphone, Cloud } from 'lucide-react';

export default function DocumentationFuturePage() {
  const navigate = useNavigate();

  const roadmap = [
    {
      phase: 'Phase 1 - Enhanced Analytics',
      timeline: 'Q2 2026',
      status: 'In Development',
      features: [
        'Advanced performance visualizations and charts',
        'Player comparison tools and heat maps',
        'Season-over-season performance tracking',
        'Automated performance insights and recommendations'
      ],
      icon: BarChart3,
      color: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
    },
    {
      phase: 'Phase 2 - Multi-Team Support',
      timeline: 'Q3 2026',
      status: 'Planned',
      features: [
        'Support for multiple teams and leagues',
        'Season management and historical data',
        'Team comparison and league standings',
        'Advanced roster management across teams'
      ],
      icon: Users,
      color: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
    },
    {
      phase: 'Phase 3 - Mobile & Cloud',
      timeline: 'Q4 2026',
      status: 'Planned',
      features: [
        'Native mobile apps for iOS and Android',
        'Cloud synchronization across devices',
        'Real-time collaboration for coaching staff',
        'Backup and restore from cloud storage'
      ],
      icon: Cloud,
      color: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800'
    },
    {
      phase: 'Phase 4 - Advanced Features',
      timeline: '2027',
      status: 'Future',
      features: [
        'Injury and training history tracking',
        'Tactical analysis and formation planning',
        'Video integration and match highlights',
        'Integration with sports data providers'
      ],
      icon: Rocket,
      color: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800'
    }
  ];

  const feedback = [
    'Enhanced reporting and data export options',
    'Customizable dashboards and widgets',
    'Integration with calendar apps and reminders',
    'Advanced filtering and search capabilities',
    'Bulk data import and management tools'
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Card className="overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="space-y-2 bg-pink-50 dark:bg-pink-950 border-b border-pink-200 dark:border-pink-800 px-6 py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Rocket className="h-8 w-8 text-pink-600" />
                <div>
                  <CardTitle className="text-3xl text-slate-900 dark:text-white">Future Plans</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Upcoming features and roadmap for MyXI Team Manager
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => navigate('/documentation')}>Back to Docs</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 px-6 py-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Development Roadmap</h2>
              <p className="text-slate-700 dark:text-slate-300">
                We're continuously working to improve MyXI Team Manager based on user feedback and industry trends.
                Here's our planned development roadmap for the coming months and years.
              </p>
            </section>

            <div className="space-y-6">
              {roadmap.map((phase, index) => {
                const Icon = phase.icon;
                return (
                  <Card key={index} className={`overflow-hidden ${phase.color}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-6 w-6 text-primary" />
                          <div>
                            <CardTitle className="text-lg text-slate-900 dark:text-white">
                              {phase.phase}
                            </CardTitle>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {phase.timeline} • {phase.status}
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          phase.status === 'In Development'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : phase.status === 'Planned'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {phase.status}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {phase.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Community-Driven Features</h2>
              <p className="text-slate-700 dark:text-slate-300">
                We're also planning to implement popular feature requests from our user community:
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {feedback.map((item, index) => (
                  <Card key={index} className="border-slate-200 dark:border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-2">
                        <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to Stay Updated</h2>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Check for Updates</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      New features and improvements are deployed regularly. Check the app periodically for updates.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Community Feedback</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Your feedback helps shape the future of MyXI Team Manager. Share your ideas and suggestions.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Beta Testing Program</h2>
              <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Rocket className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Join Our Beta Program
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Get early access to new features and help us improve the app. Beta testers receive exclusive
                        updates and have direct input on new functionality development.
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        <em>Coming soon - sign up for notifications when the program launches</em>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" onClick={() => navigate('/documentation/storage')}>
                ← Previous: Data Storage
              </Button>
              <Button variant="outline" onClick={() => navigate('/documentation')}>
                Back to Documentation Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}