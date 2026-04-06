import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, UserPlus, Calendar, Trophy, BarChart3, Settings } from 'lucide-react';

export default function DocumentationUsagePage() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Settings,
      title: 'Initial Setup',
      description: 'Get started with your team management',
      steps: [
        'Navigate to the login page and create your manager account',
        'Access Team Settings to configure your team name and basic information',
        'Review and adjust any default settings to match your preferences'
      ]
    },
    {
      icon: UserPlus,
      title: 'Managing Players',
      description: 'Build and maintain your squad',
      steps: [
        'Go to the Players page from the main navigation',
        'Click "Add Player" to create new squad members',
        'Fill in player details: name, position, jersey number, and rating',
        'Edit existing players by clicking their profile or using the edit button',
        'Remove players who are no longer part of the squad'
      ]
    },
    {
      icon: Calendar,
      title: 'Scheduling Matches',
      description: 'Plan your team\'s fixtures',
      steps: [
        'Access the Calendar page to view upcoming matches',
        'Click "Schedule Match" to create a new fixture',
        'Enter opponent name, match date, and venue type (home/away)',
        'Optionally set formation and add notes about the match',
        'Save the match to add it to your calendar'
      ]
    },
    {
      icon: Trophy,
      title: 'Recording Results',
      description: 'Track match outcomes and player performance',
      steps: [
        'After a match, go to the Calendar and select the completed match',
        'Click "Enter Result" to record the final score',
        'For each player who participated, log their statistics:',
        '• Goals scored and assists made',
        '• Minutes played',
        '• Yellow or red cards received',
        'Save the result to update team and player statistics'
      ]
    },
    {
      icon: BarChart3,
      title: 'Analyzing Performance',
      description: 'Review team and player statistics',
      steps: [
        'Visit the Dashboard to see overall team performance',
        'Check Top Scorers page for goal-scoring leaders',
        'View Top Assisters for players with most assists',
        'Review Most/Minutes pages for playing time statistics',
        'Use this data to inform team selections and tactics'
      ]
    }
  ];

  const tips = [
    {
      title: 'Data Accuracy',
      content: 'Always double-check player statistics and match results before saving. Accurate data leads to better insights.'
    },
    {
      title: 'Regular Updates',
      content: 'Keep player information current and schedule matches in advance to maintain an organized calendar.'
    },
    {
      title: 'Backup Your Data',
      content: 'Since data is stored locally, consider exporting important information periodically for safekeeping.'
    },
    {
      title: 'Mobile Access',
      content: 'The app works on mobile devices, making it easy to update results and check statistics on the go.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Card className="overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="space-y-2 bg-purple-50 dark:bg-purple-950 border-b border-purple-200 dark:border-purple-800 px-6 py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-purple-600" />
                <div>
                  <CardTitle className="text-3xl text-slate-900 dark:text-white">Usage Guide</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Step-by-step instructions for using MyXI Team Manager
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => navigate('/documentation')}>Back to Docs</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 px-6 py-6">
            <section className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to Use the App</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Follow these step-by-step guides to get the most out of MyXI Team Manager
                </p>
              </div>

              <div className="space-y-8">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <Card key={index} className="border-slate-200 dark:border-slate-700">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <CardTitle className="text-lg text-slate-900 dark:text-white">
                              {step.title}
                            </CardTitle>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2">
                          {step.steps.map((stepDetail, stepIndex) => (
                            <li key={stepIndex} className="flex items-start space-x-3 text-slate-700 dark:text-slate-300">
                              <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs flex items-center justify-center font-medium flex-shrink-0 mt-0.5">
                                {stepIndex + 1}
                              </span>
                              <span className="text-sm leading-relaxed">{stepDetail}</span>
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Pro Tips</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {tips.map((tip, index) => (
                  <Card key={index} className="border-slate-200 dark:border-slate-700">
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{tip.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{tip.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Navigation Overview</h2>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 text-sm">
                  <div><strong>Dashboard:</strong> Overview of team performance</div>
                  <div><strong>Players:</strong> Manage squad members</div>
                  <div><strong>Calendar:</strong> Schedule and view matches</div>
                  <div><strong>Top Scorers:</strong> Goal-scoring statistics</div>
                  <div><strong>Top Assisters:</strong> Assist statistics</div>
                  <div><strong>Most Minutes:</strong> Playing time leaders</div>
                  <div><strong>Team Settings:</strong> Configure team information</div>
                </div>
              </div>
            </section>

            <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" onClick={() => navigate('/documentation/features')}>
                ← Previous: Features
              </Button>
              <Button onClick={() => navigate('/documentation/storage')}>
                Next: Data Storage →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}