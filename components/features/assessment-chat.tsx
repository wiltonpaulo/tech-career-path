'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';

export function AssessmentChat() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'initial',
        role: 'assistant',
        content: "Welcome. Please describe your professional background and years of experience."
      }
    ]
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center gap-2 font-bold text-white">
        <Sparkles className="w-4 h-4 text-blue-400" /> Assessment Engine
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-xl text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-100 border border-slate-700'}`}>
              <div className="flex items-center gap-2 mb-1 opacity-50 font-bold uppercase text-[10px]">
                {m.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-blue-400" />}
                {m.role}
              </div>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && !error && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 p-4 rounded-xl flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-3 h-3 animate-spin" /> Analyzing career data...
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-xs text-center">
            {error.message || "An error occurred with the AI connection."}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-900/80">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Describe your background..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button type="submit" disabled={isLoading} className="p-3 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
}
