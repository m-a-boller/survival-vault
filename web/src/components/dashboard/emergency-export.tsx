'use client';

import { useState } from 'react';
import { downloadEmergencyLedger } from '@/lib/api';
import { FileText, Loader2, Download } from 'lucide-react';

export default function EmergencyExport() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadEmergencyLedger();
    } catch (error) {
      console.error('Failed to download report', error);
      alert('Export fehlgeschlagen. Ist das Backend erreichbar?');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-500/10 rounded-lg">
          <FileText className="h-5 w-5 text-red-500" />
        </div>
        <h3 className="text-lg font-medium uppercase tracking-tighter">System-Backup</h3>
      </div>
      
      <p className="text-sm text-zinc-500 mb-6 font-medium leading-relaxed">
        Generiere ein offline-fähiges Inventar-Verzeichnis für Notfälle. Minimalistisches, druckfreundliches Design.
      </p>

      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-3 rounded-lg font-bold uppercase tracking-[0.15em] text-[9px] hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDownloading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Generiere Ledger...
          </>
        ) : (
          <>
            <Download className="h-3.5 w-3.5" />
            Export Emergency Ledger (PDF)
          </>
        )}
      </button>
    </div>
  );
}
