'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BrainCircuit, LineChart, ShieldCheck, Zap, Globe, Cpu, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BRAND_CONFIG } from '@/lib/config';
import { createClient } from '@/lib/supabase/client';

export default function Home() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  // Detecta se o usuário chegou via Magic Link com um ID de assessment
  // e redireciona para a página de resultado correta.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const assessmentId = params.get('id');
    
    if (assessmentId) {
      router.push(`/assessment?id=${assessmentId}`);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 font-sans flex flex-col">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* HERO SECTION */}
      <main className="relative z-10 flex-1 flex flex-col items-center pt-24 pb-32 px-6">
        <section className="max-w-5xl mx-auto text-center relative mb-24">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-10 mt-12">
            <Zap className="w-3 h-3 fill-current" />
            <span>Operational Excellence by {BRAND_CONFIG.shortCompany}</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-white italic">
            STEER YOUR <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent uppercase">Tech Career.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Aligning global talent with the rigorous standards of the US technical landscape through data-driven steering.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl shadow-indigo-500/25 active:scale-95 border-none uppercase">
                  My Dashboard
                  <LayoutDashboard className="w-6 h-6" />
                </Button>
              </Link>
            ) : (
              <Link href="/assessment" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-500/25 active:scale-95 border-none uppercase">
                  Take Free Test
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </Link>
            )}
            
            <Link href="/roles" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 px-10 bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 text-slate-200 rounded-2xl font-black text-lg transition-all active:scale-95 uppercase">
                Market Outlook
              </Button>
            </Link>
          </div>

          {!user && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              <p className="text-slate-500 text-sm font-medium">
                Already have an account? <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors font-bold uppercase tracking-wider underline decoration-blue-500/30 underline-offset-4">Sign In</Link>
              </p>
            </div>
          )}
        </section>

        {/* STATS SECTION */}
        <section className="grid md:grid-cols-3 gap-[1px] bg-slate-800/50 border border-slate-800 rounded-[40px] overflow-hidden max-w-6xl w-full mb-32 shadow-2xl">
          {[
            { label: "High-Demand Roles", value: "20+", icon: <Cpu className="w-5 h-5 text-blue-500" /> },
            { label: "Market Vacancies", value: "1.2M", icon: <Globe className="w-5 h-5 text-indigo-500" /> },
            { label: "Precision Matching", value: "98%", icon: <LineChart className="w-5 h-5 text-emerald-500" /> }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-950 p-10 flex flex-col items-center text-center group hover:bg-slate-900/30 transition-colors">
              <div className="mb-4 p-3 bg-slate-900 rounded-2xl border border-slate-800 group-hover:scale-110 transition-transform">{stat.icon}</div>
              <div className="text-4xl font-black text-white mb-1 tracking-tighter">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* FEATURES GRID */}
        <section id="vision" className="grid md:grid-cols-3 gap-8 max-w-7xl w-full">
          {[
            {
              icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
              title: "Security-by-Design",
              description: "Every career recommendation accounts for the rigorous compliance and security standards of the US market."
            },
            {
              icon: <BrainCircuit className="w-8 h-8 text-blue-400" />,
              title: "Operational Rigor",
              description: "Mapping cognitive DNA to roles that demand excellence in cloud, automation, and infrastructure resilience."
            },
            {
              icon: <LineChart className="w-8 h-8 text-indigo-400" />,
              title: "Integration Roadmap",
              description: "A phased professional integration plan designed by industry veterans to bridge critical skill gaps."
            }
          ].map((feature, i) => (
            <Card key={i} className="p-10 bg-slate-900/40 border-slate-800/50 backdrop-blur-md hover:border-blue-500/30 transition-all group rounded-[32px] flex flex-col justify-between shadow-xl">
              <div>
                <div className="mb-8 p-4 bg-slate-950 rounded-2xl w-fit border border-slate-800 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 italic tracking-tight text-white uppercase">{feature.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed font-medium opacity-90 text-left">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </section>
      </main>

      <footer className="py-12 border-t border-slate-900/50 text-center relative z-10 bg-slate-950/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2 px-6">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-400 text-xs mb-2 uppercase tracking-[0.3em]">
            <BrainCircuit className="w-4 h-4 text-blue-500" /> {BRAND_CONFIG.name}
          </div>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-medium">
            Developed by <span className="text-slate-300 font-black">{BRAND_CONFIG.author}</span> • {BRAND_CONFIG.company}
          </p>
          <p className="text-slate-600 text-[9px] uppercase tracking-widest mt-2 font-bold max-w-xl leading-relaxed">
            &copy; {BRAND_CONFIG.year} • {BRAND_CONFIG.tagline}
          </p>
        </div>
      </footer>
    </div>
  );
}
