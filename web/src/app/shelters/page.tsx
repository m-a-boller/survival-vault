'use client';

import dynamic from 'next/dynamic';
import Sidebar from '@/components/layout/sidebar';
import { MapPin, Shield, Droplets, Flame } from 'lucide-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getShelters, createShelter, Shelter } from '@/lib/api';

const ShelterMap = dynamic(() => import('@/components/shelters/shelter-map'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-zinc-950 animate-pulse flex items-center justify-center text-zinc-500 font-black uppercase tracking-widest italic">Syncing Global Geospatial Data...</div>
});

export default function SheltersPage() {
  const queryClient = useQueryClient();
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  
  const { data: shelters, isLoading } = useQuery({
    queryKey: ['shelters'],
    queryFn: getShelters,
  });

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col relative">
        <div className="flex-1 z-0 grayscale invert contrast-[1.1] brightness-[0.7]">
           <ShelterMap 
             shelters={shelters || []} 
             onMarkerClick={(s) => setSelectedShelter(s)}
             onMapClick={(lat, lng) => {
                console.log("Map Clicked at", lat, lng);
             }}
           />
        </div>

        <div className="absolute top-8 left-8 z-10 pointer-events-none">
           <div className="bg-black/90 backdrop-blur-3xl border border-zinc-800 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto border-l-4 border-l-blue-600">
              <div className="flex items-center gap-4 mb-2">
                 <MapPin className="h-8 w-8 text-blue-500" />
                 <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Shelter Mapping</h1>
              </div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Geospatial Strategic Intelligence</p>
           </div>
        </div>

        {selectedShelter && (
          <div className="absolute top-0 right-0 h-full w-[450px] bg-black/95 backdrop-blur-3xl border-l border-zinc-800 z-20 shadow-2xl animate-in slide-in-from-right duration-500 border-t-4 border-t-blue-600">
             <div className="p-10 space-y-10">
                <div className="flex justify-between items-start">
                   <div className="space-y-2">
                      <h2 className="text-5xl font-black uppercase tracking-tighter italic text-zinc-100 leading-none">{selectedShelter.name}</h2>
                      <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                         {selectedShelter.type}
                      </div>
                   </div>
                   <button 
                     onClick={() => setSelectedShelter(null)}
                     className="bg-zinc-900 p-2 rounded-full text-zinc-500 hover:text-white transition-all border border-zinc-800"
                   >
                      CLOSE
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 shadow-inner">
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-2">Cap. PAX</p>
                      <p className="text-4xl font-black font-mono tracking-tighter">{selectedShelter.capacity}</p>
                   </div>
                   <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 shadow-inner">
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-2">Security</p>
                      <p className="text-sm font-black uppercase text-emerald-500 tracking-widest flex items-center gap-2">
                         <Shield className="h-4 w-4" /> VERIFIED
                      </p>
                   </div>
                </div>

                <div className="space-y-5">
                   <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-zinc-900 pb-2">Ressourcen & Logistik</h3>
                   <div className="grid grid-cols-1 gap-3">
                      {selectedShelter.water_source && (
                        <div className="flex items-center gap-4 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
                           <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                              <Droplets className="h-5 w-5 text-blue-400" />
                           </div>
                           <span className="text-xs font-black uppercase tracking-widest">Autonome Wasserquelle</span>
                        </div>
                      )}
                      {selectedShelter.heat_source && (
                        <div className="flex items-center gap-4 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
                           <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                              <Flame className="h-5 w-5 text-orange-500" />
                           </div>
                           <span className="text-xs font-black uppercase tracking-widest">Heizquelle / Energie</span>
                        </div>
                      )}
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-zinc-900 pb-2">Geodaten</h3>
                   <div className="bg-zinc-900 p-6 rounded-2xl font-mono text-xs text-blue-500 border border-zinc-800 shadow-inner space-y-1">
                      <p className="flex justify-between"><span className="text-zinc-600">LAT:</span> {selectedShelter.lat}</p>
                      <p className="flex justify-between"><span className="text-zinc-600">LNG:</span> {selectedShelter.lng}</p>
                   </div>
                </div>

                {selectedShelter.notes && (
                  <div className="space-y-4">
                     <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-zinc-900 pb-2">Intelligence Briefing</h3>
                     <p className="text-xs text-zinc-400 leading-relaxed font-medium italic bg-zinc-900/30 p-6 rounded-2xl border border-zinc-900">
                        "{selectedShelter.notes}"
                     </p>
                  </div>
                )}
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
