'use client';

import { useState, ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createItem, getBoxes } from '@/lib/api';
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
import { Plus, Loader2 } from 'lucide-react';

interface AddItemDialogProps {
  trigger?: ReactNode;
  initialBoxId?: number;
}

export default function AddItemDialog({ trigger, initialBoxId }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: boxes } = useQuery({
    queryKey: ['boxes'],
    queryFn: getBoxes
  });

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['shopping-list'] });
      queryClient.invalidateQueries({ queryKey: ['box'] });
      setOpen(false);
      toast.success('Item erfolgreich hinzugefügt.');
    },
    onError: () => {
      toast.error('Fehler beim Hinzufügen des Items.');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    mutation.mutate({
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      quantity: parseFloat(formData.get('quantity') as string),
      unit: formData.get('unit') as string,
      min_quantity: parseFloat(formData.get('min_quantity') as string),
      expiry_date: formData.get('expiry_date') as string || undefined,
      box_id: parseInt(formData.get('box_id') as string),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-[10px] px-6 h-10 rounded-xl">
            <Plus className="mr-2 h-4 w-4" /> Neues Item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Item registrieren</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Bezeichnung</Label>
            <Input id="name" name="name" required className="bg-zinc-900 border-zinc-800 focus:ring-blue-500" placeholder="z.B. Reis (5kg)" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Kategorie</Label>
              <Input id="category" name="category" defaultValue="Nahrung" className="bg-zinc-900 border-zinc-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry_date" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ablaufdatum</Label>
              <Input id="expiry_date" name="expiry_date" type="date" className="bg-zinc-900 border-zinc-800" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Bestand</Label>
              <Input id="quantity" name="quantity" type="number" step="0.1" required className="bg-zinc-900 border-zinc-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Einheit</Label>
              <Input id="unit" name="unit" placeholder="Pkg" required className="bg-zinc-900 border-zinc-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_quantity" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Min</Label>
              <Input id="min_quantity" name="min_quantity" type="number" step="0.1" defaultValue="1" className="bg-zinc-900 border-zinc-800" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="box_id" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Lager-Box</Label>
            <select 
              id="box_id" 
              name="box_id" 
              required 
              defaultValue={initialBoxId}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {boxes?.map(box => (
                <option key={box.id} value={box.id}>Box {box.number} (Ref: {box.uuid.slice(0,8)})</option>
              ))}
            </select>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-[10px] h-12 rounded-xl transition-all"
            >
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Item im Vault sichern'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
