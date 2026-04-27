'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  Zap, 
  Calendar, 
  CheckCircle2, 
  BarChart3, 
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Timer
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { state } = useAppStore();
  const router = useRouter();

  if (state.profile.onboarded) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Timer className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800 uppercase">Chronos</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
          </div>

          <Link 
            href="/onboarding"
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 uppercase tracking-widest flex items-center gap-2"
          >
            Launch Chronos
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-8">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ring-4 ring-slate-100">
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              Advanced Performance Engine
            </div>
            <h1 className="text-7xl md:text-8xl font-display font-bold tracking-tight max-w-5xl mx-auto leading-[0.85] text-slate-900 uppercase">
              Reclaim <span className="text-indigo-600">Time</span> <br />
              <span className="text-slate-300">Optimize</span> Flow.
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-bold uppercase tracking-widest italic">
              Hyper-productivity for the modern minimalist.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative px-4"
          >
            <div className="absolute inset-0 bg-indigo-500 blur-[150px] opacity-10 -z-10" />
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 bg-white p-2">
              <Image 
                src="https://picsum.photos/seed/productivity/1600/900" 
                alt="Chronos Dashboard"
                width={1600}
                height={900}
                className="rounded-[2rem] w-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 px-8 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-display font-bold text-slate-900 uppercase tracking-tight">The Performance Infrastructure</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] italic">Biology-First Optimization</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "AI Scheduling", icon: Calendar, text: "Intelligent time-blocking that adapts to your energy levels throughout the day." },
              { title: "Focus Engine", icon: Zap, text: "Advanced Pomodoro + Ambient Soundscapes designed for deep, uninterrupted work." },
              { title: "Habit Stacking", icon: CheckCircle2, text: "Atomic habit tracking with streak heatmaps to build long-term discipline." },
              { title: "Smart Coaching", icon: Star, text: "24/7 AI Access to a performance coach trained in neuro-productivity." },
              { title: "Bio-Metrics", icon: BarChart3, text: "Predict burnout before it happens with energy and mood analysis." },
              { title: "Anti-Procrastination", icon: ShieldCheck, text: "Real-time delay detection with instant mission-critical micro-tasks." },
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="p-10 premium-card group border-slate-100 shadow-none hover:shadow-2xl hover:border-slate-200 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl flex items-center justify-center mb-10 transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-xl group-hover:shadow-slate-200">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-800 uppercase tracking-tight">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-56 px-8 text-center bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-6">
            <h2 className="text-6xl md:text-7xl font-display font-bold leading-none text-slate-900 uppercase tracking-tighter">Master Time.<br /><span className="text-slate-300">Own Focus.</span></h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic leading-relaxed">Join 50,000+ elite performers globally.</p>
          </div>
          <Link 
            href="/onboarding"
            className="inline-flex px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-bold text-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 gap-4 items-center uppercase tracking-widest active:scale-95 duration-200"
          >
            Launch System
            <ArrowRight className="w-8 h-8" />
          </Link>
          <div className="flex items-center justify-center gap-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-200 pt-10 mt-20 opacity-50">
             <div className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-500" /> 52,109 Units Active</div>
             <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Bio-Metric Encrypted</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
