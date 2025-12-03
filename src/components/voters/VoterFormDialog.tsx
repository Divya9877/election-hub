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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useVoterStore } from '@/store/voterStore';
import { Voter } from '@/types';
import { toast } from 'sonner';

const voterSchema = z.object({
  aadhar: z.string().min(14, 'Invalid Aadhar format').max(14),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().length(10, 'Phone must be 10 digits'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  status: z.enum(['registered', 'voted']),
});

type VoterFormData = z.infer<typeof voterSchema>;

interface VoterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voter: Voter | null;
}

export function VoterFormDialog({ open, onOpenChange, voter }: VoterFormDialogProps) {
  const { addVoter, updateVoter, checkDuplicate } = useVoterStore();

  const form = useForm<VoterFormData>({
    resolver: zodResolver(voterSchema),
    defaultValues: {
      aadhar: '',
      name: '',
      phone: '',
      dob: '',
      gender: 'male',
      address: '',
      status: 'registered',
    },
  });

  useEffect(() => {
    if (voter) {
      form.reset({
        aadhar: voter.aadhar,
        name: voter.name,
        phone: voter.phone,
        dob: voter.dob,
        gender: voter.gender,
        address: voter.address,
        status: voter.status,
      });
    } else {
      form.reset({
        aadhar: '',
        name: '',
        phone: '',
        dob: '',
        gender: 'male',
        address: '',
        status: 'registered',
      });
    }
  }, [voter, form]);

  const onSubmit = (data: VoterFormData) => {
    // Check for duplicates
    const duplicateCheck = checkDuplicate(data.aadhar, data.phone, voter?.vid);
    if (duplicateCheck.isDuplicate) {
      toast.error(duplicateCheck.message);
      return;
    }

    const voterData = {
      aadhar: data.aadhar,
      name: data.name,
      phone: data.phone,
      dob: data.dob,
      gender: data.gender,
      address: data.address,
      status: data.status,
    };

    if (voter) {
      updateVoter(voter.vid, voterData);
      toast.success('Voter updated successfully');
    } else {
      addVoter(voterData);
      toast.success('Voter added successfully');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{voter ? 'Edit Voter' : 'Add New Voter'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aadhar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhar Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234-5678-9012" {...field} />
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

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="registered">Registered</SelectItem>
                        <SelectItem value="voted">Voted</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter full address" rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{voter ? 'Update' : 'Add'} Voter</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
