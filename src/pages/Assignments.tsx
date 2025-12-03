import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable } from '@/components/common/DataTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { useVoterStore } from '@/store/voterStore';
import { Assignment } from '@/types';
import { Plus, Trash2, Users, Building2, UserCog } from 'lucide-react';
import { AssignmentFormDialog } from '@/components/assignments/AssignmentFormDialog';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Assignments() {
  const { assignments, deleteAssignment, voters, booths, officers } = useVoterStore();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; assignment: Assignment | null }>({
    open: false,
    assignment: null,
  });

  const handleDelete = (assignment: Assignment) => {
    setDeleteDialog({ open: true, assignment });
  };

  const confirmDelete = () => {
    if (deleteDialog.assignment) {
      deleteAssignment(deleteDialog.assignment.assignmentId);
      toast.success('Assignment deleted successfully');
    }
    setDeleteDialog({ open: false, assignment: null });
  };

  const getVoterName = (voterId: string) => {
    const voter = voters.find((v) => v.vid === voterId);
    return voter?.name || 'Unknown';
  };

  const getBoothLocation = (boothId: string) => {
    const booth = booths.find((b) => b.bid === boothId);
    return booth?.location || 'Unknown';
  };

  const getOfficerName = (officerId: string) => {
    const officer = officers.find((o) => o.oid === officerId);
    return officer?.name || 'Unknown';
  };

  const columns = [
    {
      key: 'assignmentId',
      header: 'ID',
      render: (assignment: Assignment) => (
        <span className="font-mono text-xs text-muted-foreground">{assignment.assignmentId}</span>
      ),
    },
    {
      key: 'voterId',
      header: 'Voter',
      render: (assignment: Assignment) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{getVoterName(assignment.voterId)}</span>
        </div>
      ),
    },
    {
      key: 'boothId',
      header: 'Booth',
      render: (assignment: Assignment) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <span className="truncate max-w-[200px]">{getBoothLocation(assignment.boothId)}</span>
        </div>
      ),
    },
    {
      key: 'officerId',
      header: 'Officer',
      render: (assignment: Assignment) => (
        <div className="flex items-center gap-2">
          <UserCog className="w-4 h-4 text-muted-foreground" />
          <span>{getOfficerName(assignment.officerId)}</span>
        </div>
      ),
    },
    {
      key: 'timestamp',
      header: 'Assigned On',
      render: (assignment: Assignment) => format(new Date(assignment.timestamp), 'dd MMM yyyy, HH:mm'),
    },
    {
      key: 'actions',
      header: 'Actions',
      searchable: false,
      render: (assignment: Assignment) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(assignment);
          }}
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <MainLayout title="Assignments" description="Manage voter-booth-officer assignments">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">
            Total: <span className="font-medium text-foreground">{assignments.length}</span> assignments
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Assignment
        </Button>
      </div>

      <DataTable data={assignments} columns={columns} searchPlaceholder="Search assignments..." />

      <AssignmentFormDialog open={formOpen} onOpenChange={setFormOpen} />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, assignment: deleteDialog.assignment })}
        title="Delete Assignment"
        description="Are you sure you want to delete this assignment?"
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </MainLayout>
  );
}
