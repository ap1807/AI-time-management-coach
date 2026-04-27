'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckCircle2, 
  MessageSquare, 
  BarChart3, 
  Timer, 
  Settings,
  Sparkles,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Planner', href: '/planner', icon: CheckCircle2 },
  { name: 'Habits', href: '/habits', icon: Target },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'AI Coach', href: '/coach', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r border-slate-200 bg-white flex flex-col fixed left-0 top-0 z-30">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-100">
            <Timer className="text-white w-5 h-5" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-slate-800">Chronos AI</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                isActive 
                  ? "bg-slate-50 text-indigo-600 font-bold" 
                  : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-800"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
              <span className="text-sm tracking-tight">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute right-2 w-1.5 h-1.5 bg-indigo-600 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Premium Access</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
            Unlock advanced AI analytics & unlimited coaching.
          </p>
          <button className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm">
            Go Premium
          </button>
        </div>
        
        <Link 
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-500 hover:bg-slate-50/50 hover:text-slate-800",
            pathname === '/settings' && "bg-slate-50 text-indigo-600 font-bold"
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm tracking-tight">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
