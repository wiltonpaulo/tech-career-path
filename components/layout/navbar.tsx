'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { BrainCircuit, LayoutDashboard, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { BRAND_CONFIG } from '@/lib/config';

export function Navbar() {
  const supabase = createClient();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white group">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="hidden sm:inline">{BRAND_CONFIG.shortCompany} <span className="text-blue-500 italic">{BRAND_CONFIG.shortCompany2nd}</span></span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Link href="/vision" className={`hover:text-white transition-colors ${pathname === '/vision' ? 'text-white' : ''}`}>Vision</Link>
          <Link href="/methodology" className={`hover:text-white transition-colors ${pathname === '/methodology' ? 'text-white' : ''}`}>Methodology</Link>
          <Link href="/roles" className={`hover:text-white transition-colors italic ${pathname === '/roles' ? 'text-white' : ''}`}>Market Demand</Link>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" className="hidden sm:flex items-center gap-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="h-8 w-[1px] bg-slate-800 hidden sm:block mx-2" />
              <Button onClick={handleLogout} variant="ghost" className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-colors">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Link href="/assessment">
              <Button className="bg-blue-600 hover:bg-blue-500 px-6 rounded-full font-black text-[10px] uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                Start Analysis
              </Button>
            </Link>
          )}
          
          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-400 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <Link href="/vision" className="text-xs font-black uppercase tracking-widest text-slate-400" onClick={() => setIsMenuOpen(false)}>Vision</Link>
          <Link href="/methodology" className="text-xs font-black uppercase tracking-widest text-slate-400" onClick={() => setIsMenuOpen(false)}>Methodology</Link>
          <Link href="/roles" className="text-xs font-black uppercase tracking-widest text-slate-400" onClick={() => setIsMenuOpen(false)}>Market Demand</Link>
          {user && (
            <Link href="/dashboard" className="text-xs font-black uppercase tracking-widest text-blue-500" onClick={() => setIsMenuOpen(false)}>My Dashboard</Link>
          )}
        </div>
      )}
    </nav>
  );
}
