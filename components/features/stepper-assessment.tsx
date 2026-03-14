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
} from 'lucide-react';
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
  const [phase, setPhase] = useState<'testing' | 'registration' | 'email_sent' | 'processing' | 'results' | 'error'>('testing');
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', currentRole: '' });
  const [finalReport, setFinalReport] = useState('');
  const [topMatches, setTopMatches] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('breakdown');

  // Tracks when the user naturally navigated to registration (vs returning from OAuth/email redirect).
  const didNaturallyReachRegistration = useRef(false);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progress = ((currentStep + 1) / totalQuestions) * 100;

  const tabs = [
    { id: 'breakdown', title: 'Match Breakdown', icon: Star, marker: '## 0.' },
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
    const savedAssessmentId = localStorage.getItem('assessment_id');

    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedStep) setCurrentStep(parseInt(savedStep));
    if (savedPhase && savedPhase !== 'testing') setPhase(savedPhase as any);
    if (savedUserData) setUserData(JSON.parse(savedUserData));
    if (savedAssessmentId) setAssessmentId(savedAssessmentId);
  }, []);

  // 2. SALVAR ESTADO NO LOCALSTORAGE SEMPRE QUE MUDAR
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('assessment_answers', JSON.stringify(answers));
      localStorage.setItem('assessment_step', currentStep.toString());
      localStorage.setItem('assessment_phase', phase);
      localStorage.setItem('assessment_user_data', JSON.stringify(userData));
      if (assessmentId) localStorage.setItem('assessment_id', assessmentId);
    }
  }, [answers, currentStep, phase, userData, assessmentId]);

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
    let currentSectionId = 'breakdown';
    lines.forEach(line => {
      // Normalize line: strip bold markers (**) and collapse any # count to ## so
      // Gemini formatting variations (###, **## 2.**) are handled uniformly.
      const normalized = line.trim().replace(/\*+/g, '').replace(/^#{1,6}\s*/, '## ');
      const foundTab = tabs.find(t => normalized.startsWith(t.marker));
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
          // Nota: Mantemos o assessment_id para permitir refresh na tela de resultados
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

  const calculateTopScores = (): { role: string; score: number }[] => {
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
      .map(([role, score]) => ({ role, score }));
  };

  const handleRegistration = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    const matches = calculateResults();
    const topScores = calculateTopScores();
    setTopMatches(matches);
    try {
      const response = await fetch('/api/assessment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, answers, topMatches: matches, topMatchesScores: topScores }),
      });
      const data = await response.json();
      if (data.success) {
        setAssessmentId(data.assessmentId);
        localStorage.setItem('assessment_id', data.assessmentId);
        setPhase('processing');
        startPolling(data.assessmentId);
      } else { setPhase('error'); }
    } catch (error) { setPhase('error'); } finally { setIsSubmitting(false); }
  };

  // EFEITO PARA AUTO-SUBMISSÃO APÓS LOGIN VIA OAUTH (ex: GitHub redirect)
  useEffect(() => {
    const hasAnswers = Object.keys(answers).length > 0;
    const isRegistrationPhase = phase === 'registration';
    const isLoggedIn = !!session?.user;
    const isOAuthReturn = !didNaturallyReachRegistration.current;

    if (isLoggedIn && isRegistrationPhase && hasAnswers && !assessmentId && !isSubmitting && isOAuthReturn) {
      handleRegistration();
    }
  }, [session, phase, answers, assessmentId]);

  useEffect(() => {
    if (phase === 'email_sent' && session?.user && assessmentId) {
      setPhase('processing');
      startPolling(assessmentId);
    }
  }, [phase, session, assessmentId]);

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

    let savedAssessmentId: string | null = null;

    try {
      const matches = calculateResults();
      const topScores = calculateTopScores();
      setTopMatches(matches);

      const saveResponse = await fetch('/api/assessment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, email, answers, topMatches: matches, topMatchesScores: topScores }),
      });

      const saveData = await saveResponse.json();
      if (saveData.success && saveData.assessmentId) {
        savedAssessmentId = saveData.assessmentId;
        setAssessmentId(savedAssessmentId);
        localStorage.setItem('assessment_id', saveData.assessmentId);
      }

      if (authMode === 'signup') {
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
        setPhase('email_sent');
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;

        if (savedAssessmentId) {
          setPhase('processing');
          startPolling(savedAssessmentId);
        }
      }
    } catch (err: any) { setError(err.message); } finally { setIsSubmitting(false); }
  };

  // ─── PDF GENERATION (jsPDF text-based, with cover + TOC) ───────────────────
  const generateMultipagePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const W = 210;
      const H = 297;
      const ml = 22;
      const mr = 22;
      const mt = 30;   // top margin (below header)
      const mb = 24;   // bottom margin (above footer)
      const cw = W - ml - mr;
      const LH = 6;    // line height mm for body text (fontSize 10)

      let pageNum = 1;
      const totalPages = tabs.length + 2; // cover + toc + sections

      const drawHeader = (_title: string) => {
        pdf.setFillColor(248, 250, 252);
        pdf.rect(0, 0, W, 18, 'F');
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(100, 116, 139);
        pdf.text('CAREER ADVISOR  •  STRATEGIC CAREER REPORT  •  CONFIDENTIAL', ml, 11);
        pdf.text(`${pageNum} / ${totalPages}`, W - mr, 11, { align: 'right' });
        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.3);
        pdf.line(ml, 16, W - mr, 16);
      };

      const drawFooter = () => {
        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.3);
        pdf.line(ml, H - 14, W - mr, H - 14);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(148, 163, 184);
        pdf.text('© 2026 WPS Technology Services LLC  •  Strategic Career Alignment', ml, H - 8);
        pdf.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), W - mr, H - 8, { align: 'right' });
      };

      const newPage = () => {
        pdf.addPage();
        pageNum++;
      };

      const stripMarkdown = (text: string) =>
        text
          .replace(/⭐/g, '+')           // replace unicode stars first (Helvetica compat)
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/\[(.*?)\]\(.*?\)/g, '$1')
          .replace(/^#+\s*/, '');

      // ASCII bar for ratings: e.g. 4/5 → "++++ -"
      const asciiRating = (filled: number, total = 5) =>
        '+'.repeat(filled) + ' ' + '-'.repeat(total - filled);

      // ── COVER ──────────────────────────────────────────────────────────────
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, W, H, 'F');

      pdf.setFillColor(37, 99, 235);
      pdf.rect(0, 0, W, 4, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(40);
      pdf.setTextColor(255, 255, 255);
      pdf.text('CAREER', W / 2, 100, { align: 'center' });
      pdf.setTextColor(37, 99, 235);
      pdf.text('ADVISOR', W / 2, 120, { align: 'center' });

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(148, 163, 184);
      pdf.text('Strategic Career Alignment Report  •  Version 2.5', W / 2, 136, { align: 'center' });

      pdf.setDrawColor(37, 99, 235);
      pdf.setLineWidth(0.5);
      pdf.line(W / 2 - 35, 148, W / 2 + 35, 148);

      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text(userData.name || 'Professional', W / 2, 166, { align: 'center' });

      if (userData.currentRole) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 116, 139);
        pdf.text(userData.currentRole, W / 2, 178, { align: 'center' });
      }

      if (topMatches.length > 0) {
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(71, 85, 105);
        pdf.text('TOP CAREER MATCHES', W / 2, 208, { align: 'center' });
        topMatches.forEach((match, idx) => {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(148, 163, 184);
          pdf.text(match, W / 2, 220 + idx * 12, { align: 'center' });
        });
      }

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(71, 85, 105);
      pdf.text(
        new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        W / 2, H - 20, { align: 'center' }
      );

      pdf.setFillColor(37, 99, 235);
      pdf.rect(0, H - 4, W, 4, 'F');

      drawFooter();

      // ── TABLE OF CONTENTS ──────────────────────────────────────────────────
      newPage();
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, W, H, 'F');
      drawHeader('Table of Contents');
      drawFooter();

      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text('Table of Contents', ml, mt + 12);

      pdf.setDrawColor(37, 99, 235);
      pdf.setLineWidth(1);
      pdf.line(ml, mt + 17, ml + 55, mt + 17);

      let tocY = mt + 32;
      tabs.forEach((tab, idx) => {
        const sectionPage = idx + 3;
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(30, 41, 59);
        pdf.text(`${idx + 1}.  ${tab.title}`, ml, tocY);

        // dot leaders
        const labelWidth = pdf.getTextWidth(`${idx + 1}.  ${tab.title}`);
        const pageNumWidth = pdf.getTextWidth(`${sectionPage}`);
        const dotAreaStart = ml + labelWidth + 3;
        const dotAreaEnd = W - mr - pageNumWidth - 3;
        pdf.setTextColor(203, 213, 225);
        pdf.setFontSize(9);
        let dotX = dotAreaStart;
        while (dotX < dotAreaEnd) {
          pdf.text('.', dotX, tocY);
          dotX += 2.2;
        }

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(37, 99, 235);
        pdf.text(`${sectionPage}`, W - mr, tocY, { align: 'right' });
        tocY += 16;
      });

      // ── SECTION PAGES ──────────────────────────────────────────────────────
      for (const tab of tabs) {
        newPage();
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, W, H, 'F');
        drawHeader(tab.title);
        drawFooter();

        // Section title banner
        pdf.setFillColor(239, 246, 255);
        pdf.rect(ml, mt, cw, 16, 'F');
        pdf.setDrawColor(37, 99, 235);
        pdf.setLineWidth(0.8);
        pdf.line(ml, mt, ml, mt + 16);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(15, 23, 42);
        pdf.text(tab.title.toUpperCase(), ml + 5, mt + 11);

        let y = mt + 26;
        const sectionLines = reportSections[tab.id] || [];

        const checkNewPage = (needed: number) => {
          if (y + needed > H - mb) {
            newPage();
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, W, H, 'F');
            drawHeader(tab.title);
            drawFooter();
            y = mt;
          }
        };

        // helpers for line classification
        const isPdfBullet = (l: string) =>
          /^[\s]{0,4}[-*•]\s/.test(l) || l.trim() === '•';

        const isSubheading = (l: string, next: string) => {
          const t = l.trim();
          if (!t || t.length > 55 || t.length < 2) return false;
          if (/^[-*#•\d|]/.test(t)) return false;
          if (t.endsWith('.') || t.split(' ').length > 8) return false;
          const nextTrimmed = next.trim();
          return nextTrimmed.startsWith('-') || nextTrimmed.startsWith('*') || nextTrimmed === '';
        };

        for (let li = 0; li < sectionLines.length; li++) {
          const line = sectionLines[li];
          const nextLine = sectionLines[li + 1] || '';

          // empty line
          if (!line.trim()) { y += 3; continue; }

          // table separator — skip
          if (/^\|[-| :]+\|$/.test(line.trim())) continue;

          // table row
          if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
            const cells = line.trim().replace(/^\||\|$/g, '').split('|').map(c => stripMarkdown(c.trim()));
            const colW = cw / Math.max(cells.length, 1);
            checkNewPage(9);
            pdf.setFillColor(241, 245, 249);
            pdf.rect(ml, y - 5, cw, 8, 'F');
            pdf.setDrawColor(226, 232, 240);
            pdf.setLineWidth(0.2);
            pdf.rect(ml, y - 5, cw, 8);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(71, 85, 105);
            cells.forEach((cell, ci) => { pdf.text(cell.substring(0, 28), ml + ci * colW + 2, y); });
            y += 9;
            continue;
          }

          // explicit h3/h2 heading
          if (line.startsWith('### ') || line.startsWith('## ')) {
            const heading = stripMarkdown(line.replace(/^#+\s*/, ''));
            const wrapped = pdf.splitTextToSize(heading, cw);
            checkNewPage(wrapped.length * 6 + 8);
            y += 4;
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(15, 23, 42);
            pdf.text(wrapped, ml, y);
            y += wrapped.length * 6 + 3;
            continue;
          }

          // implicit sub-heading: short standalone line before a bullet block
          if (isSubheading(line, nextLine)) {
            const heading = stripMarkdown(line.trim());
            checkNewPage(8 + 4);
            y += 4;
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(37, 99, 235);
            pdf.text(heading, ml, y);
            y += 8;
            continue;
          }

          // star rating line (contains ⭐)
          if (line.includes('⭐')) {
            const starCount = (line.match(/⭐/g) || []).length;
            const label = stripMarkdown(line.replace(/^[-•*]\s*/, '').split(':')[0]);
            checkNewPage(LH + 2);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(30, 41, 59);
            pdf.text(label, ml, y);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(180, 130, 0);
            pdf.text(asciiRating(starCount), W - mr, y, { align: 'right' });
            y += LH + 2;
            continue;
          }

          // bullet — top-level and indented (` - `)
          if (isPdfBullet(line)) {
            const isIndented = /^\s+/.test(line);
            const indent = isIndented ? 10 : 4;
            const text = stripMarkdown(line.replace(/^[\s]*[-*•]\s+/, ''));
            if (!text.trim()) continue;
            const wrapped = pdf.splitTextToSize(text, cw - indent - 4);
            checkNewPage(wrapped.length * LH + 2);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(37, 99, 235);
            pdf.text(isIndented ? '-' : 'o', ml + indent - 3, y);
            pdf.setTextColor(55, 65, 81);
            pdf.text(wrapped, ml + indent + 2, y);
            y += wrapped.length * LH + 2;
            continue;
          }

          // numbered list
          if (/^\d+\.\s/.test(line)) {
            const text = stripMarkdown(line);
            const wrapped = pdf.splitTextToSize(text, cw - 8);
            checkNewPage(wrapped.length * LH + 2);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(55, 65, 81);
            pdf.text(wrapped, ml + 4, y);
            y += wrapped.length * LH + 2;
            continue;
          }

          // regular paragraph
          const cleanLine = stripMarkdown(line);
          if (!cleanLine.trim()) { y += 2; continue; }
          const wrapped = pdf.splitTextToSize(cleanLine, cw);
          checkNewPage(wrapped.length * LH + 3);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(55, 65, 81);
          pdf.text(wrapped, ml, y);
          y += wrapped.length * LH + 3;
        }
      }

      pdf.save(`WPSTEC_Strategic_Report_${userData.name || 'Professional'}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
  const nextStep = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      didNaturallyReachRegistration.current = true;
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

  if (phase === 'email_sent') {
    return (
      <Card className="p-8 md:p-12 bg-slate-900 border-slate-800 max-w-xl mx-auto shadow-2xl rounded-[40px] text-white text-center">
        <div className="p-4 bg-blue-600 rounded-3xl w-fit mx-auto mb-6 shadow-xl shadow-blue-500/20">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black italic tracking-tighter leading-none uppercase text-white mb-3">Check Your Email</h2>
        <p className="text-slate-400 text-sm italic">
          We sent a confirmation link to <span className="text-white font-bold">{userData.email || email}</span>.
        </p>
        <p className="text-slate-500 text-xs mt-3">Click the link in the email to confirm your account and access your report.</p>
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

    // ── inline markdown → HTML (bold, italic, links) ─────────────────────────
    const formatInline = (text: string) =>
      text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-black">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-slate-200 italic">$1</em>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline hover:text-blue-300 transition-colors">$1</a>');

    // ── group lines into rich elements ────────────────────────────────────────
    const renderLines = (lines: string[]) => {
      const elements: React.ReactNode[] = [];
      let i = 0;

      while (i < lines.length) {
        const line = lines[i];

        // empty line → small spacer
        if (!line.trim()) {
          elements.push(<div key={`sp-${i}`} className="h-2" />);
          i++;
          continue;
        }

        // table separator — skip
        if (/^\|[-| :]+\|$/.test(line.trim())) {
          i++;
          continue;
        }

        // table row — collect consecutive rows
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
          const rows: string[][] = [];
          while (i < lines.length && lines[i].trim().startsWith('|')) {
            if (/^\|[-| :]+\|$/.test(lines[i].trim())) {
              i++;
              continue;
            }
            const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
            rows.push(cells);
            i++;
          }
          elements.push(
            <div key={`tbl-${i}`} className="overflow-x-auto my-6 rounded-2xl border border-slate-800">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri} className={ri === 0 ? 'bg-slate-800' : 'border-t border-slate-800/50 hover:bg-slate-900/50 transition-colors'}>
                      {row.map((cell, ci) => (
                        ri === 0
                          ? <th key={ci} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-300" dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
                          : <td key={ci} className="px-4 py-3 text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }

        // h3 subheading
        if (line.startsWith('### ') || (line.startsWith('## ') && !line.match(/^## \d+\./))) {
          const text = line.replace(/^#+\s*/, '');
          elements.push(
            <h3 key={`h3-${i}`} className="text-xl font-black text-white mt-8 mb-3 tracking-tight italic" dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
          );
          i++;
          continue;
        }

        // h4 subheading
        if (line.startsWith('#### ')) {
          const text = line.replace('#### ', '');
          elements.push(
            <h4 key={`h4-${i}`} className="text-base font-bold text-blue-400 mt-5 mb-2" dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
          );
          i++;
          continue;
        }

        // bullet list — handles: `- text`, `* text`, `• text`, standalone `•` + next line
        const isBulletLine = (l: string) =>
          l.startsWith('- ') || l.startsWith('* ') || l.startsWith('• ') || l.trim() === '•';

        if (isBulletLine(line)) {
          const items: string[] = [];
          while (i < lines.length && isBulletLine(lines[i])) {
            const curr = lines[i];
            if (curr.trim() === '•') {
              // standalone bullet marker — next non-empty line is the content
              i++;
              while (i < lines.length && !lines[i].trim()) i++;
              if (i < lines.length && !isBulletLine(lines[i]) && !lines[i].startsWith('#')) {
                items.push(lines[i]);
                i++;
              }
            } else {
              items.push(curr.replace(/^[-*•]\s+/, ''));
              i++;
            }
          }
          if (items.length === 0) continue;
          elements.push(
            <ul key={`ul-${i}`} className="space-y-2 my-4 pl-0">
              {items.map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-slate-300 text-sm md:text-base leading-relaxed">
                  <span className="text-blue-500 mt-1 shrink-0 font-black text-base">•</span>
                  <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
                </li>
              ))}
            </ul>
          );
          continue;
        }

        // numbered list — collect consecutive items
        if (/^\d+\.\s/.test(line)) {
          const items: string[] = [];
          while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
            items.push(lines[i].replace(/^\d+\.\s+/, ''));
            i++;
          }
          elements.push(
            <ol key={`ol-${i}`} className="space-y-3 my-4 pl-0">
              {items.map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-slate-300 text-sm md:text-base leading-relaxed">
                  <span className="text-blue-500 font-black shrink-0 w-6 text-right tabular-nums">{j + 1}.</span>
                  <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
                </li>
              ))}
            </ol>
          );
          continue;
        }

        // star rating card
        if (line.includes('⭐')) {
          const starCount = (line.match(/⭐/g) || []).length;
          const label = line.replace(/^- /, '').split(':')[0].replace(/⭐/g, '').trim();
          elements.push(
            <div key={`star-${i}`} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-slate-950/50 border border-slate-800 rounded-[24px] mb-3 hover:border-blue-500/30 transition-all">
              <span className="text-base font-bold text-slate-200 italic">{label}</span>
              <div className="flex gap-1.5 mt-3 sm:mt-0">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`w-5 h-5 ${s <= starCount ? 'text-yellow-500 fill-yellow-500' : 'text-slate-800'}`} />
                ))}
              </div>
            </div>
          );
          i++;
          continue;
        }

        // regular paragraph
        elements.push(
          <p key={`p-${i}`} className="leading-[1.9] text-slate-300 text-sm md:text-base font-medium animate-in fade-in" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        );
        i++;
      }

      return elements;
    };

    return (
      <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-1000 pb-32 px-4 flex flex-col lg:flex-row gap-8 text-left">
        <aside className="w-full lg:w-80 shrink-0">
          <Card className="bg-slate-900 border-slate-800 p-6 rounded-[32px] sticky top-24 shadow-2xl">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20"><Briefcase className="w-6 h-6 text-white" /></div>
              <div>
                <h3 className="text-lg font-black text-white italic tracking-tighter leading-none uppercase">{userData.name}</h3>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Market DNA v2.5</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
                  <tab.icon className="w-4 h-4" />{tab.title}
                </button>
              ))}
            </nav>
            <Button onClick={generateMultipagePdf} disabled={isGeneratingPdf} className="w-full mt-8 h-12 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-2xl transition-all active:scale-95 uppercase tracking-widest text-[9px]">
              {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileDown className="w-4 h-4 mr-2" />} Export Report
            </Button>
          </Card>
        </aside>

        <main className="flex-1 min-w-0">
          <Card className="p-8 md:p-16 bg-slate-900/40 border-slate-800 shadow-2xl relative min-h-[700px] rounded-[48px] overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 opacity-50" />
            <div className="max-w-none text-left">
              <div className="mb-12 border-b border-slate-800 pb-8 flex items-center gap-6 animate-in slide-in-from-left duration-500">
                <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                  {React.createElement(tabs.find(t => t.id === activeTab)?.icon || Sparkles, { className: 'w-10 h-10 text-blue-500' })}
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white italic m-0 tracking-tighter uppercase leading-none">
                  {tabs.find(t => t.id === activeTab)?.title}
                </h2>
              </div>
              <div className="space-y-2">
                {renderLines(currentLines)}
              </div>
            </div>
          </Card>
        </main>
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
