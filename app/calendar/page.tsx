'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Sidebar } from '@/components/Sidebar';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  MoreHorizontal,
  Clock,
  Plus
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

export default function CalendarPage() {
  const { state } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <div className="flex min-h-screen bg-[#FBFBFA]">
      <Sidebar />
      <main className="flex-1 pl-64 transition-all">
        <div className="max-w-7xl mx-auto px-8 py-10 space-y-12">
          
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-display font-bold">{format(currentDate, 'MMMM yyyy')}</h1>
              <div className="flex items-center gap-1 bg-white border border-black/5 rounded-xl p-1 shadow-sm">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 text-slate-500" /></button>
                <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600">Today</button>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><ChevronRight className="w-5 h-5 text-slate-500" /></button>
              </div>
            </div>
            <div className="flex gap-3">
               <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:shadow-lg transition-all shadow-indigo-100">
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
                      className={cn(
                        "min-h-[140px] p-4 border-r border-b border-black/[0.03] transition-colors relative group",
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
    </div>
  );
}
