import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  BrainCircuit, 
  Scale, 
  Cpu, 
  Database, 
  Layers, 
  Code2, 
  Sparkles,
  Search,
  ShieldCheck
} from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 flex flex-col">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
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
            <span>Technical <span className="text-blue-500">Methodology</span></span>
          </div>

          <Link href="/assessment">
            <Button className="bg-blue-600 hover:bg-blue-500 px-6 rounded-full font-bold text-xs uppercase tracking-tighter text-white border-none">
              Take Test
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex-1 pt-44 pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Section */}
          <section className="mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Scale className="w-3 h-3" />
              <span>Evidence-Based Alignment</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight italic text-white uppercase">
              The Architecture of <br />
              <span className="text-blue-500 underline decoration-blue-500/20 underline-offset-8">Aptitude Mapping.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl leading-relaxed font-medium">
              Our system replaces generic career counseling with a dual-layer diagnostic engine: a deterministic behavioral matrix and a generative AI synthesis layer.
            </p>
          </section>

          {/* Layer 1: The Matrix */}
          <section className="mb-32">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px flex-1 bg-slate-900" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Layer 01: Deterministic</span>
              <div className="h-px flex-1 bg-slate-900" />
            </div>

            <div className="grid md:grid-cols-[1fr_400px] gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-black text-white italic tracking-tight">The 30-Point Weighted Matrix</h3>
                <p className="text-slate-400 leading-relaxed">
                  Every user response is mapped against a high-dimensional vector space representing the **Top 20 IT Roles** in the US market. We don't just ask if you like code; we measure:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <Cpu className="w-4 h-4 text-blue-500" />, label: "Cognitive Load Pref." },
                    { icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, label: "Security Risk Mindset" },
                    { icon: <Layers className="w-4 h-4 text-indigo-500" />, label: "Architectural Logic" },
                    { icon: <Database className="w-4 h-4 text-orange-500" />, label: "Data Affinity Score" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                      {item.icon}
                      <span className="text-xs font-bold text-slate-300">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Card className="p-8 bg-slate-900/80 border-slate-800 shadow-2xl rounded-[32px] font-mono text-[10px] relative overflow-hidden">
                <div className="text-slate-500 mb-4 tracking-tighter">// Sample Scoring Algorithm</div>
                <div className="space-y-2">
                  <div className="text-blue-400">export const calculateResult = (answers) =&gt; &#123;</div>
                  <div className="pl-4 text-slate-300">const scores = &#123;&#125;;</div>
                  <div className="pl-4 text-slate-300">answers.forEach(ans =&gt; &#123;</div>
                  <div className="pl-8 text-indigo-400">ans.weights.forEach((area, val) =&gt; &#123;</div>
                  <div className="pl-12 text-slate-300">scores[area] += val * behavioralMultiplier;</div>
                  <div className="pl-8 text-indigo-400">&#125;);</div>
                  <div className="pl-4 text-slate-300">&#125;);</div>
                  <div className="pl-4 text-emerald-400">return sortTopMatches(scores).slice(0, 3);</div>
                  <div className="text-blue-400">&#125;</div>
                </div>
                <div className="absolute bottom-0 right-0 p-4 opacity-10">
                  <Code2 className="w-20 h-20 text-blue-500" />
                </div>
              </Card>
            </div>
          </section>

          {/* Layer 2: AI Synthesis */}
          <section className="mb-32">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px flex-1 bg-slate-900" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Layer 02: Generative</span>
              <div className="h-px flex-1 bg-slate-900" />
            </div>

            <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-[40px] p-10 md:p-16 relative overflow-hidden">
              <div className="max-w-3xl">
                <h3 className="text-3xl md:text-4xl font-black text-white italic mb-6 tracking-tight flex items-center gap-4 uppercase">
                  <Sparkles className="w-8 h-8 text-blue-500" /> AI Synthesis Layer
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed mb-8 font-medium">
                  Once the top roles are identified, we use **Gemini 2.5 Flash Lite** to bridge the gap between "Potential" and "Execution". The IA doesn't guess; it interprets the deterministic score to build:
                </p>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <span className="text-blue-400 font-bold uppercase text-[10px] tracking-widest">Market Context</span>
                    <p className="text-slate-400 text-sm italic">"Integrating real-time US labor demand, salary benchmarks, and local innovation hubs."</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-indigo-400 font-bold uppercase text-[10px] tracking-widest">Actionable Roadmaps</span>
                    <p className="text-slate-400 text-sm italic">"Converting technical requirements into a phased 6-month learning journey with verified resources."</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Accuracy CTA */}
          <section className="text-center p-12 bg-slate-900/30 border border-slate-900 rounded-[32px] backdrop-blur-sm">
            <h4 className="text-xl font-bold text-white mb-4">Ready to test the engine?</h4>
            <Link href="/assessment">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 px-10 h-14 rounded-2xl font-black text-lg shadow-2xl shadow-blue-500/20 active:scale-95 border-none">
                Begin Profile Analysis
              </Button>
            </Link>
          </section>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-900/50 text-center relative z-10">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest italic">
          Data Curated from US Dept. of Labor & American Tech Industry Standards
        </p>
      </footer>
    </div>
  );
}
