'use client';

import { useState, ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLocation } from '@/lib/api';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Loader2, MapPin } from 'lucide-react';

interface AddLocationDialogProps {
  trigger?: ReactNode;
}

export default function AddLocationDialog({ trigger }: AddLocationDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setOpen(false);
      toast.success('Lagerort erfolgreich erstellt.');
    },
    onError: () => {
      toast.error('Fehler beim Erstellen des Lagerorts.');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    mutation.mutate({
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border-zinc-800 font-bold uppercase tracking-widest text-[10px] px-6 h-10 rounded-xl transition-all">
            <MapPin className="mr-2 h-4 w-4" /> Neuer Ort
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Lagerort erstellen</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Name des Standorts</Label>
            <Input id="name" name="name" required className="bg-zinc-900 border-zinc-800 focus:ring-blue-500" placeholder="z.B. Keller-Archiv" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Beschreibung (optional)</Label>
            <textarea 
              id="description" 
              name="description" 
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Zusätzliche Infos zum Zugang oder Sicherheit..."
            />
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-[10px] h-12 rounded-xl transition-all"
            >
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lagerort im System sichern'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
