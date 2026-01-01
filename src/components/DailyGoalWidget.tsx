import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Target, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { saveDailyGoal, getDailyGoal, saveStreak, getStreak } from '@/lib/indexeddb';
import { getAttempts } from '@/lib/indexeddb';

export function DailyGoalWidget() {
  const [goal, setGoal] = useState<{ target: number; completed: number; type: 'questions' | 'minutes'; id?: string; date?: string }>({ target: 10, completed: 0, type: 'questions' });
  const [streak, setStreakState] = useState({ current: 0, longest: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [newTarget, setNewTarget] = useState(10);
  const [expanded, setExpanded] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const progress = Math.min((goal.completed / goal.target) * 100, 100);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedGoal = await getDailyGoal(today);
      const savedStreak = await getStreak();
      const attempts = await getAttempts();
      
      const todayAttempts = attempts.filter(a => 
        new Date(a.timestamp).toISOString().split('T')[0] === today
      ).length;

      if (savedGoal) {
        setGoal({ ...savedGoal, completed: todayAttempts });
      } else {
        setGoal(prev => ({ ...prev, completed: todayAttempts }));
      }

      if (savedStreak) {
        const lastDate = savedStreak.lastActiveDate;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        if (lastDate === today) {
          setStreakState({ current: savedStreak.currentStreak, longest: savedStreak.longestStreak });
        } else if (lastDate === yesterday) {
          const newStreak = savedStreak.currentStreak + (todayAttempts > 0 ? 1 : 0);
          setStreakState({ 
            current: todayAttempts > 0 ? newStreak : 0, 
            longest: Math.max(savedStreak.longestStreak, newStreak) 
          });
        } else {
          setStreakState({ current: todayAttempts > 0 ? 1 : 0, longest: savedStreak.longestStreak });
        }
      } else if (todayAttempts > 0) {
        setStreakState({ current: 1, longest: 1 });
      }
    } catch (e) {
      console.error('Failed to load goal/streak:', e);
    }
  };

  const handleSaveGoal = async () => {
    const newGoal = { 
      id: today, 
      date: today, 
      target: newTarget, 
      completed: goal.completed, 
      type: 'questions' as const 
    };
    await saveDailyGoal(newGoal);
    setGoal({ ...newGoal });
    
    if (goal.completed > 0) {
      await saveStreak({
        id: 'main',
        currentStreak: streak.current || 1,
        longestStreak: Math.max(streak.longest, streak.current || 1),
        lastActiveDate: today,
      });
    }
    
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <AnimatePresence>
        {expanded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
          >
            <Card className="w-72 bg-background/95 backdrop-blur border-border/50 shadow-lg">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Daily Goal
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Set Daily Goal</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Questions per day</label>
                          <Input
                            type="number"
                            value={newTarget}
                            onChange={(e) => setNewTarget(Number(e.target.value))}
                            min={1}
                            max={100}
                          />
                        </div>
                        <Button onClick={handleSaveGoal} className="w-full">Save Goal</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setExpanded(false)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{goal.completed} / {goal.target} questions</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-warning" />
                    <span className="text-lg font-bold">{streak.current}</span>
                    <span className="text-xs text-muted-foreground">day streak</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Best: {streak.longest}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setExpanded(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-background/95 backdrop-blur border border-border/50 shadow-lg hover:border-primary/50 transition-colors"
          >
            <Flame className="w-4 h-4 text-warning" />
            <span className="font-bold text-sm">{streak.current}</span>
            <div className="w-px h-4 bg-border" />
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">{goal.completed}/{goal.target}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
