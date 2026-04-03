'use client';

import { useQuery } from '@tanstack/react-query';
import { getBoxByUuid, consumeItem } from '@/lib/api';
import Sidebar from '@/components/layout/sidebar';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/lib/utils';
import { Package, Minus, Plus } from 'lucide-react';

export default function BoxDetailPage() {
  const params = useParams();
  const uuid = params.id as string;

  const { data: box, isLoading, refetch } = useQuery({
    queryKey: ['box', uuid],
    queryFn: () => getBoxByUuid(uuid),
  });

  const handleConsume = async (itemId: number, amount: number) => {
    await consumeItem(itemId, amount);
    refetch();
  };

  if (isLoading) return <div className="p-8 bg-black text-white min-h-screen">Lade Box-Details...</div>;
  if (!box) return <div className="p-8 bg-black text-white min-h-screen">Box nicht gefunden.</div>;

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <Package className="h-8 w-8 text-blue-500" />
               <h1 className="text-4xl font-black uppercase tracking-tighter">Box {box.number}</h1>
            </div>
            <p className="text-zinc-500 font-mono text-sm uppercase">UUID: {box.uuid}</p>
          </div>
          
          <div className="bg-white p-2 rounded-lg no-print">
            <QRCodeSVG value={`http://localhost:3000/box/${box.uuid}`} size={120} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <section className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
               <h2 className="font-bold uppercase tracking-widest text-sm text-zinc-400">Inhalt</h2>
               <span className="text-xs text-zinc-500">{box.items?.length || 0} Items</span>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
                  <th className="px-6 py-4 font-medium">Item</th>
                  <th className="px-6 py-4 font-medium">Menge</th>
                  <th className="px-6 py-4 font-medium">Ablaufdatum</th>
                  <th className="px-6 py-4 font-medium text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {box.items?.map((item) => (
                  <tr key={item.id} className="group hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-200">{item.name}</div>
                      {item.on_shopping_list && (
                        <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded uppercase font-bold mt-1 inline-block">
                          Einkaufsliste
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                       <span className="font-mono text-zinc-400">{item.quantity} {item.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                       <div className={cn(
                         "inline-flex items-center px-2 py-1 rounded text-xs font-bold font-mono",
                         item.expiry_status === 'CRITICAL' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                         item.expiry_status === 'WARNING' ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                         "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                       )}>
                         {item.expiry_date || 'N/A'}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleConsume(item.id, 1)}
                            className="p-1.5 hover:bg-zinc-800 rounded border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                          >
                             <Minus className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1.5 hover:bg-zinc-800 rounded border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                          >
                             <Plus className="h-4 w-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(!box.items || box.items.length === 0) && (
              <div className="p-12 text-center text-zinc-600 text-sm">
                 Diese Box ist leer.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
