import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  BrainCircuit, 
  LayoutDashboard, 
  History, 
  Settings, 
  LogOut,
  FileText,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 flex flex-col">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      {/* FIXED NAVIGATION HEADER */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white">
            <div className="p-2 bg-blue-600 rounded-xl">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span>Tech Path <span className="text-blue-500 italic">Portal</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Session</span>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex pt-20">
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-slate-900 hidden lg:flex flex-col p-6 sticky top-20 h-[calc(100vh-80px)]">
          <nav className="space-y-2 flex-1">
            <Button className="w-full justify-start bg-blue-600 text-white font-bold gap-3 px-4 py-6 rounded-2xl shadow-lg shadow-blue-500/20">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white gap-3 px-4 py-6 rounded-2xl">
              <History className="w-5 h-5" /> History
            </Button>
            <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white gap-3 px-4 py-6 rounded-2xl">
              <Settings className="w-5 h-5" /> Settings
            </Button>
          </nav>
          
          <Link href="/assessment">
            <Button variant="outline" className="w-full border-blue-500/30 bg-blue-500/5 text-blue-400 font-bold py-6 rounded-2xl hover:bg-blue-500/10">
              Retake Assessment
            </Button>
          </Link>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <h1 className="text-3xl font-black text-white italic tracking-tight mb-2 uppercase">Welcome Back</h1>
              <p className="text-slate-500 text-sm font-medium">Tracking your integration into the US tech workforce.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="p-6 bg-slate-900/50 border-slate-800 rounded-3xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Assessments</p>
                <div className="text-3xl font-black text-white">01</div>
              </Card>
              <Card className="p-6 bg-slate-900/50 border-slate-800 rounded-3xl text-blue-500 border-blue-500/20">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 text-slate-500">Skill Gap</p>
                <div className="text-3xl font-black">-42%</div>
              </Card>
              <Card className="p-6 bg-slate-900/50 border-slate-800 rounded-3xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Saved Roles</p>
                <div className="text-3xl font-black">03</div>
              </Card>
            </div>

            {/* Recent Reports */}
            <div className="space-y-6">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4" /> Strategic Career Reports
              </h2>
              
              <Card className="p-8 bg-slate-900/40 border-slate-800 rounded-[32px] hover:border-blue-500/30 transition-all group flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 group-hover:bg-blue-600/10 transition-colors">
                    <History className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white italic tracking-tight">Main Aptitude Analysis</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                        <Clock className="w-3.5 h-3.5" /> Completed Today
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded border border-emerald-500/20 uppercase tracking-tighter">
                        Success Match
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/5 font-bold gap-2">
                  View Results <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Card>

              {/* Empty State Mockup */}
              <div className="border-2 border-dashed border-slate-900 rounded-[32px] p-12 text-center">
                <p className="text-slate-600 text-sm font-bold uppercase tracking-widest">No certifications verified yet</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
