'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getShoppingList, purchaseItem, Item } from '@/lib/api';
import Sidebar from '@/components/layout/sidebar';
import { Check, ShoppingCart, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export default function ShoppingListPage() {
  const queryClient = useQueryClient();
  const { data: shoppingItems, isLoading } = useQuery({
    queryKey: ['shopping-list'],
    queryFn: () => getShoppingList(false) as Promise<Item[]>,
  });

  const purchaseMutation = useMutation({
    mutationFn: (itemId: number) => purchaseItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-list'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  if (isLoading) return <div className="p-8 bg-black text-white min-h-screen">Lade Einkaufsliste...</div>;

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-black uppercase tracking-tighter">Einkaufsliste</h1>
          </div>
          <p className="text-zinc-500 font-medium tracking-tight">Fehlende Vorräte, die aufgestockt werden müssen.</p>
        </header>

        <section className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur-md">
                <th className="px-6 py-4 font-bold">Item & Kategorie</th>
                <th className="px-6 py-4 font-bold">Bestand</th>
                <th className="px-6 py-4 font-bold">Soll-Bestand</th>
                <th className="px-6 py-4 font-bold">Nachkauf</th>
                <th className="px-6 py-4 font-bold text-right">Aktion</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-zinc-800/50"
            >
              <AnimatePresence>
                {Array.isArray(shoppingItems) && shoppingItems.map((item) => (
                  <motion.tr 
                    variants={itemVariants}
                    exit="exit"
                    layout
                    key={item.id} 
                    className="group hover:bg-zinc-900/40 transition-colors relative"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-200">{item.name}</div>
                      <div className="text-[10px] text-zinc-500 uppercase font-mono mt-0.5">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-zinc-400">
                      {item.quantity} <span className="text-[10px] text-zinc-600">{item.unit}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-zinc-400">
                      {item.min_quantity} <span className="text-[10px] text-zinc-600">{item.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-2 py-1 rounded font-black font-mono text-sm shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                        +{item.amount_to_buy} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => purchaseMutation.mutate(item.id)}
                        disabled={purchaseMutation.isPending}
                        className="inline-flex items-center gap-2 bg-emerald-600/90 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-emerald-900/20"
                      >
                        {purchaseMutation.isPending && purchaseMutation.variables === item.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                        Gekauft
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </motion.tbody>
          </table>
          
          {(!shoppingItems || (Array.isArray(shoppingItems) && shoppingItems.length === 0)) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-20 text-center"
            >
               <div className="inline-flex p-4 bg-zinc-900/50 backdrop-blur-md rounded-full mb-4 border border-zinc-800 shadow-inner">
                  <Check className="h-8 w-8 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               </div>
               <h3 className="text-xl font-bold uppercase tracking-tight text-zinc-200">Alles Vorhanden</h3>
               <p className="text-zinc-500 mt-1 uppercase text-xs font-bold tracking-widest">Keine Items auf der Einkaufsliste.</p>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}
