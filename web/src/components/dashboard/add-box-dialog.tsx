'use client';

import { useState, ReactElement } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBox, getLocations } from '@/lib/api';
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
import { Plus, Loader2, Package } from 'lucide-react';

interface AddBoxDialogProps {
  trigger?: ReactElement;
  initialLocationId?: number;
}

export default function AddBoxDialog({ trigger, initialLocationId }: AddBoxDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations
  });

  const mutation = useMutation({
    mutationFn: createBox,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boxes'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setOpen(false);
      toast.success('Box erfolgreich registriert.');
    },
    onError: () => {
      toast.error('Fehler bei der Box-Registrierung.');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    mutation.mutate({
      number: formData.get('number') as string,
      location_id: parseInt(formData.get('location_id') as string),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger || (
        <div role="button" className="inline-flex items-center justify-center bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800 font-bold uppercase tracking-widest text-[10px] px-6 h-10 rounded-xl transition-all cursor-pointer">
          <Package className="mr-2 h-4 w-4" /> Neue Box
        </div>
      )} />
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Lagerbox registrieren</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="number" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Box-Nummer / ID</Label>
            <Input id="number" name="number" required className="bg-zinc-900 border-zinc-800 focus:ring-blue-500 font-mono" placeholder="z.B. BOX-042" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location_id" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Standort-Zuweisung</Label>
            <select 
              id="location_id" 
              name="location_id" 
              required 
              defaultValue={initialLocationId}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Standort wählen...</option>
              {locations?.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-[10px] h-12 rounded-xl transition-all"
            >
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Box im System erfassen'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
