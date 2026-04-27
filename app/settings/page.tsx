'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Sidebar } from '@/components/Sidebar';
import { 
  User, 
  Shield, 
  Bell, 
  Moon, 
  CreditCard, 
  Database, 
  LogOut,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { state, updateProfile, clearAll } = useAppStore();

  return (
    <div className="flex min-h-screen bg-[#FBFBFA]">
      <Sidebar />
      <main className="flex-1 pl-64 transition-all">
        <div className="max-w-4xl mx-auto px-8 py-10 space-y-12">
          
          <header className="space-y-1">
            <h1 className="text-3xl font-display font-bold">Preferences</h1>
            <p className="text-slate-500 font-medium">Fine-tune your cognitive environment.</p>
          </header>

          <div className="space-y-10">
             {/* Premium Banner */}
             {!state.profile.isPremium && (
               <div className="p-8 bg-indigo-600 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.2),transparent_60%)]" />
                  <div className="space-y-2 relative z-10">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                        <Sparkles className="w-3 h-3" /> Professional Tier
                     </div>
                     <h3 className="text-2xl font-bold tracking-tight">Upgrade to Chronos Platinum</h3>
                     <p className="text-indigo-100/70 text-sm font-medium">Unlimited AI coaching, neuro-productivity analysis, and smart task auto-pilot.</p>
                  </div>
                  <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl text-sm font-bold shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 whitespace-nowrap">
                     Unlock All Features
                  </button>
               </div>
             )}

             {/* Settings Sections */}
             <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Account & Identity</h3>
                <div className="premium-card overflow-hidden divide-y divide-black/5">
                   {[
                     { icon: User, label: "Profile Information", value: state.profile.name, id: 'profile' },
                     { icon: Shield, label: "Security & Privacy", value: "Verified", id: 'privacy' },
                     { icon: Bell, label: "Notification Systems", value: "Smart Alerts", id: 'notifications' },
                     { icon: Moon, label: "System Interface", value: "Light Mode", id: 'theme' },
                   ].map(item => (
                     <button key={item.id} className="w-full p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                              <item.icon className="w-5 h-5" />
                           </div>
                           <div className="text-left">
                              <p className="text-sm font-bold text-slate-900">{item.label}</p>
                              <p className="text-xs text-slate-400 font-medium">{item.value}</p>
                           </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                     </button>
                   ))}
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">System Configuration</h3>
                <div className="premium-card overflow-hidden divide-y divide-black/5">
                   <div className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <Zap className="w-5 h-5" />
                         </div>
                         <div className="text-left">
                            <p className="text-sm font-bold text-slate-900">Working Style</p>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{state.profile.workStyle}</p>
                         </div>
                      </div>
                      <select 
                        className="bg-slate-50 border-none rounded-xl text-xs font-bold px-4 py-2 cursor-pointer focus:ring-0"
                        value={state.profile.workStyle}
                        onChange={e => updateProfile({ workStyle: e.target.value as any })}
                      >
                         <option value="deep-work">Deep Work</option>
                         <option value="flexible">Flexible</option>
                         <option value="strict">Strict</option>
                      </select>
                   </div>
                   
                   <button className="w-full p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                            <Database className="w-5 h-5" />
                         </div>
                         <div className="text-left">
                            <p className="text-sm font-bold text-slate-900">Data Management</p>
                            <p className="text-xs text-slate-400 font-medium">Export or purge your local history.</p>
                         </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 transition-colors" />
                   </button>
                </div>
             </div>

             <div className="pt-6 border-t border-black/5">
                <button 
                  onClick={() => {
                    if (confirm("Are you sure? This will delete all your tasks, habits, and preferences.")) {
                      clearAll();
                      window.location.href = '/';
                    }
                  }}
                  className="flex items-center gap-3 px-6 py-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all border border-rose-100"
                >
                   <LogOut className="w-4 h-4" />
                   Reset System
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
