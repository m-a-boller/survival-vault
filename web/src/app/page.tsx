'use client';

import { useQuery } from '@tanstack/react-query';
import { getLocations, getItems } from '@/lib/api';
import Sidebar from '@/components/layout/sidebar';
import { Package, AlertTriangle, ShoppingCart } from 'lucide-react';

export default function Dashboard() {
  const { data: locations, isLoading: locLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ['items'],
    queryFn: getItems,
  });

  const stats = [
    { name: 'Gesamt-Items', value: items?.length || 0, icon: Package, color: 'text-blue-500' },
    { name: 'Ablaufend', value: 0, icon: AlertTriangle, color: 'text-yellow-500' },
    { name: 'Einkaufsliste', value: items?.filter(i => i.on_shopping_list).length || 0, icon: ShoppingCart, color: 'text-red-500' },
  ];

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lagerverwaltung</h1>
            <p className="text-zinc-400 mt-1">Überblick über deine Vorräte und Ausrüstung.</p>
          </div>
          <button className="bg-white text-black px-4 py-2 rounded-md font-medium text-sm hover:bg-zinc-200 transition-colors no-print">
            Neues Item hinzufügen
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-10">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.name}</span>
              </div>
              <div className="text-4xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Locations Grid */}
        <h2 className="text-xl font-semibold mb-4">Lagerorte</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations?.map((loc) => (
            <div key={loc.id} className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-all cursor-pointer group">
              <h3 className="text-lg font-medium group-hover:text-blue-400 transition-colors">{loc.name}</h3>
              <p className="text-zinc-500 text-sm mt-1">{loc.description || 'Keine Beschreibung'}</p>
              <div className="mt-4 flex items-center text-xs text-zinc-400">
                 <span className="bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                    {loc.boxes?.length || 0} Boxen
                 </span>
              </div>
            </div>
          ))}
          {!locLoading && (!locations || locations.length === 0) && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-800 rounded-xl">
               <p className="text-zinc-500">Keine Lagerorte gefunden. Erstelle deinen ersten Ort im Backend.</p>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .bg-zinc-950, .bg-black { background: white !important; }
          .border-zinc-800 { border-color: #eee !important; }
          main { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}
