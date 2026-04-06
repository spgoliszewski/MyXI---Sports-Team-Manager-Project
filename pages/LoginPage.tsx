import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getManager, initializeDefaultData } from '@/lib/storage';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize default data on first load
    initializeDefaultData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const manager = getManager();
    
    if (!manager) {
      toast.error('No manager account found');
      return;
    }

    if (email === manager.email && password === manager.password) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/5 flex flex-col">
      {/* Login Form Section */}
      <div className="flex-shrink-0 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">FC</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Welcome back, Manager!</CardTitle>
            <CardDescription className="text-center">
              MyXI Soccer Team Management System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="manager@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            <div className="mt-4 text-center">
           
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guide Section */}
      <div className="flex-shrink-0 bg-slate-100 dark:bg-slate-800 py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Quick Start Guide</h2>
          
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">📋 Manage Players</h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm">Add your squad members with position, number, and physical attributes. Track stats automatically from match results.</p>
            </div>

            <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">📅 Schedule Matches</h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm">Plan fixtures with opponent details, dates, venue type, and formations. Keep your season organized.</p>
            </div>

            <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">⚽ Record Results</h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm">Enter match outcomes and individual player stats. Goals, assists, minutes, and cards are tracked automatically.</p>
            </div>

            <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">📊 View Analytics</h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm">Check team form, top scorers, top assisters, and player ratings. Make informed coaching decisions.</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-slate-700 dark:text-slate-300 mb-4">Want to learn more? Check out our comprehensive documentation.</p>
            <Button onClick={() => navigate('/documentation')} size="lg" className="bg-primary hover:bg-primary/90">
              Read Full Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
