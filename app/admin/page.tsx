'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Users, ClipboardList, CheckCircle2, AlertCircle, Clock, Copy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/users').then(r => r.json()),
      fetch('/api/admin/assessments').then(r => r.json()),
    ]).then(([u, a]) => {
      setUsers(Array.isArray(u) ? u : []);
      setAssessments(Array.isArray(a) ? a : []);
    }).finally(() => setLoading(false));
  }, []);

  const usersWithMultiple = users.filter(u => u.assessments?.length > 1);
  const completed  = assessments.filter(a => a.status === 'COMPLETED').length;
  const failed     = assessments.filter(a => a.status === 'FAILED').length;
  const pending    = assessments.filter(a => a.status === 'PENDING' || a.status === 'PROCESSING').length;

  const stats = [
    { label: 'Total Users',       value: users.length,         icon: Users,         color: 'blue',    href: '/admin/users' },
    { label: 'Assessments',       value: assessments.length,   icon: ClipboardList, color: 'indigo',  href: '/admin/assessments' },
    { label: 'Completed Reports', value: completed,            icon: CheckCircle2,  color: 'emerald', href: '/admin/assessments' },
    { label: 'Potential Dupes',   value: usersWithMultiple.length, icon: Copy,      color: 'amber',   href: '/admin/users?filter=duplicates' },
    { label: 'Active Queue',      value: pending,              icon: Clock,         color: 'blue',    href: '/admin/assessments' },
    { label: 'Failed Jobs',       value: failed,               icon: AlertCircle,   color: 'red',     href: '/admin/assessments' },
  ];

  const colorMap: Record<string, string> = {
    blue:    'text-blue-400 bg-blue-500/10 border-blue-500/20',
    indigo:  'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber:   'text-amber-400 bg-amber-500/10 border-amber-500/20',
    red:     'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="p-8 md:p-12 max-w-5xl">
      {/* Header */}
      <div className="mb-12">
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">System Overview</p>
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white leading-none">
          Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">Dashboard</span>
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {stats.map((s, i) => (
          <Link key={i} href={s.href}>
            <Card className={`p-6 rounded-3xl border bg-slate-900/40 backdrop-blur-sm hover:scale-[1.02] transition-all cursor-pointer group ${colorMap[s.color]}`}>
              <div className="flex items-center gap-2 mb-3 opacity-60">
                <s.icon className="w-3.5 h-3.5" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">{s.label}</span>
              </div>
              <div className="text-3xl font-black italic tracking-tighter text-white">
                {loading ? '—' : s.value}
              </div>
              <ArrowRight className="w-3 h-3 mt-2 opacity-0 group-hover:opacity-60 transition-opacity" />
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Users */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Recent Users</h2>
          <Link href="/admin/users" className="text-[9px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors">
            View all →
          </Link>
        </div>
        <div className="space-y-2">
          {users.slice(0, 5).map(u => (
            <Card key={u.id} className="bg-slate-900/30 border-slate-800/50 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-white italic tracking-tight">{u.name || '—'}</p>
                <p className="text-[10px] text-slate-500 font-bold">{u.email}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  {u.assessments?.length ?? 0} assessment{(u.assessments?.length ?? 0) !== 1 ? 's' : ''}
                </p>
                <p className="text-[9px] text-slate-600 mt-0.5">
                  {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </Card>
          ))}
          {!loading && users.length === 0 && (
            <p className="text-slate-600 text-xs font-bold text-center py-8">No users yet.</p>
          )}
        </div>
      </div>

      {/* Duplicates alert */}
      {usersWithMultiple.length > 0 && (
        <Card className="p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-start gap-4">
            <Copy className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-amber-400 uppercase tracking-wide">
                {usersWithMultiple.length} user{usersWithMultiple.length !== 1 ? 's' : ''} with multiple assessments
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                These users submitted the assessment more than once. You may want to delete older submissions.
              </p>
              <Link href="/admin/users?filter=duplicates" className="inline-block mt-3 text-[9px] font-black uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors">
                Review duplicates →
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
