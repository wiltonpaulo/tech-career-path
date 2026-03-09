import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  BrainCircuit, 
  Target, 
  ShieldCheck, 
  BarChart3, 
  Zap,
  Globe
} from 'lucide-react';

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 flex flex-col">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>

      {/* FIXED NAVIGATION HEADER */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </Link>
          
          <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white">
            <div className="p-2 bg-blue-600 rounded-xl">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span>Tech Path <span className="text-blue-500 italic">Vision</span></span>
          </div>

          <Link href="/assessment">
            <Button className="bg-blue-600 hover:bg-blue-500 px-6 rounded-full font-bold text-xs uppercase tracking-tighter text-white border-none">
              Start Test
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex-1 pt-44 pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Main Manifesto */}
          <section className="mb-32 text-center">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight italic">
              SOLVING THE <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent underline decoration-blue-500/20 underline-offset-8">US SKILLS GAP.</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium opacity-90">
              The United States faces an unprecedented shortage of high-skilled technical labor. Our mission is to accelerate professional integration into critical sectors by mapping innate cognitive potential to market demand.
            </p>
          </section>

          {/* Methodology: The DNA */}
          <section className="grid md:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
                <Target className="w-3 h-3" />
                <span>The Science of Aptitude</span>
              </div>
              <h2 className="text-4xl font-black text-white mb-6 italic tracking-tight">Our Weighted DNA Matrix</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Unlike simple tests, our engine uses a **30-point Behavioral Weighting Matrix**. Each interaction assesses cognitive leanings:
              </p>
              <ul className="space-y-4">
                {[
                  { title: "Risk Tolerance", desc: "Mapping security and compliance profiles." },
                  { title: "Architectural Logic", desc: "Identifying backend and infrastructure aptitude." },
                  { title: "Visual Synthesis", desc: "Recognizing frontend and UX/UI potential." },
                  { title: "Automation Mindset", desc: "The core of DevOps and Cloud Engineering." }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="p-1 bg-blue-600 rounded-md mt-1"><Zap className="w-3 h-3 text-white fill-current" /></div>
                    <div>
                      <span className="font-bold text-white block">{item.title}</span>
                      <span className="text-slate-500 text-sm">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="p-10 bg-slate-900 border-slate-800 shadow-3xl rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl group-hover:bg-blue-600/20 transition-all" />
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-black text-slate-500 uppercase">Algorithm Efficiency</span>
                  <span className="text-blue-500 font-bold">98.4%</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Data Processing</span>
                    <span>100%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-blue-600 animate-in slide-in-from-left duration-1000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Predictive Matching</span>
                    <span>92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-indigo-500 animate-in slide-in-from-left duration-1000 delay-300" />
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-tighter">
                    "Our goal is to turn potential into economic value for the American digital infrastructure."
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Impact Pillars */}
          <section className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Globe className="w-6 h-6" />, title: "Economic Impact", desc: "Directly addressing the 1.2M vacancy gap in US IT." },
              { icon: <ShieldCheck className="w-6 h-6" />, title: "Infrastructure", desc: "Steering talent toward national security and cloud roles." },
              { icon: <BarChart3 className="w-6 h-6" />, title: "Scalability", desc: "An automated pipeline for high-demand skill transition." }
            ].map((pillar, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-slate-900/50 border border-slate-800 text-center">
                <div className="mb-6 p-3 bg-slate-950 rounded-2xl w-fit mx-auto border border-slate-800 text-blue-500">{pillar.icon}</div>
                <h3 className="text-xl font-black mb-3 text-white">{pillar.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed opacity-80">{pillar.desc}</p>
              </div>
            ))}
          </section>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-900/50 text-center relative z-10 bg-slate-950/50 backdrop-blur-sm">
        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black italic">
          Empowering the American Technology Workforce • 2026
        </p>
      </footer>
    </div>
  );
}
