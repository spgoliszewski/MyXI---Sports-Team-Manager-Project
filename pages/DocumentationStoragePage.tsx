import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Shield, HardDrive, CloudOff, AlertTriangle, CheckCircle } from 'lucide-react';

export default function DocumentationStoragePage() {
  const navigate = useNavigate();

  const storageInfo = [
    {
      icon: HardDrive,
      title: 'Local Browser Storage',
      description: 'All data is stored directly in your browser using localStorage',
      details: [
        'No backend server required',
        'Data persists between sessions',
        'Fast access and instant loading',
        'Works offline once loaded'
      ],
      color: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
    },
    {
      icon: Shield,
      title: 'Data Privacy',
      description: 'Your team data stays private and secure on your device',
      details: [
        'Data never leaves your browser',
        'No external accounts or cloud storage',
        'Complete control over your information',
        'No data sharing with third parties'
      ],
      color: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
    },
    {
      icon: CloudOff,
      title: 'Offline Capability',
      description: 'Use the app even without internet connection',
      details: [
        'Works completely offline',
        'No internet required for core functionality',
        'Data syncs when you\'re back online',
        'Perfect for venues with poor connectivity'
      ],
      color: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800'
    }
  ];

  const considerations = [
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Device-Specific Storage',
      content: 'Data is only available on the device and browser where it was entered. Clearing browser data will remove all team information.'
    },
    {
      type: 'info',
      icon: CheckCircle,
      title: 'Automatic Saving',
      content: 'All changes are automatically saved to localStorage. No manual save button needed - your data is always up to date.'
    },
    {
      type: 'info',
      icon: Database,
      title: 'Storage Limits',
      content: 'Modern browsers typically allow 5-10MB of localStorage. For most teams, this provides ample space for years of data.'
    }
  ];

  const backupTips = [
    'Regularly export important data using the export features',
    'Consider taking screenshots of key statistics and reports',
    'Use multiple devices/browsers if you need redundancy',
    'Keep records of important match results externally if needed'
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Card className="overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="space-y-2 bg-orange-50 dark:bg-orange-950 border-b border-orange-200 dark:border-orange-800 px-6 py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Database className="h-8 w-8 text-orange-600" />
                <div>
                  <CardTitle className="text-3xl text-slate-900 dark:text-white">Data Storage</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Understanding how your data is stored and managed
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => navigate('/documentation')}>Back to Docs</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 px-6 py-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Storage Architecture</h2>
              <p className="text-slate-700 dark:text-slate-300">
                MyXI Team Manager uses a simple yet effective storage approach that keeps everything local
                to your browser. This design choice provides several key benefits while maintaining data security.
              </p>
            </section>

            <div className="grid gap-6 md:grid-cols-1">
              {storageInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card key={index} className={`overflow-hidden ${info.color}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg text-slate-900 dark:text-white">
                          {info.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-slate-600 dark:text-slate-400">
                        {info.description}
                      </p>
                      <ul className="space-y-1">
                        {info.details.map((detail, detailIndex) => (
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
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Important Considerations</h2>
              <div className="space-y-4">
                {considerations.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Card key={index} className={`border-l-4 ${
                      item.type === 'warning'
                        ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950'
                        : 'border-l-blue-500 bg-blue-50 dark:bg-blue-950'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Icon className={`h-5 w-5 mt-0.5 ${
                            item.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Data Backup Recommendations</h2>
              <p className="text-slate-700 dark:text-slate-300">
                While localStorage is reliable for most use cases, here are some best practices for protecting your team data:
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <ul className="space-y-2">
                  {backupTips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Technical Details</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Data Structure</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Team data is stored as JSON objects in localStorage keys like 'team-manager-data'
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Browser Compatibility</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Works in all modern browsers that support localStorage (Chrome, Firefox, Safari, Edge)
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" onClick={() => navigate('/documentation/usage')}>
                ← Previous: Usage Guide
              </Button>
              <Button onClick={() => navigate('/documentation/future')}>
                Next: Future Plans →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}