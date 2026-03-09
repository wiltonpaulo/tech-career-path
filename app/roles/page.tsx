'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MARKET_ROLES, CareerRole } from '@/lib/assessment/roles-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  BrainCircuit, 
  DollarSign, 
  MapPin, 
  Briefcase,
  Filter,
  ArrowUpDown,
  Zap,
  TrendingUp,
  Award,
  Search
} from 'lucide-react';

export default function MarketExplorer() {
  const [demandFilter, setDemandFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'salary'>('default');

  const filteredRoles = useMemo(() => {
    let result = [...MARKET_ROLES];
    
    if (demandFilter !== 'All') {
      result = result.filter(role => role.demand === demandFilter);
    }

    if (sortBy === 'salary') {
      result.sort((a, b) => {
        const getVal = (s: string) => parseInt(s.replace(/[^0-9]/g, '').slice(0, 3));
        return getVal(b.salary) - getVal(a.salary);
      });
    }

    return result;
  }, [demandFilter, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 flex flex-col font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>

      {/* FIXED NAVIGATION HEADER */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Dashboard</span>
          </Link>
          
          <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white">
            <div className="p-2 bg-blue-600 rounded-xl">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span>Market <span className="text-blue-500 italic">Explorer</span></span>
          </div>

          <Link href="/assessment">
            <Button className="bg-blue-600 hover:bg-blue-500 px-6 rounded-full font-bold text-xs uppercase tracking-tighter text-white border-none shadow-lg shadow-blue-500/20">
              Start Assessment
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex-1 pt-40 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Page Title & Stats */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">
                <TrendingUp className="w-3 h-3" />
                <span>Live US Market Data 2026</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none mb-4">
                Explore the <br /><span className="text-blue-500">Tech Landscape.</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium">
                High-fidelity analysis of current vacancies, salary benchmarks, and technical requirements across American hubs.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-xl">
              <div className="px-6 py-3 text-center border-r border-slate-800">
                <div className="text-2xl font-black text-white leading-none">20</div>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Roles</div>
              </div>
              <div className="px-6 py-3 text-center">
                <div className="text-2xl font-black text-blue-500 leading-none">$145k</div>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Avg Salary</div>
              </div>
            </div>
          </div>

          {/* FILTERS BAR */}
          <div className="flex flex-wrap items-center gap-4 mb-10 pb-10 border-b border-slate-900">
            <div className="flex items-center gap-2 text-slate-500 mr-4">
              <Filter className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Filter by Demand:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Extreme', 'Very High', 'High'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setDemandFilter(tag)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border ${
                    demandFilter === tag 
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                    : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setSortBy(sortBy === 'salary' ? 'default' : 'salary')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${
                  sortBy === 'salary' 
                  ? "border-blue-500/50 text-blue-400 bg-blue-500/5" 
                  : "border-slate-800 text-slate-500 hover:text-slate-300"
                }`}
              >
                <ArrowUpDown className="w-3 h-3" />
                Sort by Salary
              </button>
            </div>
          </div>

          {/* Grid of Roles */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
            {filteredRoles.map((role) => (
              <Card key={role.id} className="p-8 bg-slate-900/40 border-slate-800 hover:border-blue-500/30 transition-all group flex flex-col justify-between backdrop-blur-md rounded-[32px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-2xl -z-10" />
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 group-hover:scale-110 transition-transform shadow-lg">
                      <Award className="w-6 h-6 text-blue-500" />
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                      role.demand === 'Extreme' ? 'text-orange-400 bg-orange-400/10 border-orange-400/20' :
                      role.demand === 'Very High' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' :
                      'text-blue-400 bg-blue-400/10 border-blue-400/20'
                    }`}>
                      {role.demand} Demand
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-3 italic tracking-tight uppercase group-hover:text-blue-400 transition-colors">{role.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium opacity-80">
                    {role.description}
                  </p>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-3 text-white">
                      <div className="p-1.5 bg-blue-600/10 rounded-md">
                        <DollarSign className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-base font-black tracking-tight">{role.salary} <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Avg Base</span></span>
                    </div>
                    <div className="flex items-start gap-3 text-slate-200">
                      <div className="p-1.5 bg-indigo-600/10 rounded-md mt-0.5">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {role.hubs.map((hub, i) => (
                          <span key={i} className="text-[9px] font-bold text-slate-400 bg-slate-950/50 px-2.5 py-1 rounded-full border border-slate-800">{hub}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-3 h-3 text-blue-500 fill-current" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Core Technical Stack</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-600/5 border border-blue-500/10 text-blue-400 text-[10px] font-black rounded-xl uppercase tracking-tighter hover:bg-blue-600/10 transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredRoles.length === 0 && (
            <div className="py-32 text-center border-2 border-dashed border-slate-900 rounded-[40px]">
              <Search className="w-12 h-12 text-slate-800 mx-auto mb-4" />
              <p className="text-slate-600 font-bold uppercase tracking-widest">No roles found for this criteria.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="py-12 border-t border-slate-900/50 text-center relative z-10 bg-slate-950/50 backdrop-blur-sm">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] italic">
          Empowering the American Technology Workforce • LIVE DATABASE 2026
        </p>
      </footer>
    </div>
  );
}
