'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Package, 
  MessageSquare, 
  ShieldAlert, 
  Home, 
  Settings,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getShoppingList, Item } from '@/lib/api';

const navigation = [
  { name: 'Lager', href: '/', icon: Package },
  { name: 'Einkaufsliste', href: '/shopping', icon: ShoppingCart, badge: true },
  { name: 'Kommunikation', href: '/comm', icon: MessageSquare },
  { name: 'Waffen & Munition', href: '/armory', icon: ShieldAlert },
  { name: 'Shelter', href: '/shelter', icon: Home },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: shoppingItems } = useQuery({
    queryKey: ['shopping-list'],
    queryFn: () => getShoppingList(false) as Promise<Item[]>,
  });

  const shoppingCount = Array.isArray(shoppingItems) ? shoppingItems.length : 0;

  return (
    <div className="flex h-full w-64 flex-col bg-zinc-950 border-r border-zinc-800 no-print">
      <div className="flex h-16 items-center px-6 border-b border-zinc-800">
        <span className="text-xl font-black tracking-tighter text-white uppercase italic">Survival Vault</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center justify-between px-3 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-md transition-all',
                isActive 
                  ? 'bg-zinc-900 text-white border border-zinc-800' 
                  : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
              )}
            >
              <div className="flex items-center">
                <item.icon className={cn('mr-3 h-4 w-4 transition-colors', isActive ? 'text-blue-500' : 'text-zinc-600 group-hover:text-zinc-400')} />
                {item.name}
              </div>
              {item.badge && shoppingCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-black text-white shadow-lg shadow-red-900/20">
                  {shoppingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-zinc-800">
         <div className="flex items-center text-zinc-600 text-[9px] font-black uppercase tracking-widest hover:text-zinc-400 cursor-pointer transition-colors">
            <Settings className="mr-3 h-4 w-4" />
            System-Setup
         </div>
      </div>
    </div>
  );
}
