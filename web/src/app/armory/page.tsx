'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWeapons, getArsenalStats, getAmmunition, cleanWeapon } from '@/lib/api';
import Sidebar from '@/components/layout/sidebar';
import AddWeaponDialog from '@/components/armory/add-weapon-dialog';
import AddAmmoDialog from '@/components/armory/add-ammo-dialog';
import { ShieldAlert, Crosshair, Droplets, AlertTriangle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
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

export default function ArmoryPage() {
  const queryClient = useQueryClient();
  const { data: weapons, isLoading: weaponsLoading } = useQuery({
    queryKey: ['weapons'],
    queryFn: getWeapons,
  });

  const { data: ammoStats, isLoading: statsLoading } = useQuery({
    queryKey: ['arsenal-stats'],
    queryFn: getArsenalStats,
  });

  const { data: ammunition } = useQuery({
    queryKey: ['ammunition'],
    queryFn: getAmmunition,
  });

  const cleanMutation = useMutation({
    mutationFn: (weaponId: number) => cleanWeapon(weaponId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weapons'] });
      toast.success('Wartungsprotokoll aktualisiert.');
    },
  });

  if (weaponsLoading || statsLoading) return <div className="p-8 bg-black text-white min-h-screen font-black uppercase tracking-tighter italic">Initialisiere Waffenkammer...</div>;

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="h-8 w-8 text-red-500" />
              <h1 className="text-4xl font-black uppercase tracking-tighter italic text-zinc-100 leading-none">Arsenal & Logistik</h1>
            </div>
            <p className="text-zinc-500 font-bold uppercase tracking-tight text-[11px] font-mono">Gefechtsbereitschaft: Wartung und Munitionsvorrat.</p>
          </div>
          <div className="flex gap-3">
             <AddAmmoDialog trigger={
               <button className="bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800 font-bold uppercase tracking-widest text-[10px] px-6 h-10 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center">
                  <Package className="mr-2 h-4 w-4" /> Munition aufstocken
               </button>
             } />
             <AddWeaponDialog trigger={
               <button className="bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-[10px] px-6 h-10 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center">
                  <Crosshair className="mr-2 h-4 w-4" /> Neue Waffe
               </button>
             } />
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 italic">
               <Crosshair className="h-5 w-5 text-blue-500" />
               Ausrüstung
            </h2>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {weapons?.map((weapon) => (
                <motion.div variants={itemVariants} key={weapon.id} className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 hover:border-blue-900/50 hover:bg-zinc-900/40 transition-all group shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-100 italic leading-tight">{weapon.model}</h3>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Ref: {weapon.serial_number}</p>
                    </div>
                    <span className="bg-zinc-900 text-blue-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-zinc-800">
                      {weapon.caliber}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
                       <p className="text-[9px] text-zinc-600 uppercase font-black mb-1 tracking-widest">Kategorie</p>
                       <p className="text-xs font-black uppercase tracking-tight text-zinc-300">{weapon.type}</p>
                    </div>
                    <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
                       <p className="text-[9px] text-zinc-600 uppercase font-black mb-1 tracking-widest">Wartung</p>
                       <p className={cn(
                         "text-xs font-black uppercase tracking-tight font-mono",
                         weapon.days_since_cleaning > 30 ? "text-yellow-500" : "text-emerald-500"
                       )}>
                         {weapon.days_since_cleaning}D AGO
                       </p>
                    </div>
                  </div>

                  <button
                    onClick={() => cleanMutation.mutate(weapon.id)}
                    disabled={cleanMutation.isPending}
                    className="w-full flex items-center justify-center gap-3 bg-zinc-900 hover:bg-white hover:text-black text-zinc-300 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-zinc-800"
                  >
                    <Droplets className="h-4 w-4" />
                    Cleaned Today
                  </button>
                </motion.div>
              ))}
              {(!weapons || weapons.length === 0) && (
                <motion.div variants={itemVariants} className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800/50 rounded-2xl bg-zinc-950/30">
                   <p className="text-zinc-600 uppercase text-xs font-black tracking-widest">Keine Waffensysteme registriert.</p>
                </motion.div>
              )}
            </motion.div>
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 italic">
               <Package className="h-5 w-5 text-yellow-500" />
               Munitions-Radar
            </h2>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {ammoStats?.map((stat) => (
                <motion.div variants={itemVariants} key={stat.caliber} className={cn(
                  "bg-zinc-950/80 backdrop-blur-xl border p-6 rounded-2xl flex items-center justify-between transition-all relative overflow-hidden",
                  stat.is_critical ? "border-red-600/50 bg-red-950/10 shadow-[0_0_30px_rgba(220,38,38,0.15)]" : "border-zinc-800/50"
                )}>
                  {stat.is_critical && <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent" />}
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-black uppercase tracking-tighter italic">{stat.caliber}</h4>
                      {stat.is_critical && <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />}
                    </div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Stock</p>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-3xl font-black font-mono tracking-tighter",
                      stat.is_critical ? "text-red-500" : "text-emerald-500"
                    )}>
                      {stat.total_quantity}
                    </div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Units</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl"
            >
               <div className="bg-zinc-900/30 px-5 py-4 border-b border-zinc-800/50 backdrop-blur-md">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">Inventory Logs</h3>
               </div>
               <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
                 {ammunition?.map((ammo) => (
                   <div key={ammo.id} className="flex justify-between items-center text-[10px] border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
                      <div>
                        <span className="font-black text-zinc-200 uppercase tracking-tight">{ammo.brand} {ammo.type}</span>
                        <p className="text-zinc-600 font-mono mt-0.5">{ammo.caliber}</p>
                      </div>
                      <span className="font-black text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">{ammo.quantity}</span>
                   </div>
                 ))}
               </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
