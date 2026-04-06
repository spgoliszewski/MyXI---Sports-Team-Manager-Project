import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Zap, FileText, Database, Rocket, HelpCircle } from 'lucide-react';

export default function DocumentationPage() {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Overview',
      description: 'Learn about what MyXI Team Manager is and who it\'s for',
      icon: BookOpen,
      path: '/documentation/overview',
      color: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Features',
      description: 'Explore the main features and capabilities of the app',
      icon: Zap,
      path: '/documentation/features',
      color: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
    },
    {
      title: 'Usage Guide',
      description: 'Step-by-step instructions on how to use the app effectively',
      icon: FileText,
      path: '/documentation/usage',
      color: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800'
    },
    {
      title: 'Data Storage',
      description: 'Understanding how your data is stored and managed',
      icon: Database,
      path: '/documentation/storage',
      color: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800'
    },
    {
      title: 'FAQ',
      description: 'Frequently asked questions and troubleshooting',
      icon: HelpCircle,
      path: '/documentation/faq',
      color: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
    },
    {
      title: 'Future Plans',
      description: 'Upcoming features and improvements',
      icon: Rocket,
      path: '/documentation/future',
      color: 'bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Card className="overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="space-y-2 bg-primary/5 dark:bg-primary/10 px-6 py-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-3xl text-slate-900 dark:text-white">MyXI Team Manager Documentation</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Comprehensive guide to help you get the most out of the app
                </p>
              </div>
              <Button variant="secondary" onClick={() => navigate('/')}>Back to Login</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-6 py-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Documentation Sections</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Choose a section below to learn more about specific aspects of the app
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <Card
                    key={section.path}
                    className={`cursor-pointer transition-all hover:shadow-md ${section.color}`}
                    onClick={() => navigate(section.path)}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-8 w-8 text-primary" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {section.title}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {section.description}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

           
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
