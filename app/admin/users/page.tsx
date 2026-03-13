'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Trash2,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  Plus,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  X,
  ArrowRight,
} from 'lucide-react';

type Assessment = {
  id: string;
  status: string;
  currentRole?: string;
  topMatches: string[];
  createdAt: string;
  report?: { content: string } | null;
};

type User = {
  id: string;
  name?: string;
  email?: string;
  createdAt: string;
  assessments: Assessment[];
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'COMPLETED':
      return <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"><CheckCircle2 className="w-2.5 h-2.5" />Done</span>;
    case 'PROCESSING':
      return <span className="flex items-center gap-1 text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider animate-pulse"><Loader2 className="w-2.5 h-2.5 animate-spin" />Running</span>;
    case 'PENDING':
      return <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"><Clock className="w-2.5 h-2.5" />Queued</span>;
    case 'FAILED':
      return <span className="flex items-center gap-1 text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"><AlertCircle className="w-2.5 h-2.5" />Failed</span>;
    default:
      return null;
  }
};

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'duplicates'>(
    searchParams.get('filter') === 'duplicates' ? 'duplicates' : 'all'
  );
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deletingAssessmentId, setDeletingAssessmentId] = useState<string | null>(null);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<string | null>(null);
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserError, setNewUserError] = useState('');
  const [savingUser, setSavingUser] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDeleteUser = async (id: string) => {
    setDeletingUserId(id);
    try {
      await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u.id !== id));
      setConfirmDeleteUserId(null);
    } catch { /* ignore */ }
    finally { setDeletingUserId(null); }
  };

  const handleDeleteAssessment = async (assessmentId: string, userId: string) => {
    setDeletingAssessmentId(assessmentId);
    try {
      await fetch(`/api/admin/assessments/${assessmentId}`, { method: 'DELETE' });
      setUsers(prev => prev.map(u =>
        u.id === userId
          ? { ...u, assessments: u.assessments.filter(a => a.id !== assessmentId) }
          : u
      ));
    } catch { /* ignore */ }
    finally { setDeletingAssessmentId(null); }
  };

  const handleRegenerateAssessment = async (assessmentId: string) => {
    await fetch('/api/admin/assessments/retry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessmentId }),
    });
    fetchUsers();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewUserError('');
    setSavingUser(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUserName, email: newUserEmail }),
      });
      if (!res.ok) {
        const d = await res.json();
        setNewUserError(d.error || 'Error creating user');
        return;
      }
      setNewUserName('');
      setNewUserEmail('');
      setShowNewUser(false);
      fetchUsers();
    } catch { setNewUserError('Unexpected error'); }
    finally { setSavingUser(false); }
  };

  // Filtered + searched users
  const filtered = users
    .filter(u => filter === 'duplicates' ? u.assessments.length > 1 : true)
    .filter(u => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    });

  const dupeCount = users.filter(u => u.assessments.length > 1).length;

  return (
    <div className="p-8 md:p-12 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">User Management</p>
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white leading-none">
          Users <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">
            {loading ? '' : `(${users.length})`}
          </span>
        </h1>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by name or email…"
            className="bg-slate-900 border-slate-800 h-12 pl-12 rounded-2xl text-white placeholder:text-slate-600"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          <Button
            onClick={() => setFilter('all')}
            className={`h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
          >
            All
          </Button>
          <Button
            onClick={() => setFilter('duplicates')}
            className={`h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filter === 'duplicates' ? 'bg-amber-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
          >
            <Copy className="w-3.5 h-3.5" />
            Duplicates {dupeCount > 0 && <span className="ml-1 bg-amber-500 text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">{dupeCount}</span>}
          </Button>
        </div>

        <Button
          onClick={() => setShowNewUser(v => !v)}
          className="h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2"
        >
          {showNewUser ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showNewUser ? 'Cancel' : 'New User'}
        </Button>

        <Button
          onClick={fetchUsers}
          className="h-12 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Create user form */}
      {showNewUser && (
        <Card className="mb-8 p-6 rounded-3xl border border-blue-500/20 bg-blue-500/5">
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-4">Register User Manually</p>
          <form onSubmit={handleCreateUser} className="flex flex-col sm:flex-row gap-3">
            <Input
              required
              placeholder="Full name"
              className="bg-slate-900 border-slate-800 h-12 rounded-2xl text-white flex-1"
              value={newUserName}
              onChange={e => setNewUserName(e.target.value)}
            />
            <Input
              required
              type="email"
              placeholder="email@example.com"
              className="bg-slate-900 border-slate-800 h-12 rounded-2xl text-white flex-1"
              value={newUserEmail}
              onChange={e => setNewUserEmail(e.target.value)}
            />
            <Button
              type="submit"
              disabled={savingUser}
              className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest shrink-0"
            >
              {savingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
            </Button>
          </form>
          {newUserError && <p className="text-red-400 text-[10px] font-bold mt-2">{newUserError}</p>}
          <p className="text-[9px] text-slate-500 mt-3">
            Creates a verified user record. The user can log in via GitHub OAuth or email/password independently through Supabase Auth.
          </p>
        </Card>
      )}

      {/* Users list */}
      {loading && users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Loading users…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-slate-800 rounded-[48px]">
          <Users className="w-8 h-8 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-600 font-black italic uppercase tracking-widest text-sm">
            {search || filter === 'duplicates' ? 'No results found' : 'No users yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(user => {
            const expanded = expandedIds.has(user.id);
            const isDupe = user.assessments.length > 1;
            const latestAssessment = user.assessments[0];

            return (
              <Card
                key={user.id}
                className={`rounded-[28px] border transition-all overflow-hidden ${
                  isDupe
                    ? 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40'
                    : 'border-slate-800/50 bg-slate-900/30 hover:border-blue-500/20'
                }`}
              >
                {/* User row */}
                <div className="p-5 flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-slate-400">
                      {(user.name || user.email || '?')[0].toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-black text-white italic tracking-tight truncate">
                        {user.name || '—'}
                      </span>
                      {isDupe && (
                        <span className="text-[8px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                          {user.assessments.length} assessments
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold truncate">{user.email}</p>
                    <p className="text-[9px] text-slate-700 mt-0.5">
                      Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Latest status */}
                  {latestAssessment && (
                    <div className="hidden sm:block shrink-0">
                      <StatusBadge status={latestAssessment.status} />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      onClick={() => toggleExpand(user.id)}
                      className="h-9 w-9 p-0 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                    >
                      {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>

                    {confirmDeleteUserId === user.id ? (
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deletingUserId === user.id}
                          className="h-9 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[9px] font-black uppercase tracking-wider"
                        >
                          {deletingUserId === user.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Confirm'}
                        </Button>
                        <Button
                          onClick={() => setConfirmDeleteUserId(null)}
                          className="h-9 w-9 p-0 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setConfirmDeleteUserId(user.id)}
                        className="h-9 w-9 p-0 rounded-xl bg-slate-800 hover:bg-red-600/20 text-slate-500 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expanded assessments */}
                {expanded && (
                  <div className="border-t border-slate-800/50 px-5 pb-5 pt-4 space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3">
                      Assessment History ({user.assessments.length})
                    </p>
                    {user.assessments.map((a, idx) => (
                      <div
                        key={a.id}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/50"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <StatusBadge status={a.status} />
                            {idx === 0 && (
                              <span className="text-[8px] font-black uppercase text-blue-400 tracking-wider">latest</span>
                            )}
                          </div>
                          {a.currentRole && (
                            <p className="text-[9px] text-slate-500 font-bold">From: {a.currentRole}</p>
                          )}
                          {a.topMatches?.length > 0 && (
                            <p className="text-[9px] text-slate-600 truncate mt-0.5">
                              → {a.topMatches.join(', ')}
                            </p>
                          )}
                          <p className="text-[9px] text-slate-700 mt-0.5">
                            {new Date(a.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Regenerate */}
                          <Button
                            onClick={() => handleRegenerateAssessment(a.id)}
                            title="Regenerate report"
                            className="h-8 w-8 p-0 rounded-xl bg-slate-800 hover:bg-blue-600/20 text-slate-500 hover:text-blue-400 transition-all"
                          >
                            <RefreshCcw className="w-3.5 h-3.5" />
                          </Button>
                          {/* Delete assessment */}
                          <Button
                            onClick={() => handleDeleteAssessment(a.id, user.id)}
                            disabled={deletingAssessmentId === a.id}
                            title="Delete this assessment"
                            className="h-8 w-8 p-0 rounded-xl bg-slate-800 hover:bg-red-600/20 text-slate-500 hover:text-red-400 transition-all"
                          >
                            {deletingAssessmentId === a.id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Trash2 className="w-3.5 h-3.5" />
                            }
                          </Button>
                        </div>
                      </div>
                    ))}

                    {isDupe && (
                      <p className="text-[9px] text-amber-500/70 font-bold pt-1">
                        Tip: delete older assessments to keep only the most recent report.
                      </p>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
