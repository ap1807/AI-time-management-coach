'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Sidebar } from '@/components/Sidebar';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Bell, 
  Calendar, 
  Clock, 
  Zap, 
  CheckCircle2, 
  MoreHorizontal,
  Flame,
  ArrowUpRight,
  Brain,
  Timer,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { FocusMode } from '@/components/FocusMode';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { state, updateTask } = useAppStore();
  const [showFocus, setShowFocus] = useState(false);

  const todayTasks = state.tasks.filter(t => t.date === new Date().toISOString().split('T')[0]);
  const completedCount = todayTasks.filter(t => t.completed).length;
  const progressPercentage = todayTasks.length ? Math.round((completedCount / todayTasks.length) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 pl-64 transition-all h-screen flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold tracking-tight text-slate-800">Dashboard</h1>
            <div className="h-4 w-[1px] bg-slate-200" />
            <p className="text-xs font-bold text-slate-400">Welcome back, {state.profile.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input type="text" placeholder="Search tasks..." className="bg-transparent border-none text-[11px] focus:ring-0 placeholder:text-slate-400 font-bold" />
            </div>
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Bell className="w-4 h-4" /></button>
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-[10px]">
              {state.profile.name[0]}
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
          
          {/* Sidebar Left: Stats & Energy */}
          <div className="col-span-3 flex flex-col gap-6 overflow-hidden">
            {/* Energy Level Card */}
            <div className="premium-card p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cognitive Load</h3>
                <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Optimal</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '82%' }}
                  className="h-full bg-emerald-400 rounded-full" 
                />
              </div>
              <p className="text-[11px] text-slate-500 italic leading-relaxed font-medium">
                &quot;Optimal for deep work. Tackle your most complex tasks now.&quot;
              </p>
            </div>

            {/* Core Stats Mini */}
            <div className="premium-card p-5 flex-1 flex flex-col">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Performance Metrics</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                      <Flame className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-600">Streak</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">12 Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                      <Brain className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-600">Efficiency</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-600">Completion</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{progressPercentage}%</span>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-50">
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(14)].map((_, i) => (
                    <div key={i} className={cn(
                      "w-full aspect-square rounded-[2px]",
                      i % 3 === 0 ? "bg-indigo-600" : i % 5 === 0 ? "bg-indigo-200" : "bg-slate-100"
                    )} />
                  ))}
                </div>
              </div>
            </div>

            {/* Active Objective */}
            <div className="bg-indigo-600 p-5 rounded-2xl shadow-lg text-white">
              <span className="text-[9px] uppercase font-bold opacity-70 tracking-widest">Active Objective</span>
              <h4 className="text-base font-bold mt-1 mb-3">Today&apos;s Flow</h4>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-1.5 bg-indigo-400/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                </div>
                <span className="text-[10px] font-bold">{progressPercentage}%</span>
              </div>
              <p className="text-[10px] opacity-70 font-medium">Goal: {completedCount}/{todayTasks.length} tasks</p>
            </div>
          </div>

          {/* Main: Schedule Center */}
          <div className="col-span-6 premium-card flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-end shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Daily Schedule</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{format(new Date(), 'EEEE, MMMM do')}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-50 rounded-lg border border-slate-100"><ChevronLeft className="w-4 h-4 text-slate-400" /></button>
                <button className="p-2 hover:bg-slate-50 rounded-lg border border-slate-100"><ChevronRight className="w-4 h-4 text-slate-400" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {todayTasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-slate-200" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Your schedule is empty</h3>
                    <p className="text-xs font-semibold text-slate-400 max-w-[200px] mx-auto mt-1">Let AI generate your optimal day planning.</p>
                  </div>
                  <Link href="/planner" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all">
                    Plan My Day
                  </Link>
                </div>
              ) : todayTasks.map((task, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={task.id} 
                  className="flex gap-4 group"
                >
                  <div className="w-12 text-right pt-4 shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.startTime || '08:00'}</span>
                  </div>
                  <div className={cn(
                    "flex-1 p-4 rounded-xl border-l-4 transition-all relative",
                    task.completed ? "bg-slate-50 border-slate-200 opacity-60" : "bg-white border-indigo-500 shadow-sm border border-slate-100"
                  )}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className={cn("text-sm font-bold text-slate-800", task.completed && "line-through")}>{task.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{task.duration} mins • {task.priority} Priority</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <button 
                           onClick={() => updateTask(task.id, { completed: !task.completed })}
                           className={cn(
                             "w-6 h-6 rounded-lg border flex items-center justify-center transition-all",
                             task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-200 hover:border-indigo-400"
                           )}
                         >
                           {task.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                         </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-50 bg-slate-50/50">
               <button className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                  <Plus className="w-4 h-4" /> Add Slot
               </button>
            </div>
          </div>

          {/* Right Side: AI Coach & Focus */}
          <div className="col-span-3 flex flex-col gap-6">
            {/* Focus Timer Mini */}
            <div className="premium-card p-6 text-center space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Focus Engine</h3>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="44" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                  <circle cx="48" cy="48" r="44" stroke="#4f46e5" strokeWidth="4" fill="transparent" strokeDasharray="276.46" strokeDashoffset="69.11" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-bold text-slate-800">25:00</span>
                  <span className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter">Pomo</span>
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <button 
                  onClick={() => setShowFocus(true)}
                  className="px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm active:scale-95 transition-all"
                >
                  Start
                </button>
              </div>
            </div>

            {/* AI Coach Snippet */}
            <div className="bg-slate-900 rounded-3xl shadow-xl flex-1 flex flex-col overflow-hidden">
               <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white text-[11px] font-bold uppercase tracking-widest">AI Performance Coach</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[9px] text-slate-500 font-bold">Optimizing...</span>
                    </div>
                  </div>
               </div>
               
               <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar">
                  <div className="bg-slate-800/80 p-4 rounded-2xl rounded-tl-none text-[11px] text-slate-300 leading-relaxed font-medium">
                    &quot;I noticed your focus core drops 40% after 4 PM. I suggest mandatory 15-min breaks every 90 mins tomorrow.&quot;
                  </div>
                  <div className="bg-indigo-600 p-4 rounded-2xl rounded-tr-none text-[11px] text-white leading-relaxed font-bold ml-4">
                    &quot;Understood. Update my schedule for tomorrow.&quot;
                  </div>
               </div>

               <div className="p-4 bg-slate-900 border-t border-slate-800">
                  <Link href="/coach" className="w-full py-3 bg-slate-800 border border-slate-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-700 transition-all">
                    Full Analysis <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showFocus && <FocusMode onClose={() => setShowFocus(false)} />}
      </AnimatePresence>
    </div>
  );
}
