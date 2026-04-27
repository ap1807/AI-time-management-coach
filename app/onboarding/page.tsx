'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Target, 
  Clock, 
  Zap, 
  Brain, 
  Moon, 
  Coffee,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { GoalType, WorkStyle } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'name', title: "Welcome to Chronos", sub: "What should your coach call you?" },
  { id: 'goals', title: "Your North Star", sub: "What are your primary focuses this month?" },
  { id: 'routine', title: "The Foundation", sub: "When does your day start and end?" },
  { id: 'style', title: "Working Style", sub: "How do you prefer to handle high-focus tasks?" },
];

const goalOptions: { id: GoalType; label: string; icon: any }[] = [
  { id: 'work', label: 'Work Performance', icon: Zap },
  { id: 'study', label: 'Academic Success', icon: Brain },
  { id: 'fitness', label: 'Health & Fitness', icon: Target },
  { id: 'business', label: 'Building a Business', icon: Sparkles },
  { id: 'personal', label: 'Personal Projects', icon: Coffee },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const { updateProfile } = useAppStore();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    goals: [] as GoalType[],
    wakeTime: '07:00',
    sleepTime: '23:00',
    workStyle: 'deep-work' as WorkStyle,
  });

  const next = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      updateProfile({ ...form, onboarded: true });
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-12">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-500",
                i <= step ? "bg-indigo-600" : "bg-slate-200"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h1 className="text-4xl font-display font-bold tracking-tight">{steps[step].title}</h1>
              <p className="text-slate-500 text-lg">{steps[step].sub}</p>
            </div>

            <div className="space-y-6">
              {step === 0 && (
                <input
                  autoFocus
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 text-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all font-medium"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && next()}
                />
              )}

              {step === 1 && (
                <div className="grid grid-cols-1 gap-3">
                  {goalOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        const goals = form.goals.includes(opt.id)
                          ? form.goals.filter(g => g !== opt.id)
                          : [...form.goals, opt.id];
                        setForm({ ...form, goals });
                      }}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                        form.goals.includes(opt.id)
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                          : "bg-white border-black/5 text-slate-700 hover:border-indigo-400"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        form.goals.includes(opt.id) ? "bg-white/20" : "bg-indigo-50"
                      )}>
                        <opt.icon className={cn("w-5 h-5", form.goals.includes(opt.id) ? "text-white" : "text-indigo-600")} />
                      </div>
                      <span className="font-bold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Clock className="w-4 h-4" /> Wake Up
                    </label>
                    <input
                      type="time"
                      className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 text-xl focus:outline-none font-medium"
                      value={form.wakeTime}
                      onChange={e => setForm({ ...form, wakeTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Moon className="w-4 h-4" /> Sleep
                    </label>
                    <input
                      type="time"
                      className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 text-xl focus:outline-none font-medium"
                      value={form.sleepTime}
                      onChange={e => setForm({ ...form, sleepTime: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'deep-work', label: 'Monk Focus', sub: 'Long stretches of uninterrupted work.', icon: Zap },
                    { id: 'flexible', label: 'Flow State', sub: 'Balanced sessions with periodic breaks.', icon: Coffee },
                    { id: 'strict', label: 'Strict Logic', sub: 'Rigid structure with precise time blocks.', icon: Target },
                  ].map(style => (
                    <button
                      key={style.id}
                      onClick={() => setForm({ ...form, workStyle: style.id as WorkStyle })}
                      className={cn(
                        "flex items-center gap-4 p-5 rounded-3xl border transition-all text-left",
                        form.workStyle === style.id
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                          : "bg-white border-black/5 text-slate-700 hover:border-indigo-400"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        form.workStyle === style.id ? "bg-white/20" : "bg-indigo-50"
                      )}>
                        <style.icon className={cn("w-6 h-6", form.workStyle === style.id ? "text-white" : "text-indigo-600")} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg">{style.label}</div>
                        <div className={cn("text-sm", form.workStyle === style.id ? "text-white/70" : "text-slate-400")}>
                          {style.sub}
                        </div>
                      </div>
                      {form.workStyle === style.id && <ChevronRight className="w-6 h-6" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={next}
              disabled={step === 0 && !form.name}
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
            >
              {step === steps.length - 1 ? 'Start my Journey' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
