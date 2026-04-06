import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqCategories = [
  {
    title: 'Getting Started',
    icon: '🚀',
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Simply enter a team name and manager name on the login page, then click "Create Team". Your account will be created instantly in your browser. No email or password verification is needed.'
      },
      {
        question: 'Is there a demo version I can try?',
        answer: 'You can immediately start using the app by entering any team and manager name on the login page. There\'s no trial period - full functionality is available from the start.'
      },
      {
        question: 'Can I use the app on my phone?',
        answer: 'Yes! The app is fully responsive and works on desktop, tablet, and mobile devices. Simply access it through your mobile browser - no app installation needed.'
      }
    ]
  },
  {
    title: 'Players & Teams',
    icon: '👥',
    questions: [
      {
        question: 'How many players can I add to my squad?',
        answer: 'You can add unlimited players to your squad. The app is designed to handle teams of any size, from small academies to large professional teams.'
      },
      {
        question: 'Can I edit player information?',
        answer: 'Yes, you can edit any player\'s information at any time. Simply navigate to the Players page, click on a player, and update their details. Changes are saved automatically.'
      },
      {
        question: 'What happens if I delete a player?',
        answer: 'When you delete a player, they are removed from your squad. However, their historical statistics from past matches remain in your records for reference.'
      },
      {
        question: 'Can I manage multiple teams?',
        answer: 'Currently, the app supports managing one team per account. Support for multiple teams is planned for Q3 2026. Stay tuned for updates!'
      }
    ]
  },
  {
    title: 'Matches & Results',
    icon: '⚽',
    questions: [
      {
        question: 'How do I schedule a match?',
        answer: 'Go to the Calendar page and click "Schedule Match". Enter the opponent name, date, and venue type (home/away). You can optionally set the formation and add notes.'
      },
      {
        question: 'Can I edit a match after scheduling it?',
        answer: 'Yes, you can edit match details, including the opponent, date, and venue, at any time before or after the match is played.'
      },
      {
        question: 'How do I record the result of a match?',
        answer: 'After a match is played, go to the Calendar, select the match, and click "Enter Result". Record the final score, then for each player, log their goals, assists, minutes, and cards.'
      },
      {
        question: 'Can I change the result after entering it?',
        answer: 'Yes, you can edit match results and player statistics at any time. Simply go back to the Calendar, select the match, and update the information.'
      }
    ]
  },
  {
    title: 'Statistics & Analytics',
    icon: '📊',
    questions: [
      {
        question: 'How are player ratings calculated?',
        answer: 'Player ratings are based on their overall performance across all recorded matches, including goals, assists, discipline, and consistency.'
      },
      {
        question: 'Where can I find top scorers?',
        answer: 'Navigate to the "Top Scorers" page from the main menu to see your top goal scorers ranked by total goals throughout the season.'
      },
      {
        question: 'How do I view playing time statistics?',
        answer: 'Check the "Most Minutes" page to see players ranked by total minutes played, and the "Least Minutes" page for players with minimal playing time.'
      },
      {
        question: 'Can I export statistics?',
        answer: 'Data export functionality is currently planned for Q2 2026. This will allow you to export reports in various formats for external use.'
      }
    ]
  },
  {
    title: 'Data & Storage',
    icon: '💾',
    questions: [
      {
        question: 'Where is my data stored?',
        answer: 'All your team and player data is stored locally in your browser using localStorage. This means your data stays on your device and never goes to a server.'
      },
      {
        question: 'Is my data safe?',
        answer: 'Yes, your data is completely private. Since it\'s stored locally on your device, only you can access it. No data is sent to external servers.'
      },
      {
        question: 'What happens if I clear my browser data?',
        answer: 'Clearing your browser data will also remove the app\'s data. We recommend exporting or backing up important data before clearing your browser cache.'
      },
      {
        question: 'Can I access my data on multiple devices?',
        answer: 'Currently, data is stored per device and browser. Support for cloud synchronization across devices is planned for Q4 2026.'
      },
      {
        question: 'How much data can I store?',
        answer: 'Modern browsers typically allow 5-10MB of localStorage, which is plenty for years of team data for most typical teams.'
      }
    ]
  },
  {
    title: 'Technical Issues',
    icon: '🔧',
    questions: [
      {
        question: 'What browsers are supported?',
        answer: 'The app works in all modern browsers including Chrome, Firefox, Safari, and Edge. Always use the latest version of your browser for best performance.'
      },
      {
        question: 'Will the app work offline?',
        answer: 'Yes! Once loaded, the app works completely offline. All data is stored locally, so you can use it anywhere without internet connection.'
      },
      {
        question: 'Why is the app not loading?',
        answer: 'Try refreshing the page, clearing your browser cache, or trying a different browser. If issues persist, ensure JavaScript is enabled in your browser settings.'
      },
      {
        question: 'How do I reset my data?',
        answer: 'Go to Team Settings and look for the reset or clear data option. Alternatively, clear your browser\'s localStorage data to reset everything.'
      }
    ]
  },
  {
    title: 'Account & Settings',
    icon: '⚙️',
    questions: [
      {
        question: 'How do I change my team name?',
        answer: 'Go to Team Settings to update your team name, manager name, and other team information. Changes are saved automatically.'
      },
      {
        question: 'Can I switch between dark and light mode?',
        answer: 'Yes, the app automatically follows your device\'s theme preference. You can also toggle between dark and light mode using the theme switcher in the app settings.'
      },
      {
        question: 'How do I log out?',
        answer: 'You can log out by going to Team Settings and clicking the logout button, or by clearing your browser data. When you return, you\'ll need to log in again.'
      },
      {
        question: 'Is there a password to my account?',
        answer: 'No, there\'s no password required. Your account is identified by your team name. This keeps things simple and requires no email or password recovery.'
      }
    ]
  },
  {
    title: 'Features & Roadmap',
    icon: '🎯',
    questions: [
      {
        question: 'What features are coming next?',
        answer: 'We\'re working on enhanced analytics (Q2 2026), multi-team support (Q3 2026), cloud synchronization (Q4 2026), and many more features. Check the Future Plans page for details.'
      },
      {
        question: 'How can I request a feature?',
        answer: 'We\'d love to hear your ideas! Feature requests from the community help shape our development roadmap. Check Future Plans for how to contribute suggestions.'
      },
      {
        question: 'Is there a mobile app?',
        answer: 'Currently, the web app works on mobile browsers. Native iOS and Android apps are planned for Q4 2026 as part of our Phase 3 development.'
      },
      {
        question: 'Will data sync across devices?',
        answer: 'Cloud synchronization is planned for Q4 2026. Until then, data remains local to each device and browser.'
      }
    ]
  }
];

