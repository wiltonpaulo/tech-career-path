'use client';

import React, { useState, useRef } from 'react';
import { ASSESSMENT_QUESTIONS } from '@/lib/assessment/questions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  BookOpen, 
  ExternalLink, 
  GraduationCap, 
  TrendingUp,
  Target,
  FileDown,
  Star,
  ShieldCheck,
  Rocket,
  FileText
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function StepperAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [phase, setPhase] = useState<'testing' | 'registration' | 'results' | 'error'>('testing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', currentRole: '' });
  const [finalReport, setFinalReport] = useState('');
  const [topMatches, setTopMatches] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('summary');
  
  const pdfCaptureRef = useRef<HTMLDivElement>(null);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progress = ((currentStep + 1) / totalQuestions) * 100;

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const nextStep = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setPhase('registration');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateResults = () => {
    const scores: Record<string, number> = {};
    ASSESSMENT_QUESTIONS.forEach((q) => {
      const idx = answers[q.id];
      if (idx !== undefined) {
        Object.entries(q.options[idx].weights).forEach(([area, weight]) => {
          scores[area] = (scores[area] || 0) + (weight as number);
        });
      }
    });
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([area]) => area);
  };

  const handleRegistration = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    const matches = calculateResults();
    setTopMatches(matches);

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, topMatches: matches }),
      });
      const data = await response.json();
      setFinalReport(data.report);
      setPhase('results');
    } catch (error) {
      console.error(error);
      setPhase('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateMultipagePdf = async () => {
    if (!pdfCaptureRef.current) return;
    setIsGeneratingPdf(true);
    
    const element = pdfCaptureRef.current;
    element.style.display = 'block';
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pages = element.querySelectorAll('.pdf-page');
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const canvas = await html2canvas(page, { 
          scale: 2, 
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
      
      pdf.save(`WPSTEC_Strategic_Roadmap_${userData.name || 'User'}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed", error);
    } finally {
      element.style.display = 'none';
      setIsGeneratingPdf(false);
    }
  };

  const tabs = [
    { id: 'summary', title: 'Executive Summary', icon: Sparkles, marker: '## 1.' },
    { id: 'skills', title: 'Technical Skills', icon: Target, marker: '## 2.' },
    { id: 'market', title: 'Market Outlook', icon: TrendingUp, marker: '## 3.' },
    { id: 'roadmap', title: 'Action Plan', icon: BookOpen, marker: '## 4.' },
    { id: 'project', title: 'Strategic Project', icon: Rocket, marker: '## 5.' },
    { id: 'resources', title: 'Resources', icon: GraduationCap, marker: '## 6.' },
  ];

  if (phase === 'registration') {
    return (
      <Card className="p-8 md:p-12 bg-slate-900 border-slate-800 max-w-xl mx-auto shadow-2xl rounded-[40px] text-white">
        <div className="text-center mb-10 text-white">
          <div className="p-4 bg-blue-600 rounded-3xl w-fit mx-auto mb-6 shadow-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter">Analysis Complete</h2>
          <p className="text-slate-400 text-sm mt-3 italic">Finalize your profile to generate your roadmap.</p>
        </div>
        <form onSubmit={handleRegistration} className="space-y-6">
          <Input required placeholder="Full Name" className="bg-slate-950 border-slate-700 h-12 rounded-xl text-white" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
          <Input required type="email" placeholder="E-mail" className="bg-slate-950 border-slate-700 h-12 rounded-xl text-white" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 h-14 text-base font-black shadow-lg shadow-blue-500/20 mt-4 rounded-2xl">
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Access Final Report"}
          </Button>
        </form>
      </Card>
    );
  }

  if (phase === 'results') {
    return (
      <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-1000 pb-32 px-4 relative">
        
        {/* SHADOW PDF CONTENT (MULTIPAGE) */}
        <div style={{ display: 'none', position: 'absolute', top: 0, left: 0, zIndex: -100 }} ref={pdfCaptureRef}>
          {/* COVER PAGE */}
          <div className="pdf-page bg-white p-20 text-slate-900 flex flex-col justify-between items-center text-center" style={{ width: '210mm', height: '297mm' }}>
            <div className="mt-20">
              <div className="bg-blue-600 p-6 rounded-[32px] w-fit mx-auto mb-10 shadow-2xl">
                <GraduationCap className="w-20 h-20 text-white" />
              </div>
              <h1 className="text-5xl font-black italic tracking-tighter text-slate-900 mb-4">STRATEGIC ROADMAP</h1>
              <p className="text-blue-600 font-bold text-xl uppercase tracking-widest underline underline-offset-8">US Technology Integration Profile</p>
            </div>
            <div className="space-y-4">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Prepared Exclusively For</p>
              <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter">{userData.name}</h2>
            </div>
            <div className="mb-10">
              <p className="text-slate-900 font-black text-lg">WPS Technology Services LLC • 2026</p>
              <p className="text-slate-400 text-[10px] font-mono mt-4 opacity-50">DOCUMENT ID: WPSTEC-{Math.floor(Math.random()*100000)}</p>
            </div>
          </div>

          {/* DYNAMIC PAGES */}
          {tabs.map((tab) => (
            <div key={tab.id} className="pdf-page bg-white p-20 text-slate-900" style={{ width: '210mm', height: '297mm' }}>
              <div className="border-b-2 border-slate-100 pb-6 mb-10 flex justify-between items-end">
                <h3 className="text-xl font-black text-blue-600 uppercase tracking-tight italic">{tab.title}</h3>
                <p className="text-slate-300 text-[8px] font-bold uppercase tracking-widest">{userData.name} • Confidential</p>
              </div>
              <div className="prose prose-slate max-w-none">
                {finalReport.split(tab.marker)[1]?.split('##')[0]?.split('\n').map((l, idx) => {
                  if (!l.trim()) return null;
                  if (l.includes('⭐')) {
                    const count = (l.match(/⭐/g) || []).length;
                    return <div key={idx} className="flex justify-between py-3 border-b border-slate-50 font-bold text-slate-700"><span>{l.split(':')[0].replace('- ', '')}</span><span className="text-blue-600">{'★'.repeat(count)}</span></div>;
                  }
                  return <p key={idx} className="text-base text-slate-600 leading-relaxed mb-4">{l.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
                })}
              </div>
            </div>
          ))}
        </div>

        {/* VISUAL HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900 border border-slate-800 p-8 rounded-[32px] mb-8 shadow-2xl relative backdrop-blur-md">
          <div className="flex items-center gap-6 text-white text-left">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-xl">
              <FileText className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter leading-none mb-1">{userData.name}</h1>
              <p className="text-blue-500 font-bold text-xs uppercase tracking-[0.2em] opacity-80">Integration Profile Analysis</p>
            </div>
          </div>
          <Button onClick={generateMultipagePdf} disabled={isGeneratingPdf} className="h-12 bg-blue-600 hover:bg-blue-500 text-white font-black px-10 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-xs">
            {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileDown className="w-4 h-4 mr-2" />}
            Generate Strategic PDF
          </Button>
        </div>

        {/* TABS NAVIGATION */}
        <div className="sticky top-24 z-40 mb-12 bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-1.5 rounded-[24px] shadow-2xl flex flex-wrap items-center justify-center gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-xl scale-[1.05]" 
                  : "text-slate-500 hover:text-white hover:bg-slate-900"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.title}
            </button>
          ))}
        </div>

        {/* VISIBLE CONTENT AREA (DARK MODE) */}
        <Card className="p-8 md:p-20 bg-slate-900/40 border-slate-800 shadow-2xl relative min-h-[600px] rounded-[56px] overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 opacity-50" />
          
          <div className="prose prose-invert prose-blue max-w-none text-left">
            {finalReport.split('\n').map((line, i) => {
              const currentTab = tabs.find(t => t.id === activeTab);
              
              // Header Rendering (Title Case)
              if (line.startsWith('## ')) {
                if (!line.startsWith(currentTab?.marker || '')) return null;
                return (
                  <div key={i} className="mb-12 border-b border-slate-800 pb-8 flex items-center gap-6 animate-in slide-in-from-left duration-500">
                    <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                      {React.createElement(currentTab?.icon || Sparkles, { className: "w-10 h-10 text-blue-500" })}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white italic m-0 tracking-tighter">
                      {line.replace(/## \d\./, '').trim()}
                    </h2>
                  </div>
                );
              }

              // Simple Tab-Content Mapping Logic
              const lines = finalReport.split('\n');
              let sectionId = '';
              for (let k = 0; k <= lines.indexOf(line); k++) {
                if (lines[k].startsWith('## ')) {
                  sectionId = tabs.find(t => lines[k].startsWith(t.marker))?.id || '';
                }
              }
              
              if (sectionId !== activeTab) return null;
              if (line.startsWith('# ') || line.startsWith('## ')) return null;

              if (line.includes('⭐')) {
                const [skillName, stars] = line.replace('- ', '').split(':');
                const starCount = (stars.match(/⭐/g) || []).length;
                return (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-950/50 border border-slate-800 rounded-[24px] mb-4 shadow-inner group hover:border-blue-500/30 transition-all">
                    <span className="text-lg font-bold text-slate-200">{skillName}</span>
                    <div className="flex gap-1.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-5 h-5 ${s <= starCount ? "text-yellow-500 fill-yellow-500" : "text-slate-800"}`} />
                      ))}
                    </div>
                  </div>
                );
              }

              if (line.trim() === '') return <div key={i} className="h-4" />;
              const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-black">$1</strong>');
              return (
                <p key={i} className="mb-8 leading-[1.8] text-slate-300 text-lg md:text-xl opacity-90 font-medium text-balance animate-in fade-in duration-700" dangerouslySetInnerHTML={{ __html: formattedLine }} />
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestion = ASSESSMENT_QUESTIONS[currentStep];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-4">
      <div className="px-2 text-white">
        <div className="flex justify-between items-end mb-4">
          <span className="text-[10px] font-black text-blue-500 tracking-[0.1em] uppercase">Aptitude Engine 2.0</span>
          <span className="text-[10px] font-black text-slate-600 tracking-widest italic">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-1.5 bg-slate-900 rounded-full" />
      </div>

      <Card className="p-8 md:p-12 bg-slate-900/60 border-slate-800 backdrop-blur-md min-h-[520px] flex flex-col justify-between shadow-2xl relative overflow-hidden rounded-[48px]">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-3xl -z-10" />
        <div className="flex-1 flex flex-col justify-center text-white">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mb-6 text-center opacity-60 italic">Behavioral DNA</span>
          <h2 className="text-xl md:text-3xl font-black text-white text-center mb-12 leading-tight px-4 text-balance italic tracking-tighter">{currentQuestion.text}</h2>
          <div className="grid gap-4 max-w-xl mx-auto w-full">
            {currentQuestion.options.map((option, idx) => (
              <button key={idx} onClick={() => handleOptionSelect(currentQuestion.id, idx)} className={`w-full text-left p-5 rounded-[24px] border-2 transition-all duration-300 ${answers[currentQuestion.id] === idx ? "bg-blue-600/10 border-blue-500 text-white shadow-[0_0_40px_rgba(59,130,246,0.15)] scale-[1.01]" : "bg-slate-950/40 border-slate-800/50 text-slate-500 hover:border-slate-700 hover:text-slate-300"}`}>
                <div className="flex items-center gap-5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${answers[currentQuestion.id] === idx ? "border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/50" : "border-slate-700"}`}>{answers[currentQuestion.id] === idx && <div className="w-1.5 h-1.5 bg-white rounded-full" />}</div>
                  <span className="font-bold text-sm md:text-base leading-tight tracking-tight">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-10 pt-8 border-t border-slate-800/50">
          <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0} className="text-slate-500 hover:text-white hover:bg-slate-800/50 rounded-2xl px-8 h-12 text-xs font-black uppercase tracking-widest leading-none"><ArrowLeft className="w-4 h-4 mr-2" /> Prev</Button>
          <Button onClick={nextStep} disabled={answers[currentQuestion.id] === undefined} className="bg-blue-600 hover:bg-blue-500 px-10 h-12 rounded-2xl text-xs font-black shadow-xl shadow-blue-500/20 uppercase tracking-[0.2em] transition-all active:scale-95 leading-none">
            {currentStep === totalQuestions - 1 ? "Finish Analysis" : "Next Step"} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
