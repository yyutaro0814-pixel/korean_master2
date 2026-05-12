"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Bookmark, LayoutDashboard, Settings, Info, Gamepad } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: LayoutDashboard, label: 'ダッシュボード' },
    { href: '/game', icon: Gamepad, label: 'トレーニング' },
    { href: '/saved', icon: Bookmark, label: '保存した単語' },
  ];

  return (
    <nav className="flex md:flex-col h-full items-center md:items-stretch gap-8 md:gap-12 py-6 px-6 md:pt-12">
      <div className="hidden md:flex items-center gap-4 px-2 mb-10">
        <div className="w-12 h-12 bg-primary rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-primary/30 ring-4 ring-primary/10">
          <span className="text-2xl font-bold font-headline">한</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-headline font-bold text-foreground tracking-tighter leading-none">ハングル・マスター</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Korean Edition</span>
        </div>
      </div>
      
      <div className="flex md:flex-col gap-3 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex flex-col md:flex-row items-center gap-4 px-4 py-4 rounded-3xl transition-all duration-300",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6 transition-transform group-hover:scale-110", isActive ? "text-white" : "")} />
              <span className="text-xs md:text-base font-bold tracking-tight">{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="hidden md:flex flex-col gap-2 p-4 rounded-[2rem] bg-muted/50 mt-auto">
        <button className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 text-left">
          <Info className="w-4 h-4" /> アプリについて
        </button>
        <button className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 text-left">
          <Settings className="w-4 h-4" /> 設定
        </button>
      </div>
    </nav>
  );
}
