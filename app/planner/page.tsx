'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Sidebar } from '@/components/Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Trash2, 
  Check, 
  Clock, 
  Plus, 
  Wand2,
  ListTodo,
  CalendarDays,
  Target,
  Search,
  Timer
} from 'lucide-react';
import { generateDailySchedule, breakdownGoal } from '@/lib/ai';
import { Task, Priority } from '@/lib/types';
import { cn } from '@/lib/utils';
import canvasConfetti from 'canvas-confetti';

export default function PlannerPage() {
  const { state, setTasks, addTask, deleteTask } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [isBreakingDown, setIsBreakingDown] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    duration: 30,
    priority: 'medium' as Priority,
    category: 'work' as Task['category']
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const schedule = await generateDailySchedule(state.profile, state.tasks.filter(t => !t.completed));
      if (schedule.length > 0) {
        setTasks(schedule);
        canvasConfetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBreakdown = async () => {
    if (!newGoal) return;
    setIsBreakingDown(true);
    try {
      const subtasks = await breakdownGoal(newGoal);
      subtasks.forEach((t: any) => addTask(t));
      setNewGoal('');
      setShowGoalInput(false);
    } finally {
      setIsBreakingDown(false);
    }
  };

  const handleAddTask = () => {
    if (!newTask.title) return;
    addTask(newTask);
    setNewTask({ title: '', duration: 30, priority: 'medium', category: 'work' });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 pl-64 transition-all">
        <div className="max-w-7xl mx-auto px-8 py-10 space-y-12">
          
          <header className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-display font-bold text-slate-800">Strategy & Planning</h1>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed">&quot;An hour of planning can save you 10 hours of doing.&quot;</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowGoalInput(true)}
                className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold flex items-center gap-2 hover:shadow-sm transition-all text-slate-600 uppercase tracking-widest shadow-sm"
              >
                <Target className="w-4 h-4 text-indigo-600" />
                Break down Goal
              </button>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all disabled:opacity-50 uppercase tracking-widest"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                Auto-Schedule
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Inbox Section */}
            <div className="lg:col-span-1 space-y-8">
              <div className="space-y-4">
                 <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                    <ListTodo className="w-4 h-4" /> Task Inbox
                 </h3>
                 
                 <div className="premium-card p-2 space-y-2 border-slate-200 shadow-none">
                   <div className="relative">
                     <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                       type="text" 
                       placeholder="Task title..." 
                       className="w-full pl-10 pr-4 py-3 bg-transparent text-sm font-bold focus:outline-none placeholder:text-slate-300"
                       value={newTask.title}
                       onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                       onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                     />
                   </div>
                   <div className="flex gap-2 p-2 pt-0">
                      <select 
                        className="bg-slate-50 border-none rounded-xl text-[10px] font-bold px-3 py-1.5 cursor-pointer focus:ring-0 uppercase tracking-widest text-slate-600"
                        value={newTask.duration}
                        onChange={e => setNewTask({ ...newTask, duration: Number(e.target.value) })}
                      >
                         <option value={15}>15m</option>
                         <option value={30}>30m</option>
                         <option value={60}>1h</option>
                         <option value={120}>2h</option>
                      </select>
                      <select 
                        className="bg-slate-50 border-none rounded-xl text-[10px] font-bold px-3 py-1.5 cursor-pointer focus:ring-0 uppercase tracking-widest text-slate-600"
                        value={newTask.priority}
                        onChange={e => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                      >
                         <option value="low">Low Priority</option>
                         <option value="medium">Medium Priority</option>
                         <option value="high">High Priority</option>
                      </select>
                      <button 
                        onClick={handleAddTask}
                        className="ml-auto p-1.5 text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                   </div>
                 </div>

                 <div className="space-y-3">
                   {state.tasks.filter(t => !t.startTime && !t.completed).map(task => (
                      <div key={task.id} className="p-4 premium-card flex items-center justify-between group border-slate-200 shadow-none hover:bg-white hover:shadow-sm">
                        <div className="space-y-1">
                           <p className="font-bold text-sm text-slate-800">{task.title}</p>
                           <div className="flex items-center gap-3 font-bold text-[9px] uppercase tracking-widest">
                             <span className="text-slate-400 flex items-center gap-1">
                               <Clock className="w-3 h-3" /> {task.duration}m
                             </span>
                             <span className={cn(
                                task.priority === 'high' ? "text-rose-500" : task.priority === 'medium' ? "text-amber-500" : "text-slate-300"
                             )}>
                               {task.priority}
                             </span>
                           </div>
                        </div>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="p-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                   ))}
                   {state.tasks.filter(t => !t.startTime && !t.completed).length === 0 && (
                     <div className="py-12 border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300 space-y-2">
                        <Search className="w-8 h-8 opacity-20" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Inbox Clear</p>
                     </div>
                   )}
                 </div>
              </div>
            </div>

            {/* Daily Schedule Section */}
            <div className="lg:col-span-2 space-y-8">
               <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" /> Daily Blueprint
                  </h3>

                  <div className="space-y-4 border-l border-slate-200 ml-4 pl-10 pt-4 pb-4">
                    {state.tasks.filter(t => t.startTime).sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')).map(task => (
                      <div key={task.id} className="relative premium-card p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:border-indigo-100 shadow-none hover:shadow-md border-slate-200">
                         {/* Time marker */}
                         <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-indigo-600 rounded-full z-10 ring-4 ring-slate-50" />
                         
                         <div className="md:w-20 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           {task.startTime}
                         </div>

                         <div className="flex-1 space-y-1">
                           <div className="flex items-center gap-3">
                              <h4 className="text-base font-bold tracking-tight text-slate-800">{task.title}</h4>
                              <span className={cn(
                                "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border",
                                task.category === 'work' ? "bg-indigo-50 border-indigo-100 text-indigo-600" :
                                task.category === 'workout' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                                task.category === 'meal' ? "bg-orange-50 border-orange-100 text-orange-600" :
                                "bg-slate-50 border-slate-100 text-slate-500"
                              )}>
                                {task.category}
                              </span>
                           </div>
                           <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Focus Block • {task.duration} minutes</p>
                         </div>

                         <div className="flex items-center gap-4">
                            <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                               <Timer className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                            >
                               <Trash2 className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                    ))}
                    {state.tasks.filter(t => t.startTime).length === 0 && (
                      <div className="p-12 bg-white rounded-3xl border border-slate-100 text-center space-y-4 shadow-none">
                         <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                            <Sparkles className="w-8 h-8" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="font-bold text-base text-slate-800">Masterplan Needed</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-xs mx-auto">Click Auto-Schedule to design your day architecture.</p>
                         </div>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Goal Breakdown Dialog */}
      <AnimatePresence>
        {showGoalInput && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 space-y-6"
            >
              <div className="space-y-2">
                 <h2 className="text-2xl font-display font-bold">Break down a Goal</h2>
                 <p className="text-slate-500 text-sm">Describe a massive goal, and the AI will generate actionable daily tasks.</p>
              </div>
              <textarea 
                autoFocus
                placeholder="e.g. Build a minimalist portfolio website with React and Framer Motion..." 
                className="w-full h-32 p-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-600/10 transition-all resize-none"
                value={newGoal}
                onChange={e => setNewGoal(e.target.value)}
              />
              <div className="flex gap-3">
                 <button 
                   onClick={() => setShowGoalInput(false)}
                   className="flex-1 py-3 bg-slate-100 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition-all"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleBreakdown}
                   disabled={isBreakingDown || !newGoal}
                   className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
                 >
                   {isBreakingDown ? (
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                     <Sparkles className="w-4 h-4" />
                   )}
                   Analyze &amp; Breakdown
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
