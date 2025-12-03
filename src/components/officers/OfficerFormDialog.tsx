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
import { Officer } from '@/types';
import { toast } from 'sonner';

const officerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().length(10, 'Phone must be 10 digits'),
});

type OfficerFormData = z.infer<typeof officerSchema>;

interface OfficerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  officer: Officer | null;
}

export function OfficerFormDialog({ open, onOpenChange, officer }: OfficerFormDialogProps) {
  const { addOfficer, updateOfficer } = useVoterStore();

  const form = useForm<OfficerFormData>({
    resolver: zodResolver(officerSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (officer) {
      form.reset({
        name: officer.name,
        phone: officer.phone,
      });
    } else {
      form.reset({
        name: '',
        phone: '',
      });
    }
  }, [officer, form]);

  const onSubmit = (data: OfficerFormData) => {
    const officerData = {
      name: data.name,
      phone: data.phone,
    };

    if (officer) {
      updateOfficer(officer.oid, officerData);
      toast.success('Officer updated successfully');
    } else {
      addOfficer(officerData);
      toast.success('Officer added successfully');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{officer ? 'Edit Officer' : 'Add New Officer'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter officer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{officer ? 'Update' : 'Add'} Officer</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
