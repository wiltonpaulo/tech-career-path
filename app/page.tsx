import React from 'react';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, LineChart, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 font-sans">
      <main className="relative z-10 container mx-auto px-6 pt-24 pb-32">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-24 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="p-2 bg-blue-600 rounded-lg shrink-0">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span>Tech Career Path <span className="text-blue-500 underline underline-offset-4 decoration-2">AI</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">National Interest</a>
            <a href="#" className="hover:text-white transition-colors">Architecture</a>
          </div>
          <Link href="/assessment" className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all">
            Login
          </Link>
        </nav>

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center relative">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-8">
            <Zap className="w-3 h-3" />
            <span>AI-Driven Future for US Tech Labor Market</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-white">
            Bridge the <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Skills Gap</span>. Secure Your Future.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Addressing the US national interest by leveraging AI to steer talent into high-demand tech sectors. Stop guessing. Start assessing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/assessment" className="group w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25">
              Start Free Assessment
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl font-bold transition-all">
              Watch Demo
            </button>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="mt-32 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
              title: "US Talent Alignment",
              description: "Designed to help students and professionals transition into roles critical to US National Interest."
            },
            {
              icon: <BrainCircuit className="w-6 h-6 text-blue-400" />,
              title: "Gemini Intelligence",
              description: "State-of-the-art Generative AI provides hyper-personalized career roadmaps and skill gap analysis."
            },
            {
              icon: <LineChart className="w-6 h-6 text-indigo-400" />,
              title: "Market Validation",
              description: "Data-driven insights matching your background with the highest vacancy tech roles in the USA."
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-2xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm hover:border-blue-500/30 transition-all group">
              <div className="mb-6 p-3 bg-slate-950 rounded-xl w-fit border border-slate-800 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="py-12 border-t border-slate-900 text-center text-slate-600 text-sm relative z-10">
        <p>&copy; 2024 Tech Career Path AI. All Rights Reserved.</p>
        <p className="mt-2 font-mono text-xs opacity-50 uppercase tracking-widest">Built for National Interest Excellence</p>
      </footer>
    </div>
  );
}
