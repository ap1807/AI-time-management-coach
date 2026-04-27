'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Zap, Volume2, X, Play, Pause, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import canvasConfetti from 'canvas-confetti';

export function FocusMode({ onClose, initialType = 'pomodoro' }: { onClose: () => void, initialType?: 'pomodoro' | 'deep-work' }) {
  const { addFocusSession } = useAppStore();
  const [timeLeft, setTimeLeft] = useState(initialType === 'pomodoro' ? 25 * 60 : 60 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState(initialType);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setIsDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isDone && timeLeft === 0) {
      canvasConfetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      addFocusSession({
        startTime: new Date().toISOString(),
        duration: initialType === 'pomodoro' ? 25 : 60,
        type: mode
      });
    }
  }, [isDone, timeLeft, addFocusSession, initialType, mode]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setTimeLeft(mode === 'pomodoro' ? 25 * 60 : 60 * 60);
    setIsActive(false);
    setIsDone(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'pomodoro' ? 25 * 60 : 60 * 60)) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-50 flex flex-col pt-12 items-center"
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-3 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200 bg-white shadow-sm"
      >
        <X className="w-5 h-5 text-slate-400" />
      </button>

      <div className="max-w-2xl w-full text-center space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
            <Zap className="w-3 h-3 text-indigo-500" />
            {mode === 'pomodoro' ? 'Standard Focus Block' : 'Deep Work Protocol'}
          </div>
          <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-tighter">Focus Engine</h2>
          <p className="text-xs font-bold text-slate-400 max-w-sm mx-auto uppercase tracking-widest leading-relaxed italic">
            Neurological environmental lock active.
          </p>
        </div>

        <div className="relative flex flex-col items-center justify-center py-20">
          {/* Progress Ring */}
          <svg className="w-80 h-80 transform -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="150"
              stroke="#f1f5f9"
              strokeWidth="2"
              fill="transparent"
            />
            <motion.circle
              cx="160"
              cy="160"
              r="150"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 150}
              animate={{ strokeDashoffset: (progress / 100) * (2 * Math.PI * 150) }}
              className="text-slate-900"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-8xl font-mono font-light tracking-tighter text-slate-900">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={reset}
            className="p-5 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-95"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggle}
            className="px-16 py-6 bg-slate-900 text-white rounded-[2rem] font-bold text-lg flex items-center gap-4 shadow-2xl shadow-slate-200 uppercase tracking-widest"
          >
            {isActive ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
            {isActive ? 'Pause' : 'Enter Flow'}
          </motion.button>

          <button className="p-5 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-95">
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-4 justify-center pt-8">
           <button 
             onClick={() => { setMode('pomodoro'); reset(); }}
             className={cn("px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border", mode === 'pomodoro' ? "bg-white shadow-sm border-slate-200 text-slate-900" : "text-slate-400 border-transparent")}
           >
             Pomodoro
           </button>
           <button 
             onClick={() => { setMode('deep-work'); reset(); }}
             className={cn("px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border", mode === 'deep-work' ? "bg-white shadow-sm border-slate-200 text-slate-900" : "text-slate-400 border-transparent")}
           >
             Deep Work
           </button>
        </div>
      </div>
    </motion.div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
