'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  LogOut,
  Sparkles,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function UserDashboardPage() {
  const supabase = createClient();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const res = await fetch('/api/user/assessments');
        const data = await res.json();
        setAssessments(data);
      }
      setIsLoading(false);
    };

    getData();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4 text-white">Access Denied</h1>
        <p className="text-slate-400 mb-8">Please sign in to view your dashboard.</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-500 rounded-2xl px-8 h-14 font-black">
          <Link href="/assessment">Start Assessment</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="text-left">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Strategic Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-white">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">Roadmaps</span>
            </h1>
            <p className="text-slate-500 text-sm mt-3 font-medium">History of your technical career evolutions.</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="bg-slate-900 border-slate-800 text-slate-400 hover:text-white rounded-2xl h-12 px-6">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>

        {/* Content */}
        <div className="grid gap-6">
          {assessments.length === 0 ? (
            <Card className="p-12 bg-slate-900/30 border-slate-800 border-dashed rounded-[48px] text-center">
              <Zap className="w-12 h-12 text-slate-700 mx-auto mb-6" />
              <h2 className="text-xl font-bold text-slate-400 italic">No reports found yet.</h2>
              <p className="text-slate-600 text-sm mt-2 mb-8">Start your first assessment to unlock your personalized roadmap.</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-500 rounded-2xl px-8 h-14 font-black shadow-xl shadow-blue-500/20">
                <Link href="/assessment">Launch Analysis</Link>
              </Button>
            </Card>
          ) : (
            assessments.map((a) => (
              <Card key={a.id} className="bg-slate-900/40 border-slate-800 p-6 md:p-10 rounded-[40px] hover:border-blue-500/30 transition-all group overflow-hidden relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 text-left">
                  <div className="flex items-center gap-6">
                    <div className={`p-5 rounded-3xl border ${a.status === 'COMPLETED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500 animate-pulse'}`}>
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {a.topMatches?.map((m: string, i: number) => (
                          <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">{m}</span>
                        ))}
                      </div>
                      <h3 className="text-xl md:text-2xl font-black italic tracking-tighter text-white uppercase">{new Date(a.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        {a.status === 'COMPLETED' ? (
                          <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold uppercase tracking-widest"><CheckCircle2 className="w-3 h-3" /> Ready to View</span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[10px] text-blue-500 font-bold uppercase tracking-widest"><Clock className="w-3 h-3" /> AI Processing...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button asChild disabled={a.status !== 'COMPLETED'} className={`rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-[10px] transition-all shadow-xl ${a.status === 'COMPLETED' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/10' : 'bg-slate-800 text-slate-600 cursor-not-allowed grayscale'}`}>
                    {a.status === 'COMPLETED' ? (
                      <Link href={`/assessment?id=${a.id}`}>
                        Open Report <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    ) : (
                      <span>Processing</span>
                    )}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
