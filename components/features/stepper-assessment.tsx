'use client';

import React, { useState, useEffect } from 'react';
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
  Download,
  ListIcon,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';

export function StepperAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [phase, setPhase] = useState<'testing' | 'registration' | 'results' | 'error'>('testing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', currentRole: '' });
  const [finalReport, setFinalReport] = useState('');
  const [topMatches, setTopMatches] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState('summary');
  const [errorMessage, setErrorMessage] = useState('');

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
    setErrorMessage('');
    
    const matches = topMatches.length > 0 ? topMatches : calculateResults();
    if (topMatches.length === 0) setTopMatches(matches);

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, topMatches: matches }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'The strategic advisor is currently unavailable.');
        setPhase('error');
        return;
      }

      setFinalReport(data.report);
      setPhase('results');
    } catch (error) {
      console.error(error);
      setErrorMessage('A connection error occurred. Please check your internet and try again.');
      setPhase('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const sections = [
    { id: 'summary', title: 'Executive Summary', icon: Sparkles },
    { id: 'market', title: 'Market Outlook', icon: TrendingUp },
    { id: 'gaps', title: 'Skill Gaps', icon: Target },
    { id: 'roadmap', title: '6-Month Roadmap', icon: BookOpen },
    { id: 'resources', title: 'Resources', icon: GraduationCap },
  ];

  if (phase === 'error') {
    return (
      <Card className="p-10 bg-slate-900/80 border-red-500/20 max-w-xl mx-auto backdrop-blur-md animate-in zoom-in-95 duration-300 shadow-2xl text-center">
        <div className="p-4 bg-red-500/10 rounded-full w-fit mx-auto mb-6 border border-red-500/20">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-4 italic tracking-tight">System at Peak Capacity</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          {errorMessage}
        </p>
        <Button 
          onClick={() => handleRegistration()} 
          className="w-full bg-blue-600 hover:bg-blue-500 h-12 font-bold"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
          Retry Generation
        </Button>
        <p className="mt-4 text-[10px] text-slate-600 uppercase font-bold tracking-widest">Your progress has been saved</p>
      </Card>
    );
  }

  if (phase === 'registration') {
    return (
      <Card className="p-8 md:p-10 bg-slate-900/80 border-slate-800 max-w-xl mx-auto backdrop-blur-md animate-in zoom-in-95 duration-300 shadow-2xl">
        <div className="text-center mb-8">
          <div className="p-3 bg-blue-600 rounded-2xl w-fit mx-auto mb-4 shadow-xl shadow-blue-500/20">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">Build Your Report</h2>
          <p className="text-slate-400 text-sm italic">Unlock your personalized strategic roadmap.</p>
        </div>
        <form onSubmit={handleRegistration} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider ml-1">Full Name</label>
            <Input required placeholder="John Smith" className="bg-slate-950/50 border-slate-700 h-12 text-white focus:border-blue-500" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider ml-1">E-mail</label>
            <Input required type="email" placeholder="john@example.com" className="bg-slate-950/50 border-slate-700 h-12 text-white focus:border-blue-500" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider ml-1">Current Profession</label>
            <Input placeholder="Ex: Student or Sales Executive" className="bg-slate-950/50 border-slate-700 h-12 text-white focus:border-blue-500" value={userData.currentRole} onChange={(e) => setUserData({...userData, currentRole: e.target.value})} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 h-14 text-lg font-bold shadow-lg shadow-blue-500/20 mt-4 transition-all">
            {isSubmitting ? <div className="flex items-center gap-3"><Loader2 className="w-5 h-5 animate-spin" /><span>Generating Strategy...</span></div> : "Generate Final Analysis"}
          </Button>
        </form>
      </Card>
    );
  }

  if (phase === 'results') {
    return (
      <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-700 pb-20 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm mb-12 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white leading-none mb-1">{userData.name.toUpperCase()}</h1>
              <p className="text-blue-500 font-bold text-[10px] uppercase tracking-widest text-wrap opacity-80">Strategic Career Integration Report</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex gap-3 mr-4">
                {topMatches.map((m, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-400 rounded-full tracking-tight">#{m}</span>
                ))}
             </div>
            <Button onClick={() => window.print()} variant="outline" className="h-10 border-slate-700 bg-slate-950/50 text-slate-300 hover:text-white rounded-xl shadow-lg">
              <Download className="w-4 h-4 mr-2" /> PDF
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start px-2">
          <aside className="w-full lg:w-72 lg:sticky lg:top-28 shrink-0 space-y-6">
            <div className="bg-slate-950/40 backdrop-blur-md rounded-3xl p-2 border border-slate-800/50 shadow-2xl">
              <div className="flex items-center gap-2 mb-2 p-4 pb-2">
                <ListIcon className="w-4 h-4 text-slate-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">Index</span>
              </div>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      activeSection === sec.id 
                        ? "bg-blue-600 text-white shadow-[0_10px_20px_rgba(59,130,246,0.2)]" 
                        : "text-slate-500 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <sec.icon className={`w-4 h-4 ${activeSection === sec.id ? "text-white" : "text-slate-600"}`} />
                    {sec.title}
                  </button>
                ))}
              </nav>
            </div>

            <Card className="hidden lg:block p-6 bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/20 rounded-3xl shadow-xl">
              <p className="text-[10px] text-blue-400 font-bold uppercase mb-4 tracking-tighter opacity-80">Aptitude Ranking</p>
              <div className="space-y-4">
                {topMatches.map((m, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <span className="text-[11px] font-black text-white group-hover:text-blue-400 transition-colors">{m}</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(dot => (
                        <div key={dot} className={`w-1 h-1 rounded-full ${dot <= (5-i) ? "bg-blue-500" : "bg-slate-800"}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </aside>

          <Card className="flex-1 p-8 md:p-20 bg-slate-900/30 border-slate-800 shadow-2xl relative min-h-screen rounded-[40px] overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />
            
            <div className="prose prose-invert prose-blue max-w-none text-slate-300">
              {finalReport.split('\n').map((line, i) => {
                let sectionId = "";
                if (line.startsWith('## 1.')) sectionId = "summary";
                if (line.startsWith('## 2.')) sectionId = "market";
                if (line.startsWith('## 3.')) sectionId = "gaps";
                if (line.startsWith('## 4.')) sectionId = "roadmap";
                if (line.startsWith('## 5.')) sectionId = "resources";

                if (sectionId) {
                  return (
                    <div key={i} id={sectionId} className="pt-16 mb-10 border-b border-slate-800 pb-6 first:pt-0">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                          {React.createElement(sections.find(s => s.id === sectionId)?.icon || Sparkles, { className: "w-6 h-6 text-blue-500" })}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter m-0 italic">
                          {line.replace(/## \d\./, '').trim()}
                        </h2>
                      </div>
                    </div>
                  );
                }

                if (line.startsWith('# ')) return null;

                const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-black">$1</strong>');
                const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
                
                if (linkMatch) {
                  return (
                    <div key={i} className="my-6">
                      <a href={linkMatch[2]} target="_blank" className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 no-underline hover:scale-105 active:scale-95">
                        <ExternalLink className="w-4 h-4" /> {linkMatch[1]}
                      </a>
                    </div>
                  );
                }

                if (line.trim() === '') return <div key={i} className="h-4" />;

                return (
                  <p key={i} className="mb-6 leading-relaxed text-slate-300 text-base md:text-lg opacity-90" dangerouslySetInnerHTML={{ __html: formattedLine }} />
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = ASSESSMENT_QUESTIONS[currentStep];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 px-4">
      <div className="px-2">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Question {currentStep + 1} / {totalQuestions}</span>
          <span className="text-[10px] font-black text-slate-600 tracking-tighter uppercase">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-1 bg-slate-900" />
      </div>

      <Card className="p-6 md:p-8 bg-slate-900/60 border-slate-800 backdrop-blur-md min-h-[520px] max-h-[520px] flex flex-col justify-between shadow-2xl relative overflow-hidden rounded-[32px]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -z-10" />
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-3 text-center opacity-60">{currentQuestion.category}</span>
          <h2 className="text-xl md:text-2xl font-extrabold text-white text-center mb-6 leading-tight px-2 text-balance italic tracking-tight">{currentQuestion.text}</h2>
          <div className="grid gap-3 max-w-xl mx-auto w-full">
            {currentQuestion.options.map((option, idx) => (
              <button key={idx} onClick={() => handleOptionSelect(currentQuestion.id, idx)} className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 ${answers[currentQuestion.id] === idx ? "bg-blue-600/10 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] scale-[1.01]" : "bg-slate-950/40 border-slate-800/50 text-slate-400 hover:border-slate-700 hover:text-slate-200"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${answers[currentQuestion.id] === idx ? "border-blue-500 bg-blue-500" : "border-slate-700"}`}>{answers[currentQuestion.id] === idx && <div className="w-1.5 h-1.5 bg-white rounded-full" />}</div>
                  <span className="font-semibold text-sm md:text-base leading-snug">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/50">
          <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0} className="text-slate-500 hover:text-white hover:bg-slate-800/50 rounded-xl px-6 h-10 text-xs"><ArrowLeft className="w-4 h-4 mr-2" />Prev</Button>
          <Button onClick={nextStep} disabled={answers[currentQuestion.id] === undefined} className="bg-blue-600 hover:bg-blue-500 px-8 h-11 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20">{currentStep === totalQuestions - 1 ? "Build My Report" : "Next Step"}<ArrowRight className="w-4 h-4 ml-2" /></Button>
        </div>
      </Card>
    </div>
  );
}
