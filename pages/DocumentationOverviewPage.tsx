import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Target, Shield } from 'lucide-react';

export default function DocumentationOverviewPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Card className="overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="space-y-2 bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800 px-6 py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-3xl text-slate-900 dark:text-white">Overview</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Understanding MyXI Team Manager
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => navigate('/documentation')}>Back to Docs</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 px-6 py-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">What is MyXI Team Manager?</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                MyXI Team Manager is a comprehensive web application designed specifically for soccer teams.
                Built with modern web technologies, it provides coaches, managers, and players with powerful
                tools to manage team operations, track performance, and analyze data—all from their browser.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Key Technology Stack:</strong> React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui components
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Core Philosophy</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4 space-y-2">
                    <Shield className="h-6 w-6 text-green-600" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Simplicity First</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      No complex setup or backend required. Everything runs in your browser.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4 space-y-2">
                    <Target className="h-6 w-6 text-blue-600" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Performance Focused</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Track goals, assists, minutes, and disciplinary actions with detailed analytics.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Who Should Use This App?</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Coaches</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Manage player lineups, track match performance, and make data-driven decisions
                      about team composition and tactics.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Team Managers</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Organize fixtures, maintain squad details, record match results, and generate
                      performance reports for stakeholders.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Players</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Review personal performance statistics, track progress over time, and stay
                      informed about team activities and results.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Getting Started</h2>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-semibold">1</div>
                  <span className="text-slate-700 dark:text-slate-300">Create your manager account on the login page</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-semibold">2</div>
                  <span className="text-slate-700 dark:text-slate-300">Set up your team information in Team Settings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-semibold">3</div>
                  <span className="text-slate-700 dark:text-slate-300">Add your players and start scheduling matches</span>
                </div>
              </div>
            </section>

            <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" onClick={() => navigate('/documentation')}>
                ← Back to Documentation
              </Button>
              <Button onClick={() => navigate('/documentation/features')}>
                Next: Features →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}