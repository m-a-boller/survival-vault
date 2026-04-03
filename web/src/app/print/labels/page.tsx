'use client';

import { useQuery } from '@tanstack/react-query';
import { getBoxes } from '@/lib/api';
import { QRCodeSVG } from 'qrcode.react';

export default function LabelsPage() {
  const { data: boxes, isLoading } = useQuery({
    queryKey: ['boxes'],
    queryFn: getBoxes,
  });

  if (isLoading) return <div className="p-8">Lade Boxen für Labels...</div>;

  return (
    <div className="bg-white min-h-screen text-black p-4 sm:p-8">
      <div className="no-print mb-8 bg-zinc-100 p-4 rounded-lg flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tighter">Box Labels Druckansicht</h1>
          <p className="text-sm text-zinc-600">Generiere physische QR-Tags für deine Vorräte.</p>
        </div>
        <button 
          onClick={() => window.print()} 
          className="bg-black text-white px-6 py-2 rounded-md font-bold uppercase tracking-widest text-xs hover:bg-zinc-800 transition-colors"
        >
          Drucken (A4)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 print:grid-cols-2 print:gap-4">
        {boxes?.map((box) => (
          <div 
            key={box.id} 
            className="border-2 border-black p-6 rounded-none flex flex-col items-center justify-between min-h-[350px] break-inside-avoid shadow-sm"
          >
            <div className="text-center w-full">
               <h2 className="text-3xl font-black uppercase tracking-tighter mb-1 truncate">{box.number}</h2>
               <div className="h-1 bg-black w-full mb-4"></div>
            </div>
            
            <div className="my-4 p-2 bg-white border-4 border-black">
              <QRCodeSVG 
                value={`http://localhost:3000/box/${box.uuid}`} 
                size={200} 
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="text-center mt-4 w-full">
               <div className="h-0.5 bg-black w-full mt-4 mb-2"></div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em]">Survival Vault - Inventory Tag</p>
               <p className="text-[10px] font-mono mt-1 text-zinc-500">{box.uuid}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @page {
          size: A4;
          margin: 1cm;
        }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          .grid { gap: 1cm !important; }
          .border-2 { border-width: 2px !important; }
        }
      `}</style>
    </div>
  );
}
