'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLocations, getItems } from '@/lib/api';
import Sidebar from '@/components/layout/sidebar';
import ExpiryRadar from '@/components/dashboard/expiry-radar';
import EmergencyExport from '@/components/dashboard/emergency-export';
import AddItemDialog from '@/components/dashboard/add-item-dialog';
import AddBoxDialog from '@/components/dashboard/add-box-dialog';
import AddLocationDialog from '@/components/dashboard/add-location-dialog';
import { Package, AlertTriangle, ShoppingCart, Printer, ChevronRight, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  const { data: locations, isLoading: locLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });

  const { data: items } = useQuery({
    queryKey: ['items'],
    queryFn: getItems,
  });

  const selectedLocation = locations?.find(l => l.id === selectedLocationId);

  const stats = [
    { name: 'Gesamt-Items', value: items?.length || 0, icon: Package, color: 'text-blue-500' },
    { name: 'Kritisch', value: items?.filter(i => i.expiry_status === 'CRITICAL').length || 0, icon: AlertTriangle, color: 'text-red-500' },
    { name: 'Einkaufsliste', value: items?.filter(i => i.on_shopping_list).length || 0, icon: ShoppingCart, color: 'text-yellow-500' },
  ];

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-1">
               {selectedLocationId && (
                 <button 
                   onClick={() => setSelectedLocationId(null)}
                   className="mr-2 p-1 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-all"
                 >
                    <ArrowLeft className="h-5 w-5" />
                 </button>
               )}
               <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
                 {selectedLocation ? selectedLocation.name : 'Survival Dashboard'}
               </h1>
            </div>
            <p className="text-zinc-500 font-bold uppercase tracking-tight text-[11px] font-mono">
              {selectedLocation ? `Verwaltung der Boxen in ${selectedLocation.name}` : 'Status der Vorräte und Expiry-Rotation.'}
            </p>
          </div>
          
          <div className="flex gap-3 no-print">
            {!selectedLocationId ? (
              <>
                <Link 
                  href="/print/labels" 
                  className="flex items-center bg-zinc-950 text-zinc-500 hover:text-white px-4 py-2 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-900 transition-all border border-zinc-800"
                >
                  <Printer className="mr-2 h-3.5 w-3.5" />
                  Labels
                </Link>
                <AddLocationDialog />
              </>
            ) : (
              <AddBoxDialog initialLocationId={selectedLocationId} trigger={
                <button className="bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest text-[10px] px-6 h-10 rounded-xl flex items-center gap-2 transition-all cursor-pointer">
                  <Plus className="h-4 w-4" /> Box hinzufügen
                </button>
              } />
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2 space-y-12">
              {!selectedLocationId && (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 gap-6 sm:grid-cols-3"
                >
                  {stats.map((stat) => (
                    <motion.div variants={itemVariants} key={stat.name} className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">{stat.name}</span>
                      </div>
                      <div className="text-4xl font-black font-mono tracking-tighter italic relative z-10">{stat.value}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <section>
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-500" />
                      {selectedLocationId ? 'Inventar-Boxen' : 'Lagerorte'}
                   </h2>
                </div>

                {!selectedLocationId ? (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    {locations?.map((loc) => (
                      <motion.div 
                        variants={itemVariants}
                        key={loc.id} 
                        onClick={() => setSelectedLocationId(loc.id)}
                        className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 p-6 rounded-2xl hover:border-blue-900/50 hover:bg-zinc-900/40 transition-all cursor-pointer group shadow-2xl relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="flex justify-between items-start mb-4 relative z-10">
                           <h3 className="text-xl font-black uppercase tracking-tighter group-hover:text-blue-500 transition-colors italic">{loc.name}</h3>
                           <ChevronRight className="h-5 w-5 text-zinc-800 group-hover:text-blue-500 transition-all transform group-hover:translate-x-1" />
                        </div>
                        <p className="text-zinc-500 text-xs font-medium leading-relaxed line-clamp-2 mb-6 relative z-10">{loc.description || 'Keine strategischen Notizen hinterlegt.'}</p>
                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-zinc-400 relative z-10">
                           <span className="bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800 font-mono shadow-inner">
                              {loc.boxes?.length || 0} Einheiten
                           </span>
                        </div>
                      </motion.div>
                    ))}
                    {!locLoading && (!locations || locations.length === 0) && (
                      <motion.div variants={itemVariants} className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800/50 rounded-3xl bg-zinc-950/30 backdrop-blur-sm">
                         <div className="inline-flex p-4 bg-zinc-900/50 rounded-full mb-4 border border-zinc-800 shadow-inner">
                            <Package className="h-8 w-8 text-zinc-700" />
                         </div>
                         <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-300">Vault ist leer</h3>
                         <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mt-2 mb-8">Beginne mit der Erfassung deines ersten Standorts.</p>
                         <AddLocationDialog trigger={
                           <button className="bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] inline-flex items-center justify-center cursor-pointer">
                              Ersten Ort anlegen
                           </button>
                         } />
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 gap-8"
                  >
                     {selectedLocation?.boxes?.map((box) => (
                       <motion.div variants={itemVariants} key={box.id} className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl">
                          <div className="px-6 py-4 bg-zinc-900/30 border-b border-zinc-800/50 flex justify-between items-center backdrop-blur-md">
                             <div>
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1 block">Logistik-Einheit</span>
                                <h3 className="text-xl font-black uppercase tracking-tighter italic text-zinc-100">Box {box.number}</h3>
                             </div>
                             <AddItemDialog initialBoxId={box.id} trigger={
                               <button className="bg-zinc-800/80 hover:bg-white hover:text-black text-zinc-300 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-700 shadow-sm">
                                  + Item hinzufügen
                               </button>
                             } />
                          </div>
                          <div className="p-6">
                             {box.items && box.items.length > 0 ? (
                               <div className="space-y-3">
                                  {box.items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center p-3 bg-zinc-900/20 rounded-xl border border-zinc-800/50 group hover:border-zinc-700 transition-all hover:bg-zinc-900/50">
                                       <div>
                                          <p className="text-sm font-black uppercase tracking-tight text-zinc-200">{item.name}</p>
                                          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{item.category}</p>
                                       </div>
                                       <div className="text-right flex items-center gap-4">
                                          <p className="text-sm font-black font-mono text-zinc-400">{item.quantity} <span className="text-[10px] text-zinc-600">{item.unit}</span></p>
                                          <div className={cn(
                                            "h-1.5 w-12 rounded-full",
                                            item.expiry_status === 'CRITICAL' ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]" : 
                                            item.expiry_status === 'WARNING' ? "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]" : "bg-emerald-500/50"
                                          )} />
                                       </div>
                                    </div>
                                  ))}
                               </div>
                             ) : (
                               <p className="text-center py-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">Kein Inhalt erfasst</p>
                             )}
                          </div>
                       </motion.div>
                     ))}
                     {(!selectedLocation?.boxes || selectedLocation.boxes.length === 0) && (
                        <motion.div variants={itemVariants} className="py-20 text-center border-2 border-dashed border-zinc-800/50 rounded-3xl bg-zinc-950/30">
                           <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">Keine Boxen in diesem Sektor erfasst.</p>
                        </motion.div>
                     )}
                  </motion.div>
                )}
              </section>
           </div>

           <div className="space-y-10">
              <ExpiryRadar />
              <EmergencyExport />
           </div>
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
