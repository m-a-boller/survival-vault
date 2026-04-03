'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getShoppingList, purchaseItem, Item } from '@/lib/api';
import Sidebar from '@/components/layout/sidebar';
import { Check, ShoppingCart, Loader2 } from 'lucide-react';

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

  if (isLoading) return <div className="p-8 bg-black text-white min-h-screen font-black uppercase tracking-tighter">Lade Einkaufsliste...</div>;

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-black uppercase tracking-tighter">Einkaufsliste</h1>
          </div>
          <p className="text-zinc-500 font-bold uppercase tracking-tight text-[11px]">Fehlende Vorräte, die aufgestockt werden müssen.</p>
        </header>

        <section className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 border-b border-zinc-800 bg-zinc-900/30">
                <th className="px-6 py-5">Item & Kategorie</th>
                <th className="px-6 py-5">Bestand</th>
                <th className="px-6 py-5">Soll-Bestand</th>
                <th className="px-6 py-5">Nachkauf</th>
                <th className="px-6 py-5 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {Array.isArray(shoppingItems) && shoppingItems.map((item) => (
                <tr key={item.id} className="group hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-black text-zinc-100 uppercase tracking-tighter text-base">{item.name}</div>
                    <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">{item.category}</div>
                  </td>
                  <td className="px-6 py-5 font-mono text-zinc-400 font-bold">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-6 py-5 font-mono text-zinc-400 font-bold">
                    {item.min_quantity} {item.unit}
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1.5 rounded font-black font-mono text-xs border border-yellow-500/20">
                      +{item.amount_to_buy} {item.unit}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => purchaseMutation.mutate(item.id)}
                      disabled={purchaseMutation.isPending}
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                      {purchaseMutation.isPending && purchaseMutation.variables === item.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                      Gekauft
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!shoppingItems || (Array.isArray(shoppingItems) && shoppingItems.length === 0)) && (
            <div className="p-20 text-center bg-zinc-950">
               <div className="inline-flex p-5 bg-zinc-900 rounded-full mb-6 border border-zinc-800">
                  <Check className="h-8 w-8 text-emerald-500" />
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tighter">Vault Vollständig</h3>
               <p className="text-zinc-500 mt-2 uppercase text-[10px] font-bold tracking-[0.2em]">Keine Items auf der Einkaufsliste.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
