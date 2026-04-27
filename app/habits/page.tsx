'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Sidebar } from '@/components/Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Target, 
  Flame, 
  Check, 
  X,
  Trophy,
  History,
  Calendar,
  Sparkles,
  Search
} from 'lucide-react';
import { Habit } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const COLORS = ['indigo', 'emerald', 'rose', 'orange', 'violet', 'amber'];
const ICONS = ['Zap', 'Target', 'Coffee', 'Brain', 'Flame', 'Sparkles'];

export default function HabitsPage() {
  const { state, addHabit, toggleHabit } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    frequency: 'daily' as 'daily' | 'weekly',
    goal: 1,
    color: 'indigo',
    icon: 'Target'
  });

  const today = new Date().toISOString().split('T')[0];
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date()
  });

  const handleAdd = () => {
    if (!newHabit.name) return;
    addHabit(newHabit);
    setNewHabit({ name: '', frequency: 'daily', goal: 1, color: 'indigo', icon: 'Target' });
    setShowAdd(false);
  };

  const calculateStreak = (habit: Habit) => {
    let streak = 0;
    const sortedDates = [...habit.completedDates].sort((a,b) => new Date(b).getTime() - new Date(a).getTime());
    let current = new Date();
    
    // Simplistic streak calculation
    for (const completedDate of sortedDates) {
       if (isSameDay(new Date(completedDate), current)) {
         streak++;
         current = subDays(current, 1);
       } else if (isSameDay(new Date(completedDate), subDays(new Date(), 1)) && isSameDay(new Date(sortedDates[0]), subDays(new Date(), 1))) {
         // Missed today but was active yesterday (streak not broken yet if it's early)
         continue;
       } else {
         break;
       }
    }
    return streak;
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 pl-64 transition-all">
        <div className="max-w-7xl mx-auto px-8 py-10 space-y-12">
          
          <header className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-display font-bold text-slate-800">Ritual Building</h1>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed">&quot;We are what we repeatedly do. Excellence is not an act, but a habit.&quot;</p>
            </div>
            <button 
              onClick={() => setShowAdd(true)}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-bold flex items-center gap-2 hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" /> Create Ritual
            </button>
          </header>

          {/* Habit Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {state.habits.map(habit => {
              const completedToday = habit.completedDates.includes(today);
              const streak = calculateStreak(habit);
              
              return (
                <div key={habit.id} className="p-8 premium-card border-slate-200 shadow-none hover:shadow-md space-y-6 group bg-white">
                   <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                         <div className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm",
                           `bg-${habit.color}-50 text-${habit.color}-600 border border-${habit.color}-100`
                         )}>
                            <Target className="w-6 h-6" />
                         </div>
                         <div>
                            <h3 className="text-xl font-bold tracking-tight text-slate-800">{habit.name}</h3>
                            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">{habit.frequency}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-orange-100">
                         <Flame className="w-3.5 h-3.5 fill-orange-600" />
                         {streak} Day Streak
                      </div>
                   </div>

                   {/* Quick Tracker */}
                   <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <div className="space-y-0.5">
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Daily Verification</p>
                         <p className="text-xs font-bold text-slate-700">{completedToday ? 'Current session complete' : 'Waiting for activation'}</p>
                      </div>
                      <button 
                        onClick={() => toggleHabit(habit.id, today)}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm border",
                          completedToday ? "bg-emerald-500 border-emerald-400 text-white shadow-emerald-100" : "bg-white border-slate-200 text-slate-300 hover:text-indigo-600 hover:border-indigo-200"
                        )}
                      >
                         <Check className="w-6 h-6" />
                      </button>
                   </div>

                   {/* Mini Heatmap */}
                   <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
                         <span>30-Day Velocity</span>
                         <span className="text-slate-500 font-bold">{Math.round((habit.completedDates.length / 30) * 100)}% Consistancy</span>
                      </div>
                      <div className="grid grid-cols-15 gap-1.5 h-16 w-full">
                         {last30Days.map(date => {
                           const dStr = format(date, 'yyyy-MM-dd');
                           const isActive = habit.completedDates.includes(dStr);
                           return (
                             <div 
                               key={dStr} 
                               className={cn(
                                 "aspect-square rounded-[2px] transition-all hover:scale-150 cursor-help",
                                 isActive ? `bg-${habit.color}-500 shadow-[0_0_8px_rgba(var(--color-${habit.color}-500),0.3)]` : "bg-slate-100"
                               )}
                               title={format(date, 'MMM do')}
                             />
                           );
                         })}
                      </div>
                   </div>
                </div>
              );
            })}

            {state.habits.length === 0 && (
               <div className="col-span-2 py-40 border border-dashed border-slate-200 rounded-[3rem] text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                     <Target className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-xl font-bold text-slate-800">No rituals formed yet.</h3>
                     <p className="text-xs font-bold text-slate-400 max-w-sm mx-auto uppercase tracking-widest leading-relaxed">Disciplined people don&apos;t have super-willpower. They have better systems.</p>
                  </div>
                  <button 
                    onClick={() => setShowAdd(true)}
                    className="inline-flex py-3 px-8 bg-slate-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all"
                  >
                    Establish your first ritual
                  </button>
               </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Habit Dialog */}
      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-10 space-y-8"
            >
              <div className="space-y-2">
                 <h2 className="text-3xl font-display font-bold">New Ritual</h2>
                 <p className="text-slate-500 font-medium">Daily consistency is the gateway to mastery.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ritual Name</label>
                   <input 
                     autoFocus
                     type="text" 
                     placeholder="e.g. Deep Work Session, 5AM Yoga, Reading" 
                     className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-600/10 transition-all"
                     value={newHabit.name}
                     onChange={e => setNewHabit({...newHabit, name: e.target.value})}
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Frequency</label>
                      <select 
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-0 cursor-pointer"
                        value={newHabit.frequency}
                        onChange={e => setNewHabit({...newHabit, frequency: e.target.value as any})}
                      >
                         <option value="daily">Daily</option>
                         <option value="weekly">Weekly</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Color Theme</label>
                      <div className="flex gap-2 p-2">
                         {COLORS.map(c => (
                            <button 
                              key={c} 
                              onClick={() => setNewHabit({...newHabit, color: c})}
                              className={cn(
                                "w-6 h-6 rounded-full transition-all",
                                `bg-${c}-500`,
                                newHabit.color === c ? "scale-125 ring-2 ring-indigo-600 ring-offset-2" : "opacity-60"
                              )}
                            />
                         ))}
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex gap-4">
                 <button 
                   onClick={() => setShowAdd(false)}
                   className="flex-1 py-4 bg-slate-100 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-200"
                 >
                   Discard
                 </button>
                 <button 
                   onClick={handleAdd}
                   className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700"
                 >
                   Establish Ritual
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
