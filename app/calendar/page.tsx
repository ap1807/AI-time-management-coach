'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Sidebar } from '@/components/Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  MoreHorizontal,
  Clock,
  Plus,
  X,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  startOfWeek, 
  endOfWeek,
  isToday
} from 'date-fns';
import { Priority, Task } from '@/lib/types';

export default function CalendarPage() {
  const { state, addTask } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    duration: 60,
    priority: 'medium' as Priority,
    category: 'work' as Task['category']
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleCreateEvent = () => {
    if (!newTask.title) return;
    addTask(newTask);
    setShowAddModal(false);
    setNewTask({
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      duration: 60,
      priority: 'medium',
      category: 'work'
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 pl-64 transition-all">
        <div className="max-w-7xl mx-auto px-8 py-10 space-y-12">
          
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-display font-bold text-slate-800">{format(currentDate, 'MMMM yyyy')}</h1>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 text-slate-500" /></button>
                <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Today</button>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><ChevronRight className="w-5 h-5 text-slate-500" /></button>
              </div>
            </div>
            <div className="flex gap-3">
               <button 
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
               >
                  <Plus className="w-4 h-4" /> Schedule Event
               </button>
            </div>
          </header>

          <div className="premium-card overflow-hidden">
             {/* Weekly Header */}
             <div className="grid grid-cols-7 border-b border-black/5 bg-slate-50/50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                   <div key={day} className="py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {day}
                   </div>
                ))}
             </div>

             {/* Days Grid */}
             <div className="grid grid-cols-7 bg-white">
                {days.map((day, i) => {
                  const dayTasks = state.tasks.filter(t => t.date === format(day, 'yyyy-MM-dd'));
                  const dayHabits = state.habits.filter(h => h.completedDates.includes(format(day, 'yyyy-MM-dd')));
                  
                  return (
                    <div 
                      key={day.toISOString()} 
                      onClick={() => {
                        setNewTask({ ...newTask, date: format(day, 'yyyy-MM-dd') });
                        setShowAddModal(true);
                      }}
                      className={cn(
                        "min-h-[140px] p-4 border-r border-b border-slate-100 transition-colors relative group cursor-pointer",
                        !isSameMonth(day, monthStart) && "bg-slate-50/30 opacity-40",
                        "hover:bg-slate-50/50"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={cn(
                          "w-7 h-7 flex items-center justify-center text-sm font-bold rounded-lg transition-all",
                          isToday(day) ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-600"
                        )}>
                          {format(day, 'd')}
                        </span>
                        {dayTasks.length > 0 && (
                          <div className="flex gap-0.5">
                            {dayTasks.slice(0, 3).map((t, idx) => (
                              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 overflow-hidden">
                        {dayTasks.slice(0, 3).map(task => (
                           <div key={task.id} className="px-2 py-1 bg-indigo-50/50 border border-indigo-100 rounded text-[10px] font-bold text-indigo-700 truncate">
                              {task.title}
                           </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-[9px] font-bold text-slate-400 pl-1">
                             + {dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      </main>
      
      <AnimatePresence>
        {showAddModal && (
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
              <div className="flex justify-between items-center">
                 <div className="space-y-1">
                    <h2 className="text-2xl font-display font-bold text-slate-800">Schedule Event</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add new task to timeline</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                 </button>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Event Title</label>
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="e.g. Design Sync" 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600/10 transition-all"
                      value={newTask.title}
                      onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date</label>
                       <input 
                         type="date" 
                         className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600/10 transition-all"
                         value={newTask.date}
                         onChange={e => setNewTask({ ...newTask, date: e.target.value })}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                       <input 
                         type="time" 
                         className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600/10 transition-all"
                         value={newTask.startTime}
                         onChange={e => setNewTask({ ...newTask, startTime: e.target.value })}
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Duration (min)</label>
                       <select 
                         className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600/10 transition-all appearance-none"
                         value={newTask.duration}
                         onChange={e => setNewTask({ ...newTask, duration: Number(e.target.value) })}
                       >
                          <option value={15}>15 mins</option>
                          <option value={30}>30 mins</option>
                          <option value={45}>45 mins</option>
                          <option value={60}>1 hour</option>
                          <option value={120}>2 hours</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                       <select 
                         className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600/10 transition-all appearance-none"
                         value={newTask.priority}
                         onChange={e => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                       >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <div className="grid grid-cols-3 gap-2">
                       {['work', 'workout', 'meal', 'break', 'rest', 'other'].map(cat => (
                          <button 
                            key={cat}
                            onClick={() => setNewTask({ ...newTask, category: cat as Task['category'] })}
                            className={cn(
                              "py-2 px-1 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all",
                              newTask.category === cat ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105" : "bg-white border-slate-200 text-slate-400 hover:border-indigo-400"
                            )}
                          >
                             {cat}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>

              <button 
                onClick={handleCreateEvent}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                Confirm Schedule
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
