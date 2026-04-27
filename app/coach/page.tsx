'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Sidebar } from '@/components/Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  MoreHorizontal, 
  Zap, 
  Smile, 
  Plus,
  ArrowDownCircle,
  HelpCircle
} from 'lucide-react';
import { getCoachResponse } from '@/lib/ai';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
  id: string;
}

export default function CoachPage() {
  const { state } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      parts: [{ text: `Hello ${state.profile.name}. I've analyzed your schedule for today. You have a 2-hour deep work block starting soon. How are we feeling about the objectives?` }]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg: Message = { 
      id: Date.now().toString(),
      role: 'user', 
      parts: [{ text: input }] 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await getCoachResponse(input, messages);
      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        parts: [{ text: responseText || "I'm processing that. Let me review your metrics." }]
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 pl-64 transition-all h-screen flex flex-col overflow-hidden">
        {/* Chat Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-20">
           <div className="max-w-4xl mx-auto flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                 <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200 ring-4 ring-slate-50">
                    <Bot className="w-5 h-5" />
                 </div>
                 <div className="space-y-0.5">
                    <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase tracking-widest">Performance Coach</h1>
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Biology-First Optimization</span>
                    </div>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                    <HelpCircle className="w-4 h-4" />
                 </button>
                 <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                    <MoreHorizontal className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </header>

        {/* Messages View */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-8 py-10 space-y-8 no-scrollbar bg-slate-50/50"
        >
          <div className="max-w-4xl mx-auto space-y-12 pb-10">
            {messages.map((msg) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id}
                className={cn(
                  "flex gap-4",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border",
                  msg.role === 'user' ? "bg-white border-slate-200 text-slate-900" : "bg-indigo-600 border-indigo-500 text-white"
                )}>
                   {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
                
                <div className={cn(
                  "max-w-[75%] space-y-2",
                  msg.role === 'user' ? "text-right" : "text-left"
                )}>
                  <div className={cn(
                    "p-5 rounded-2xl text-xs font-bold leading-relaxed shadow-sm border",
                    msg.role === 'user' 
                      ? "bg-slate-900 text-white border-slate-800 rounded-tr-none" 
                      : "bg-white border-slate-200 text-slate-700 rounded-tl-none font-medium"
                  )}>
                    <div className="markdown-body prose prose-sm max-w-none">
                      <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2">
                    {msg.role === 'user' ? 'Client' : 'Coach AI'}
                  </span>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 border border-indigo-500 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                   <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                   <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                   <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-8 bg-white border-t border-slate-200">
           <div className="max-w-4xl mx-auto flex flex-col gap-6">
              <div className="flex gap-3">
                <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 hover:bg-slate-100 transition-all">
                  <Zap className="w-3 h-3 text-indigo-500" /> Focus Crisis
                </button>
                <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 hover:bg-slate-100 transition-all">
                  <Smile className="w-3 h-3 text-indigo-500" /> Motivational Loop
                </button>
                <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 hover:bg-slate-100 transition-all">
                  <Plus className="w-3 h-3 text-indigo-500" /> Re-Plan Day
                </button>
              </div>

              <div className="relative">
                 <input 
                   autoFocus
                   type="text" 
                   placeholder="Review my cognitive performance today..." 
                   className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/5 text-sm font-bold transition-all placeholder:text-slate-300"
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleSend()}
                 />
                 <button 
                   onClick={handleSend}
                   disabled={!input.trim() || isTyping}
                   className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-50 shadow-sm"
                 >
                    <Send className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
