'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Sidebar } from '@/components/Sidebar';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Brain, 
  Activity, 
  Calendar,
  Sparkles,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const data = [
  { name: 'Mon', focus: 4, wasted: 2 },
  { name: 'Tue', focus: 6, wasted: 1 },
  { name: 'Wed', focus: 3, wasted: 4 },
  { name: 'Thu', focus: 7, wasted: 0.5 },
  { name: 'Fri', focus: 5.5, wasted: 2 },
  { name: 'Sat', focus: 2, wasted: 5 },
  { name: 'Sun', focus: 1, wasted: 6 },
];

const categoryData = [
  { name: 'Work', value: 45, color: '#6366f1' },
  { name: 'Personal', value: 25, color: '#f472b6' },
  { name: 'Fitness', value: 15, color: '#10b981' },
  { name: 'Rest', value: 15, color: '#f59e0b' },
];

export default function AnalyticsPage() {
  const { state } = useAppStore();

  return (
    <div className="flex min-h-screen bg-[#FBFBFA]">
      <Sidebar />
      <main className="flex-1 pl-64 transition-all">
        <div className="max-w-7xl mx-auto px-8 py-10 space-y-12">
          
          <header className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-display font-bold">Cognitive Performance</h1>
              <p className="text-slate-500 font-medium italic">Measuring the invisible mechanics of your productivity.</p>
            </div>
            <div className="flex gap-3">
               <button className="px-4 py-2 bg-white border border-black/5 rounded-xl text-xs font-bold flex items-center gap-2 hover:shadow-sm">
                  <Calendar className="w-4 h-4 text-slate-400" /> Last 7 Days <ChevronDown className="w-3 h-3" />
               </button>
               <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI Report
               </button>
            </div>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-8">
                {/* Main Graph */}
                <div className="p-8 premium-card space-y-8">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <h3 className="text-xl font-bold tracking-tight">Focus vs. Friction</h3>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active cognitive output vs distracted time</p>
                      </div>
                      <div className="flex gap-4">
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-600" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Focus</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Friction</span>
                         </div>
                      </div>
                   </div>

                   <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={data}>
                            <defs>
                               <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <XAxis 
                               dataKey="name" 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                               dy={10}
                            />
                            <YAxis hide />
                            <Tooltip 
                               contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                               labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}
                            />
                            <Area 
                               type="monotone" 
                               dataKey="focus" 
                               stroke="#6366f1" 
                               strokeWidth={3}
                               fillOpacity={1} 
                               fill="url(#colorFocus)" 
                            />
                            <Area 
                               type="monotone" 
                               dataKey="wasted" 
                               stroke="#e2e8f0" 
                               strokeWidth={2}
                               fillOpacity={0} 
                            />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Secondary Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-8 premium-card space-y-6">
                      <div className="space-y-1">
                         <h3 className="text-xl font-bold tracking-tight">Time Distribution</h3>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficiency across life pillars</p>
                      </div>
                      <div className="h-[200px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie
                                  data={categoryData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={8}
                                  dataKey="value"
                               >
                                  {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                               </Pie>
                               <Tooltip />
                            </PieChart>
                         </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         {categoryData.map(cat => (
                            <div key={cat.name} className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{cat.name}</span>
                               <span className="text-[10px] font-bold text-slate-900 ml-auto">{cat.value}%</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="p-8 premium-card space-y-6">
                      <div className="space-y-1">
                         <h3 className="text-xl font-bold tracking-tight">Peak Performance</h3>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Most productive hours of day</p>
                      </div>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={data.slice(0, 5)}>
                              <Bar dataKey="focus" radius={[4, 4, 0, 0]}>
                                 {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.focus > 5 ? '#6366f1' : '#e2e8f0'} />
                                 ))}
                              </Bar>
                              <XAxis dataKey="name" hide />
                           </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-4">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                            <Clock className="w-5 h-5" />
                         </div>
                         <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Prime Window</p>
                            <p className="font-bold text-indigo-900 leading-none">09:30 AM — 12:15 PM</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                {/* Advanced Metrics Card */}
                <div className="p-8 premium-card space-y-6">
                   <h3 className="font-bold text-xl">System Vitals</h3>
                   <div className="space-y-8">
                      {[
                        { label: 'Focus Score', value: 92, status: 'Elite', color: 'indigo', icon: Brain },
                        { label: 'Resilience', value: 74, status: 'High', color: 'emerald', icon: TrendingUp },
                        { label: 'Burnout Risk', value: 12, status: 'Stable', color: 'orange', icon: Activity },
                      ].map(metric => (
                        <div key={metric.label} className="space-y-3">
                           <div className="flex justify-between items-end">
                              <div className="flex items-center gap-3">
                                 <div className={`w-8 h-8 bg-${metric.color}-50 text-${metric.color}-600 rounded-lg flex items-center justify-center`}>
                                    <metric.icon className="w-4 h-4" />
                                 </div>
                                 <div className="space-y-0.5">
                                    <p className="font-bold text-sm tracking-tight">{metric.label}</p>
                                    <p className={`text-[10px] font-bold text-${metric.color}-400 uppercase tracking-widest`}>{metric.status}</p>
                                 </div>
                              </div>
                              <span className="text-xl font-bold text-slate-900">{metric.value}%</span>
                           </div>
                           <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }}
                                className={`h-full bg-${metric.color}-500`}
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* AI Recommendation Card */}
                <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_50%)]" />
                   <div className="space-y-4 relative z-10">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform">
                         <Brain className="w-6 h-6" />
                      </div>
                      <h4 className="text-2xl font-display font-bold leading-[1.1]">You&apos;re trending towards evening burnout.</h4>
                      <p className="text-indigo-100/70 text-sm font-medium leading-relaxed">
                        I&apos;ve noticed your focus score drops 40% after 4 PM. I suggest mandatory 15-min &quot;No Screen&quot; breaks every 90 minutes tomorrow.
                      </p>
                      <div className="pt-2">
                        <button className="flex items-center gap-2 text-xs font-bold hover:gap-3 transition-all">
                          Read Detailed Analysis <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </div>
      </main>
    </div>
  );
}
