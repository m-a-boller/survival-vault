'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Package, 
  MessageSquare, 
  ShieldAlert, 
  Home, 
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Lager', href: '/', icon: Package },
  { name: 'Kommunikation', href: '/comm', icon: MessageSquare },
  { name: 'Waffen & Munition', href: '/armory', icon: ShieldAlert },
  { name: 'Shelter', href: '/shelter', icon: Home },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-zinc-950 border-r border-zinc-800 no-print">
      <div className="flex h-16 items-center px-6 border-b border-zinc-800">
        <span className="text-xl font-bold tracking-tight text-white">SURVIVAL VAULT</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              )}
            >
              <item.icon className={cn('mr-3 h-5 w-5', isActive ? 'text-white' : 'text-zinc-500')} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-zinc-800">
         <div className="flex items-center text-zinc-400 text-sm">
            <Settings className="mr-3 h-5 w-5" />
            Einstellungen
         </div>
      </div>
    </div>
  );
}
