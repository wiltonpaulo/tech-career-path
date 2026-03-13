'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ClipboardList, ChevronRight, Shield } from 'lucide-react';

const navItems = [
  { href: '/admin',             label: 'Overview',    icon: LayoutDashboard, exact: true  },
  { href: '/admin/users',       label: 'Users',       icon: Users,           exact: false },
  { href: '/admin/assessments', label: 'Queue',       icon: ClipboardList,   exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-800/50 bg-slate-950 sticky top-20 h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Admin Panel</span>
          </div>
          <div className="text-xl font-black italic tracking-tighter text-white">Control Center</div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-500 hover:text-white hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest text-center">
            Admin access only
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-slate-950">
        {children}
      </main>
    </div>
  );
}
