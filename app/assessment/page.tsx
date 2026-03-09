import React from 'react';
import Link from 'next/link';
import { AssessmentChat } from '@/components/features/assessment-chat';
import { ChevronLeft, Info } from 'lucide-react';

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 container mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
            <Info className="w-3.5 h-3.5" />
            Vetted for NIW Proposed Endeavor
          </div>
        </div>

        {/* Title Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            Career <span className="text-blue-500">Impact</span> Analysis
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Our AI engine will now analyze your professional profile against current US technical labor shortages. Be specific about your technology stack and architectural experience.
          </p>
        </div>

        {/* Chat Component */}
        <AssessmentChat />

        {/* Footer Info */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-[11px] text-slate-600 leading-relaxed uppercase tracking-widest font-medium">
            Strict adherence to US National Interest (NI) criteria for STEM sectors. 
            No sensitive personal data is stored beyond the session.
          </p>
        </div>
      </main>
    </div>
  );
}