function FAQCategory({ category }: { category: typeof faqCategories[0] }) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">{category.icon}</span>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{category.title}</h3>
      </div>
      <div className="space-y-2">
        {category.questions.map((item, index) => (
          <Card key={index} className="cursor-pointer border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-4 text-left flex items-start justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="font-semibold text-slate-900 dark:text-white text-sm pr-4">
                  {item.question}
                </span>
                {expandedItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {expandedItems.includes(index) && (
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function DocumentationFaqPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Card className="overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="space-y-2 bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800 px-6 py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <HelpCircle className="h-8 w-8 text-amber-600" />
                <div>
                  <CardTitle className="text-3xl text-slate-900 dark:text-white">FAQ</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Frequently asked questions and troubleshooting
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => navigate('/documentation')}>Back to Docs</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 px-6 py-6">
            <section className="space-y-3">
              <h2 className="text-lg text-slate-600 dark:text-slate-400">
                Find answers to common questions about MyXI Team Manager. Click any question to reveal the answer.
              </h2>
            </section>

            <div className="space-y-10">
              {faqCategories.map((category, index) => (
                <FAQCategory key={index} category={category} />
              ))}
            </div>

            <section className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Didn't find your answer?</h2>
              <p className="text-slate-600 dark:text-slate-400">
                If you have a question that wasn't covered here, check the other documentation pages or contact our support team.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => navigate('/documentation/usage')}>
                  View Usage Guide
                </Button>
                <Button variant="outline" onClick={() => navigate('/documentation/features')}>
                  Explore Features
                </Button>
              </div>
            </section>

            <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" onClick={() => navigate('/documentation')}>
                ← Back to Documentation
              </Button>
              <Button variant="outline" onClick={() => navigate('/documentation/future')}>
                Future Plans →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}