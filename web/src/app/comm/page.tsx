'use client';

import Sidebar from '@/components/layout/sidebar';
import { MessageSquare, Radio, Signal } from 'lucide-react';

export default function CommunicationPage() {
  const channels = [
    { name: 'Notfall-Radio (FM/AM)', status: 'Bereit', frequency: '88.1 MHz', strength: 85 },
    { name: 'Satelliten-Link (Alpha)', status: 'Inaktiv', frequency: 'K-Band', strength: 0 },
    { name: 'Lokales Mesh-Netz', status: 'Bereit', frequency: 'LoRa 868MHz', strength: 92 },
  ];

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-black uppercase tracking-tighter italic text-zinc-100">Kommunikations-Zentrale</h1>
          </div>
          <p className="text-zinc-500 font-bold uppercase tracking-tight text-[11px] font-mono">Signal-Überwachung und Frequenz-Management.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {channels.map((ch) => (
             <div key={ch.name} className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-2xl hover:border-zinc-700 transition-all">
                <div className="flex justify-between items-start mb-6">
                   <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                      <Radio className="h-5 w-5 text-blue-400" />
                   </div>
                   <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                     ch.status === 'Bereit' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                   }`}>
                      {ch.status}
                   </span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter italic mb-1">{ch.name}</h3>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-6">FREQ: {ch.frequency}</p>
                
                <div className="space-y-2">
                   <div className="flex justify-between text-[9px] font-black uppercase text-zinc-600 tracking-widest">
                      <span>Signal-Stärke</span>
                      <span>{ch.strength}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-1000" 
                        style={{ width: `${ch.strength}%` }}
                      />
                   </div>
                </div>
             </div>
           ))}
        </div>

        <div className="mt-12 bg-zinc-950 border border-zinc-800 rounded-3xl p-10 flex flex-col items-center text-center">
           <div className="p-4 bg-zinc-900 rounded-full mb-6 border border-zinc-800 animate-pulse">
              <Signal className="h-10 w-10 text-zinc-500" />
           </div>
           <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-2 text-zinc-200">Scanning for Broadcasts...</h2>
           <p className="max-w-md text-zinc-500 text-xs font-medium leading-relaxed">
              Die autonome Frequenz-Überwachung ist aktiv. Alle eingehenden Signale werden auf der verschlüsselten Blackbox gesichert.
           </p>
        </div>
      </main>
    </div>
  );
}
