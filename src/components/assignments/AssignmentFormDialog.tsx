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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVoterStore } from '@/store/voterStore';
import { toast } from 'sonner';

const assignmentSchema = z.object({
  voterId: z.string().min(1, 'Please select a voter'),
  boothId: z.string().min(1, 'Please select a booth'),
  officerId: z.string().min(1, 'Please select an officer'),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface AssignmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignmentFormDialog({ open, onOpenChange }: AssignmentFormDialogProps) {
  const { voters, booths, officers, assignments, addAssignment } = useVoterStore();

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      voterId: '',
      boothId: '',
      officerId: '',
    },
  });

  // Filter out voters who are already assigned
  const assignedVoterIds = assignments.map((a) => a.voterId);
  const availableVoters = voters.filter((v) => !assignedVoterIds.includes(v.vid));

  const onSubmit = (data: AssignmentFormData) => {
    const assignmentData = {
      voterId: data.voterId,
      boothId: data.boothId,
      officerId: data.officerId,
    };
    addAssignment(assignmentData);
    toast.success('Assignment created successfully');
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="voterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voter</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voter" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableVoters.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No unassigned voters
                        </SelectItem>
                      ) : (
                        availableVoters.map((voter) => (
                          <SelectItem key={voter.vid} value={voter.vid}>
                            {voter.name} ({voter.aadhar})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="boothId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booth</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a booth" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {booths.map((booth) => (
                        <SelectItem key={booth.bid} value={booth.bid}>
                          {booth.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="officerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Officer</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an officer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {officers.map((officer) => (
                        <SelectItem key={officer.oid} value={officer.oid}>
                          {officer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={availableVoters.length === 0}>
                Create Assignment
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
