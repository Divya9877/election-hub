import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { useVoterStore } from '@/store/voterStore';
import { Voter } from '@/types';
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { VoterFormDialog } from '@/components/voters/VoterFormDialog';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Voters() {
  const { voters, deleteVoter, markAsVoted } = useVoterStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; voter: Voter | null }>({
    open: false,
    voter: null,
  });

  const handleEdit = (voter: Voter) => {
    setEditingVoter(voter);
    setFormOpen(true);
  };

  const handleDelete = (voter: Voter) => {
    setDeleteDialog({ open: true, voter });
  };

  const confirmDelete = () => {
    if (deleteDialog.voter) {
      deleteVoter(deleteDialog.voter.vid);
      toast.success('Voter deleted successfully');
    }
    setDeleteDialog({ open: false, voter: null });
  };

  const handleMarkAsVoted = (voter: Voter) => {
    markAsVoted(voter.vid);
    toast.success(`${voter.name} marked as voted`);
  };

  const columns = [
    {
      key: 'vid',
      header: 'ID',
      render: (voter: Voter) => (
        <span className="font-mono text-xs text-muted-foreground">{voter.vid}</span>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (voter: Voter) => <span className="font-medium">{voter.name}</span>,
    },
    {
      key: 'aadhar',
      header: 'Aadhar',
      render: (voter: Voter) => <span className="font-mono text-sm">{voter.aadhar}</span>,
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'dob',
      header: 'DOB',
      render: (voter: Voter) => format(new Date(voter.dob), 'dd MMM yyyy'),
    },
    {
      key: 'gender',
      header: 'Gender',
      render: (voter: Voter) => (
        <span className="capitalize">{voter.gender}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (voter: Voter) => <StatusBadge status={voter.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      searchable: false,
      render: (voter: Voter) => (
        <div className="flex items-center gap-2">
          {voter.status === 'registered' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsVoted(voter);
              }}
              className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(voter);
            }}
            className="h-8 w-8"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(voter);
            }}
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout title="Voters" description="Manage voter records">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">
            Total: <span className="font-medium text-foreground">{voters.length}</span> voters
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Voter
        </Button>
      </div>

      <DataTable data={voters} columns={columns} searchPlaceholder="Search voters..." />

      <VoterFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingVoter(null);
        }}
        voter={editingVoter}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, voter: deleteDialog.voter })}
        title="Delete Voter"
        description={`Are you sure you want to delete ${deleteDialog.voter?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </MainLayout>
  );
}
