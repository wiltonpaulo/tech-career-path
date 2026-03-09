import React from 'react';
import Link from 'next/link';
import { StepperAssessment } from '@/components/features/stepper-assessment';
import { ChevronLeft, ShieldCheck, BrainCircuit } from 'lucide-react';

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Fixed Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="p-1.5 bg-blue-600 rounded-lg shrink-0">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="hidden xs:inline">Tech Path <span className="text-blue-500">AI</span></span>
          </div>

          <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-tight">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Assessment
          </div>
        </div>
      </nav>

      {/* Main Content Area - Centered and Fixed Height container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-12 overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          {/* Title Section - Minimalized to keep focus on form */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
              Career <span className="text-blue-500">Aptitude</span> Analysis
            </h1>
            <p className="text-slate-500 text-sm">
              Discover your ideal role in the US technology market.
            </p>
          </div>

          {/* Stepper Component */}
          <StepperAssessment />
        </div>
      </main>

      {/* Mini Footer */}
      <footer className="relative z-10 py-4 border-t border-slate-900/50 text-center">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
          Data-driven engine • STEM Shortage Analysis
        </p>
      </footer>
    </div>
  );
}
