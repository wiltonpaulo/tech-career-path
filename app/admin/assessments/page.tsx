'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  RefreshCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  User as UserIcon,
  Mail,
  ArrowRight,
  Database,
  Activity,
  Trash2,
  X,
} from 'lucide-react';

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchAssessments = async () => {
    try {
      const res = await fetch('/api/admin/assessments');
      const data = await res.json();
      setAssessments(data);
    } catch (error) {
      console.error("Failed to load assessments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
    const interval = setInterval(fetchAssessments, 15000); 
    return () => clearInterval(interval);
  }, []);

  const handleRetry = async (id: string) => {
    setRetryingId(id);
    try {
      await fetch('/api/admin/assessments/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId: id }),
      });
      fetchAssessments();
    } catch (error) {
      console.error("Failed to retry");
    } finally {
      setRetryingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/admin/assessments/${id}`, { method: 'DELETE' });
      setAssessments(prev => prev.filter(a => a.id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em]"><CheckCircle2 className="w-3 h-3" /> Completed</div>;
      case 'PROCESSING':
        return <div className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] animate-pulse"><Loader2 className="w-3 h-3 animate-spin" /> Processing</div>;
      case 'PENDING':
        return <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em]"><Clock className="w-3 h-3" /> In Queue</div>;
      case 'FAILED':
        return <div className="flex items-center gap-1.5 text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em]"><AlertCircle className="w-3 h-3" /> Error</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-slate-800/50 pb-12">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 text-blue-500">
              <Activity className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">System Monitoring</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none uppercase text-white">
              Queue <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">Control</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-md font-medium leading-relaxed">
              Real-time monitoring of AI report generation. Trigger manual processing or audit existing assessments.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={fetchAssessments} 
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] transition-all"
            >
              <RefreshCcw className={`w-4 h-4 mr-3 ${isLoading ? 'animate-spin' : ''}`} /> 
              Refresh Database
            </Button>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Assessments', value: assessments.length, icon: Database },
            { label: 'Completed', value: assessments.filter(a => a.status === 'COMPLETED').length, icon: CheckCircle2 },
            { label: 'Active Queue', value: assessments.filter(a => a.status === 'PENDING' || a.status === 'PROCESSING').length, icon: Clock },
            { label: 'Failed Jobs', value: assessments.filter(a => a.status === 'FAILED').length, icon: AlertCircle },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-900/40 border-slate-800/50 p-6 rounded-3xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2 opacity-50">
                <stat.icon className="w-3 h-3 text-blue-400" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</span>
              </div>
              <div className="text-2xl font-black italic tracking-tighter text-white">{stat.value}</div>
            </Card>
          ))}
        </div>

        {/* Queue List */}
        <div className="space-y-4">
          {isLoading && assessments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Connecting to Core...</span>
            </div>
          ) : assessments.map((a) => (
            <Card key={a.id} className="bg-slate-900/30 border-slate-800/50 hover:border-blue-500/30 hover:bg-slate-900/50 p-6 md:p-8 rounded-[32px] transition-all duration-500 group relative overflow-hidden backdrop-blur-sm text-left">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity">
                <Database className="w-24 h-24 rotate-12 text-white" />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="flex items-start md:items-center gap-6 text-left">
                  <div className="shrink-0 p-5 bg-slate-950 rounded-2xl border border-slate-800 group-hover:border-blue-500/50 transition-all duration-500 group-hover:scale-110 shadow-2xl">
                    <UserIcon className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="space-y-1 text-left">
                    <h3 className="font-black text-xl md:text-2xl italic tracking-tighter uppercase text-slate-100 group-hover:text-white transition-colors">
                      {a.user.name || 'Anonymous'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-left">
                      <span className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                        <Mail className="w-3 h-3" /> {a.user.email}
                      </span>
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-none">
                        • {new Date(a.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {a.currentRole && (
                      <div className="mt-2 inline-block px-2 py-0.5 bg-slate-800/50 rounded-md text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        From: {a.currentRole}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="hidden sm:block">
                    {getStatusBadge(a.status)}
                  </div>
                  <Button
                    onClick={() => handleRetry(a.id)}
                    disabled={retryingId === a.id || a.status === 'PROCESSING'}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-12 px-8 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all group/btn disabled:opacity-50 disabled:grayscale"
                  >
                    {retryingId === a.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {a.status === 'COMPLETED' ? 'Regenerate' : 'Trigger AI'}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                  {confirmDeleteId === a.id ? (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleDelete(a.id)}
                        disabled={deletingId === a.id}
                        className="h-12 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase tracking-wider"
                      >
                        {deletingId === a.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                      </Button>
                      <Button
                        onClick={() => setConfirmDeleteId(null)}
                        className="h-12 w-12 p-0 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setConfirmDeleteId(a.id)}
                      className="h-12 w-12 p-0 rounded-2xl bg-slate-800 hover:bg-red-600/20 text-slate-500 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Mobile Badge Only */}
              <div className="mt-6 pt-6 border-t border-slate-800/50 sm:hidden">
                {getStatusBadge(a.status)}
              </div>
            </Card>
          ))}
          
          {!isLoading && assessments.length === 0 && (
            <div className="text-center py-32 border-2 border-dashed border-slate-900 rounded-[48px]">
              <p className="text-slate-600 font-black italic uppercase tracking-widest">No assessments found in database</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
