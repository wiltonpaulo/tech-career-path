'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export function AssessmentChat() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: "Welcome to the US Tech Skills Assessment. I am your strategic career advisor. To begin, please describe your current professional role, your core technology stack, and years of experience."
      }
    ]
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[700px] w-full max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white leading-tight">National Interest Assessment</h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Powered by Gemini Pro</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={clsx(
              "flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2",
              m.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              m.role === 'user' ? "bg-blue-600 shadow-lg shadow-blue-500/20" : "bg-slate-800 border border-slate-700"
            )}>
              {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-blue-400" />}
            </div>
            <div className={clsx(
              "max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed",
              m.role === 'user' 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-slate-800/80 border border-slate-700 text-slate-100 rounded-tl-none"
            )}>
              <p className="whitespace-pre-wrap">{m.content.replace("ASSESSMENT_COMPLETE", "")}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            </div>
            <div className="bg-slate-800/50 border border-slate-700 h-10 w-24 rounded-2xl flex items-center justify-center px-4">
              <span className="text-xs text-slate-500 font-medium">Analysing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-6 border-t border-slate-800 bg-slate-900/80">
        <div className="relative group">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your background info here..."
            className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl py-4 pl-6 pr-14 outline-none transition-all placeholder:text-slate-600"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="mt-3 text-[10px] text-center text-slate-500 uppercase tracking-tighter">
          Analysis focused on US Skills Gap and STEM critical vacancies
        </p>
      </form>
    </div>
  );
}
