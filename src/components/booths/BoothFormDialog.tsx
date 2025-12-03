import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVoterStore } from '@/store/voterStore';
import { Booth } from '@/types';
import { toast } from 'sonner';

const boothSchema = z.object({
  location: z.string().min(5, 'Location must be at least 5 characters'),
  time: z.string().min(1, 'Timing is required'),
});

type BoothFormData = z.infer<typeof boothSchema>;

interface BoothFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booth: Booth | null;
}

export function BoothFormDialog({ open, onOpenChange, booth }: BoothFormDialogProps) {
  const { addBooth, updateBooth } = useVoterStore();

  const form = useForm<BoothFormData>({
    resolver: zodResolver(boothSchema),
    defaultValues: {
      location: '',
      time: '08:00 AM - 06:00 PM',
    },
  });

  useEffect(() => {
    if (booth) {
      form.reset({
        location: booth.location,
        time: booth.time,
      });
    } else {
      form.reset({
        location: '',
        time: '08:00 AM - 06:00 PM',
      });
    }
  }, [booth, form]);

  const onSubmit = (data: BoothFormData) => {
    const boothData = {
      location: data.location,
      time: data.time,
    };

    if (booth) {
      updateBooth(booth.bid, boothData);
      toast.success('Booth updated successfully');
    } else {
      addBooth(boothData);
      toast.success('Booth added successfully');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{booth ? 'Edit Booth' : 'Add New Booth'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter booth location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timing</FormLabel>
                  <FormControl>
                    <Input placeholder="08:00 AM - 06:00 PM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{booth ? 'Update' : 'Add'} Booth</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
