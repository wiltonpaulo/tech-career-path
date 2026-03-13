'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Loader2, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  LogOut,
  Sparkles,
  Zap,
  Mail,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserDashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const res = await fetch('/api/user/assessments');
        const data = await res.json();
        setAssessments(data);
      } else {
        setAssessments([]);
      }
      setIsLoading(false);
    };

    getData();

    // Adiciona listener para atualizar a tela automaticamente após login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) getData();
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(error.message);
      setIsLoggingIn(false);
    } else {
      // O listener onAuthStateChange cuidará da atualização da UI
    }
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full">
        <div className="mb-8 p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl inline-block">
          <Sparkles className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Welcome Back</h1>
        <p className="text-slate-400 mb-8 text-sm">Sign in to access your strategic roadmaps.</p>
        
        <Card className="w-full p-8 bg-slate-900/50 border-slate-800 backdrop-blur-sm rounded-[32px]">
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <Input required type="email" placeholder="name@company.com" className="bg-slate-950 border-slate-700 h-12 pl-12 rounded-xl text-white focus-visible:ring-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <Input required type="password" placeholder="••••••••" className="bg-slate-950 border-slate-700 h-12 pl-12 rounded-xl text-white focus-visible:ring-blue-500" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            
            {loginError && (
              <p className="text-red-400 text-xs font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center animate-in fade-in">{loginError}</p>
            )}

            <Button type="submit" disabled={isLoggingIn} className="w-full bg-blue-600 hover:bg-blue-500 h-14 text-sm font-black rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95">
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Dashboard"}
            </Button>
          </form>
        </Card>
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
