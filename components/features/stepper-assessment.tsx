'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
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
  GraduationCap, 
  Target,
  FileDown,
  Star,
  ShieldCheck,
  Rocket,
  Briefcase,
  Zap,
  Github,
  Mail,
  Lock,
  User as UserIcon,
  BrainCircuit
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function StepperAssessment() {
  const supabase = createClient();
  const [session, setSession] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [phase, setPhase] = useState<'testing' | 'registration' | 'processing' | 'results' | 'error'>('testing');
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', currentRole: '' });
  const [finalReport, setFinalReport] = useState('');
  const [topMatches, setTopMatches] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('summary');

  const pdfCaptureRef = useRef<HTMLDivElement>(null);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progress = ((currentStep + 1) / totalQuestions) * 100;

  const tabs = [
    { id: 'summary', title: 'Executive Summary', icon: Sparkles, marker: '## 1.' },
    { id: 'matrix', title: 'Match Matrix', icon: Target, marker: '## 2.' },
    { id: 'skills', title: 'Skills Gap', icon: ShieldCheck, marker: '## 3.' },
    { id: 'quickstart', title: '48h Quick Start', icon: Zap, marker: '## 4.' },
    { id: 'roadmap', title: '6-Month Roadmap', icon: BookOpen, marker: '## 5.' },
    { id: 'project', title: 'Strategic Project', icon: Rocket, marker: '## 6.' },
    { id: 'resources', title: 'Resources', icon: GraduationCap, marker: '## 7.' },
    { id: 'advice', title: 'Final Advice', icon: Sparkles, marker: '## 8.' },
  ];

  // 1. RECUPERAR ESTADO DO LOCALSTORAGE AO MONTAR
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setAssessmentId(id);
      setPhase('processing');
      startPolling(id);
      return;
    }

    const savedAnswers = localStorage.getItem('assessment_answers');
    const savedStep = localStorage.getItem('assessment_step');
    const savedPhase = localStorage.getItem('assessment_phase');
    const savedUserData = localStorage.getItem('assessment_user_data');

    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedStep) setCurrentStep(parseInt(savedStep));
    if (savedPhase && savedPhase !== 'testing') setPhase(savedPhase as any);
    if (savedUserData) setUserData(JSON.parse(savedUserData));
  }, []);

  // 2. SALVAR ESTADO NO LOCALSTORAGE SEMPRE QUE MUDAR
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('assessment_answers', JSON.stringify(answers));
      localStorage.setItem('assessment_step', currentStep.toString());
      localStorage.setItem('assessment_phase', phase);
      localStorage.setItem('assessment_user_data', JSON.stringify(userData));
    }
  }, [answers, currentStep, phase, userData]);

  // Monitorar Sessão do Supabase
  useEffect(() => {
    const getSession = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (s?.user) {
        setUserData(prev => ({
          ...prev,
          name: s.user.user_metadata.full_name || s.user.email?.split('@')[0] || prev.name,
          email: s.user.email || prev.email,
        }));
      }
    };
    getSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        setUserData(prev => ({
          ...prev,
          name: s.user.user_metadata.full_name || s.user.email?.split('@')[0] || prev.name,
          email: s.user.email || prev.email,
        }));
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const reportSections = useMemo(() => {
    if (!finalReport) return {};
    const sections: Record<string, string[]> = {};
    const lines = finalReport.split('\n');
    let currentSectionId = 'summary';
    lines.forEach(line => {
      const foundTab = tabs.find(t => line.trim().startsWith(t.marker));
      if (foundTab) {
        currentSectionId = foundTab.id;
        sections[currentSectionId] = [];
      } else {
        if (!sections[currentSectionId]) sections[currentSectionId] = [];
        sections[currentSectionId].push(line);
      }
    });
    return sections;
  }, [finalReport]);

  const startPolling = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/assessment/status?id=${id}`);
        const data = await res.json();
        if (data.status === 'COMPLETED' && data.report) {
          clearInterval(interval);
          setFinalReport(data.report);
          setPhase('results');
          localStorage.removeItem('assessment_answers'); 
        } else if (data.status === 'FAILED') {
          clearInterval(interval);
          setPhase('error');
        }
      } catch (err) { console.error(err); }
    }, 4000);
  };

  const handleOptionSelect = (qId: number, idx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: idx }));
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
    return Object.entries(scores).sort(([, a], [, b]) => b - a).slice(0, 3).map(([area]) => area);
  };

  const handleRegistration = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    const matches = calculateResults();
    setTopMatches(matches);
    try {
      const response = await fetch('/api/assessment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, answers, topMatches: matches }),
      });
      const data = await response.json();
      if (data.success) {
        setAssessmentId(data.assessmentId);
        setPhase('processing');
        startPolling(data.assessmentId);
      } else { setPhase('error'); }
    } catch (error) { setPhase('error'); } finally { setIsSubmitting(false); }
  };

  // EFEITO PARA AUTO-SUBMISSÃO APÓS LOGIN/VALIDAÇÃO DE EMAIL
  // Se o usuário voltar do fluxo de email e já tivermos as respostas no LocalStorage,
  // submetemos automaticamente.
  useEffect(() => {
    const hasAnswers = Object.keys(answers).length > 0;
    const isRegistrationPhase = phase === 'registration';
    const isLoggedIn = !!session?.user;
    
    if (isLoggedIn && isRegistrationPhase && hasAnswers && !assessmentId && !isSubmitting) {
      handleRegistration();
    }
  }, [session, phase, answers, assessmentId]); // Dependências controladas para evitar loop

  const handleGithubLogin = async () => {
    localStorage.setItem('assessment_phase', 'registration');
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.href }
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // 1. ESTRATÉGIA SAVE-FIRST:
    // Salvamos as respostas no banco ANTES de iniciar o fluxo de Auth.
    // Isso garante que temos um ID persistente para passar no link.
    let savedAssessmentId: string | null = null;

    try {
      const matches = calculateResults();
      setTopMatches(matches);

      // Salva o rascunho no banco
      const saveResponse = await fetch('/api/assessment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, email, answers, topMatches: matches }),
      });
      
      const saveData = await saveResponse.json();
      if (saveData.success && saveData.assessmentId) {
        savedAssessmentId = saveData.assessmentId;
        setAssessmentId(savedAssessmentId);
      }

      if (authMode === 'signup') {
        // Constrói a URL de retorno mantendo a página atual e adicionando o ID
        const redirectUrl = new URL(window.location.href);
        if (savedAssessmentId) {
          redirectUrl.searchParams.set('id', savedAssessmentId);
        }

        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: userData.name },
            emailRedirectTo: redirectUrl.toString()
          }
        });
        if (err) throw err;
        alert("Verification email sent! Confirm it to see your results.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        
        // Se for login normal (senha) e já salvamos, vamos direto para o processamento
        if (savedAssessmentId) {
          setPhase('processing');
          startPolling(savedAssessmentId);
        }
      }
    } catch (err: any) { setError(err.message); } finally { setIsSubmitting(false); }
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
        const canvas = await html2canvas(page, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
      pdf.save(`WPSTEC_Strategic_Report_${userData.name || 'Professional'}.pdf`);
    } catch (error) { console.error(error); } finally { element.style.display = 'none'; setIsGeneratingPdf(false); }
  };

  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
  const nextStep = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setPhase('registration');
    }
  };

  if (phase === 'registration') {
    const isLogged = !!session;
    return (
      <Card className="p-8 md:p-12 bg-slate-900 border-slate-800 max-w-xl mx-auto shadow-2xl rounded-[40px] text-white">
        <div className="text-center mb-10 text-white text-left">
          <div className="p-4 bg-blue-600 rounded-3xl w-fit mx-auto mb-6 shadow-xl shadow-blue-500/20"><CheckCircle2 className="w-8 h-8" /></div>
          <h2 className="text-3xl font-black italic tracking-tighter leading-none uppercase text-white">Analysis Complete</h2>
          <p className="text-slate-400 text-sm mt-3 italic">{isLogged ? "Finalize your profile to generate your roadmap." : "Sign in to save your results and access the roadmap."}</p>
        </div>
        {!isLogged ? (
          <div className="space-y-6">
            <Button onClick={handleGithubLogin} className="w-full bg-white hover:bg-slate-200 text-slate-900 h-14 text-base font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"><Github className="w-6 h-6" /> Continue with GitHub</Button>
            <div className="relative py-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div><div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-slate-900 px-4 text-slate-500">Or use email</span></div></div>
            <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
              {authMode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Full Name</label>
                  <div className="relative"><UserIcon className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" /><Input required placeholder="Wilton Paulo" className="bg-slate-950 border-slate-700 h-12 pl-12 rounded-xl text-white" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} /></div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Email Address</label>
                <div className="relative"><Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" /><Input required type="email" placeholder="wilton@wpstec.com" className="bg-slate-950 border-slate-700 h-12 pl-12 rounded-xl text-white" value={email} onChange={(e) => { setEmail(e.target.value); setUserData({...userData, email: e.target.value}); }} /></div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Password</label>
                <div className="relative"><Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" /><Input required type="password" placeholder="••••••••" className="bg-slate-950 border-slate-700 h-12 pl-12 rounded-xl text-white" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              </div>
              {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
              <Button type="submit" disabled={isSubmitting} className="w-full bg-slate-800 hover:bg-slate-700 h-14 text-sm font-black mt-2 rounded-2xl">{isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (authMode === 'signup' ? "Create Account" : "Sign In")}</Button>
              <button type="button" onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')} className="w-full text-[10px] text-slate-500 hover:text-blue-400 font-bold uppercase tracking-widest transition-colors">{authMode === 'signup' ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}</button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleRegistration} className="space-y-6 text-left">
            <div className="space-y-2 opacity-50"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Full Name</label><Input disabled className="bg-slate-950 border-slate-700 h-12 rounded-xl text-white cursor-not-allowed" value={userData.name} /></div>
            <div className="space-y-2 opacity-50"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Work E-mail</label><Input disabled className="bg-slate-950 border-slate-700 h-12 rounded-xl text-white cursor-not-allowed" value={userData.email} /></div>
            <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Current Background</label><Input required placeholder="Ex: Sales..." className="bg-slate-950 border-slate-700 h-12 rounded-xl text-white" value={userData.currentRole} onChange={(e) => setUserData({...userData, currentRole: e.target.value})} /></div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 h-14 text-base font-black shadow-lg shadow-blue-500/20 mt-4 rounded-2xl">{isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Access Final Report"}</Button>
          </form>
        )}
      </Card>
    );
  }

  if (phase === 'processing') {
    return (
      <Card className="p-8 md:p-12 bg-slate-900 border-slate-800 max-w-xl mx-auto shadow-2xl rounded-[40px] text-white text-center">
        <div className="relative w-32 h-32 mx-auto mb-10"><div className="absolute inset-0 bg-blue-600/20 rounded-full animate-ping" /><div className="relative p-8 bg-blue-600 rounded-full shadow-2xl shadow-blue-500/40"><Sparkles className="w-12 h-12 text-white animate-pulse" /></div></div>
        <h2 className="text-3xl font-black italic tracking-tighter leading-none uppercase mb-4 text-white">Generating Your Report</h2>
        <p className="text-slate-400 text-sm mb-8 italic">Our IA is analyzing your DNA. This usually takes 30-60 seconds.</p>
        <div className="space-y-4 bg-slate-950/50 p-6 rounded-3xl border border-slate-800 text-left">
          <div className="flex items-center gap-3"><Loader2 className="w-4 h-4 text-blue-500 animate-spin" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Strategy Matrix Generation</span></div>
          <div className="flex items-center gap-3 opacity-50"><Target className="w-4 h-4 text-slate-500" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Market Alignment Check</span></div>
          <div className="flex items-center gap-3 opacity-50"><Rocket className="w-4 h-4 text-slate-500" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Roadmap Customization</span></div>
        </div>
      </Card>
    );
  }

  if (phase === 'results') {
    const currentLines = reportSections[activeTab] || [];
    return (
      <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-1000 pb-32 px-4 flex flex-col lg:flex-row gap-8 text-left">
        <aside className="w-full lg:w-80 shrink-0"><Card className="bg-slate-900 border-slate-800 p-6 rounded-[32px] sticky top-24 shadow-2xl"><div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6"><div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20"><Briefcase className="w-6 h-6 text-white" /></div><div><h3 className="text-lg font-black text-white italic tracking-tighter leading-none uppercase">{userData.name}</h3><p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Market DNA v2.5</p></div></div><nav className="flex flex-col gap-2">{tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? "bg-blue-600 text-white shadow-xl scale-[1.02]" : "text-slate-500 hover:text-white hover:bg-slate-800"}`}><tab.icon className="w-4 h-4" />{tab.title}</button>))}</nav><Button onClick={generateMultipagePdf} disabled={isGeneratingPdf} className="w-full mt-8 h-12 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-2xl transition-all active:scale-95 uppercase tracking-widest text-[9px]">{isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileDown className="w-4 h-4 mr-2" />} Export Report</Button></Card></aside>
        <main className="flex-1 min-w-0"><Card className="p-8 md:p-16 bg-slate-900/40 border-slate-800 shadow-2xl relative min-h-[700px] rounded-[48px] overflow-hidden backdrop-blur-sm"><div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 opacity-50" /><div className="prose prose-invert max-w-none text-left"><div className="mb-12 border-b border-slate-800 pb-8 flex items-center gap-6 animate-in slide-in-from-left duration-500"><div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20">{React.createElement(tabs.find(t => t.id === activeTab)?.icon || Sparkles, { className: "w-10 h-10 text-blue-500" })}</div><h2 className="text-3xl md:text-5xl font-black text-white italic m-0 tracking-tighter uppercase leading-none">{tabs.find(t => t.id === activeTab)?.title}</h2></div><div className="space-y-6">
          {currentLines.map((line, i) => {
            if (line.trim() === '') return <div key={i} className="h-2" />;
            if (line.includes('|') && line.includes('---')) return null;
            if (line.includes('|')) return <div key={i} className="overflow-x-auto my-4 bg-slate-950/30 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-400 whitespace-pre">{line}</div>;
            if (line.includes('⭐')) {
              const starCount = (line.match(/⭐/g) || []).length;
              return (<div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-slate-950/50 border border-slate-800 rounded-[24px] mb-4 shadow-inner group hover:border-blue-500/30 transition-all scale-in-center"><div className="flex flex-col gap-1"><span className="text-lg font-bold text-slate-200 italic">{line.replace('- ', '').split(':')[0]}</span></div><div className="flex gap-1.5 mt-4 sm:mt-0">{[1,2,3,4,5].map((s) => (<Star key={s} className={`w-5 h-5 ${s <= starCount ? "text-yellow-500 fill-yellow-500" : "text-slate-800"}`} />))}</div></div>);
            }
            const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-black">$1</strong>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target=\"_blank\" class=\"text-blue-400 underline hover:text-blue-300 transition-colors\">$1</a>');
            return <p key={i} className="leading-[1.8] text-slate-300 text-sm md:text-base opacity-90 font-medium text-balance animate-in fade-in" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
          })}
        </div></div></Card></main>
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}><div ref={pdfCaptureRef} className="bg-white p-0 text-slate-900">
          {tabs.map((tab, pageIdx) => (<div key={tab.id} className="pdf-page w-[210mm] min-h-[297mm] p-20 bg-white text-slate-900 flex flex-col relative overflow-hidden"><div className="flex justify-between items-start mb-12"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"><BrainCircuit className="w-6 h-6 text-white" /></div><div className="font-black text-xl italic tracking-tighter uppercase text-slate-900">WPSTEC <span className="text-blue-600">PATH</span></div></div><div className="text-right"><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidential Strategy Report</div><div className="text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-1">Version 2.5 • US Market DNA</div></div></div><div className="mb-8 flex items-center gap-4"><tab.icon className="w-8 h-8 text-blue-600" /><h2 className="text-3xl font-black italic tracking-tighter uppercase m-0 text-slate-900">{tab.title}</h2></div><div className="flex-1 text-sm leading-relaxed text-slate-600 space-y-4">{(reportSections[tab.id] || []).map((line, i) => (<p key={i} className="m-0 text-slate-700 text-left">{line.replace(/\*\*/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1')}</p>))}</div><div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center"><div className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">© 2026 WPS Technology Services LLC • Strategic Career Alignment</div><div className="text-[8px] font-black text-blue-600 uppercase tracking-widest italic">Page {pageIdx + 1} of {tabs.length}</div></div></div>))}
        </div></div>
      </div>
    );
  }

  const currentQuestion = ASSESSMENT_QUESTIONS[currentStep];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-4 text-left">
      <div className="px-2 text-white text-left">
        <div className="flex justify-between items-end mb-4 text-white">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.1em]">WPSTEC Engine v2.5</span>
          <span className="text-[10px] font-black text-slate-600 tracking-widest italic">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-1 bg-slate-900 rounded-full" />
      </div>

      <Card className="p-8 md:p-12 bg-slate-900/60 border-slate-800 backdrop-blur-md min-h-[520px] flex flex-col justify-between shadow-2xl relative overflow-hidden rounded-[48px]">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-3xl -z-10" />
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mb-6 text-center opacity-60 italic tracking-widest uppercase leading-none">Cognitive Matrix</span>
          <h2 className="text-xl md:text-3xl font-black text-white text-center mb-12 leading-tight px-4 text-balance italic tracking-tighter">{currentQuestion.text}</h2>
          <div className="grid gap-4 max-w-xl mx-auto w-full">
            {currentQuestion.options.map((option, idx) => (
              <button key={idx} onClick={() => handleOptionSelect(currentQuestion.id, idx)} className={`w-full text-left p-5 rounded-[24px] border-2 transition-all duration-300 ${answers[currentQuestion.id] === idx ? "bg-blue-600/10 border-blue-500 text-white shadow-[0_0_40px_rgba(59,130,246,0.15)] scale-[1.01]" : "bg-slate-950/40 border-slate-800/50 text-slate-500 hover:border-slate-700 hover:text-slate-300"}`}>
                <div className="flex items-center gap-5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${answers[currentQuestion.id] === idx ? "border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/50" : "border-slate-700"}`}>{answers[currentQuestion.id] === idx && <div className="w-1.5 h-1.5 bg-white rounded-full" />}</div>
                  <span className="font-bold text-sm md:text-base leading-tight tracking-tight text-white">{option.label}</span>
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
