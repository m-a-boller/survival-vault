'use client';

import { useQuery } from '@tanstack/react-query';
import { getItems } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function ExpiryRadar() {
  const { data: items } = useQuery({
    queryKey: ['items'],
    queryFn: getItems,
  });

  const critical = items?.filter(i => i.expiry_status === 'CRITICAL') || [];
  const warning = items?.filter(i => i.expiry_status === 'WARNING') || [];
  const healthy = items?.filter(i => i.expiry_status === 'HEALTHY' && i.expiry_date) || [];

  const total = critical.length + warning.length + healthy.length;
  
  const getPercent = (count: number) => total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
      <h3 className="text-lg font-medium mb-4 uppercase tracking-tighter">Expiry Radar</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-[10px] mb-1 uppercase tracking-widest">
            <span className="text-red-500 font-bold">Critical (&lt; 30d)</span>
            <span className="text-zinc-400">{critical.length} Items</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 transition-all duration-500" 
              style={{ width: `${getPercent(critical.length)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] mb-1 uppercase tracking-widest">
            <span className="text-yellow-500 font-bold">Warning (&lt; 90d)</span>
            <span className="text-zinc-400">{warning.length} Items</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-600 transition-all duration-500" 
              style={{ width: `${getPercent(warning.length)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] mb-1 uppercase tracking-widest">
            <span className="text-emerald-500 font-bold">Healthy</span>
            <span className="text-zinc-400">{healthy.length} Items</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 transition-all duration-500" 
              style={{ width: `${getPercent(healthy.length)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-zinc-800">
        <h4 className="text-[10px] font-bold mb-3 text-zinc-500 uppercase tracking-widest">Top Rotation Priorities</h4>
        <div className="space-y-3">
           {items?.filter(i => i.expiry_date).sort((a, b) => new Date(a.expiry_date!).getTime() - new Date(b.expiry_date!).getTime()).slice(0, 5).map(item => (
             <div key={item.id} className="flex justify-between items-center text-xs">
                <span className="text-zinc-300 truncate mr-2 font-medium">{item.name}</span>
                <span className={cn(
                  "font-mono px-1.5 py-0.5 rounded text-[10px] font-bold",
                  item.expiry_status === 'CRITICAL' ? "bg-red-500/10 text-red-500" : 
                  item.expiry_status === 'WARNING' ? "bg-yellow-500/10 text-yellow-500" : "bg-zinc-900 text-zinc-500"
                )}>
                  {item.expiry_date}
                </span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
