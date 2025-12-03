import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable } from '@/components/common/DataTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { useVoterStore } from '@/store/voterStore';
import { Officer } from '@/types';
import { Plus, Edit, Trash2, Phone, User } from 'lucide-react';
import { OfficerFormDialog } from '@/components/officers/OfficerFormDialog';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Officers() {
  const { officers, deleteOfficer, assignments } = useVoterStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; officer: Officer | null }>({
    open: false,
    officer: null,
  });

  const handleEdit = (officer: Officer) => {
    setEditingOfficer(officer);
    setFormOpen(true);
  };

  const handleDelete = (officer: Officer) => {
    setDeleteDialog({ open: true, officer });
  };

  const confirmDelete = () => {
    if (deleteDialog.officer) {
      deleteOfficer(deleteDialog.officer.oid);
      toast.success('Officer deleted successfully');
    }
    setDeleteDialog({ open: false, officer: null });
  };

  const getAssignmentCount = (officerId: string) => {
    return assignments.filter((a) => a.officerId === officerId).length;
  };

  const columns = [
    {
      key: 'oid',
      header: 'ID',
      render: (officer: Officer) => (
        <span className="font-mono text-xs text-muted-foreground">{officer.oid}</span>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (officer: Officer) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium">{officer.name}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (officer: Officer) => (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{officer.phone}</span>
        </div>
      ),
    },
    {
      key: 'assignments',
      header: 'Assignments',
      render: (officer: Officer) => (
        <span className="font-medium text-primary">{getAssignmentCount(officer.oid)}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Added On',
      render: (officer: Officer) => format(new Date(officer.createdAt), 'dd MMM yyyy'),
    },
    {
      key: 'actions',
      header: 'Actions',
      searchable: false,
      render: (officer: Officer) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(officer);
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
              handleDelete(officer);
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
    <MainLayout title="Officers" description="Manage polling officers">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">
            Total: <span className="font-medium text-foreground">{officers.length}</span> officers
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Officer
        </Button>
      </div>

      <DataTable data={officers} columns={columns} searchPlaceholder="Search officers..." />

      <OfficerFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingOfficer(null);
        }}
        officer={editingOfficer}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, officer: deleteDialog.officer })}
        title="Delete Officer"
        description={`Are you sure you want to delete ${deleteDialog.officer?.name}? This will also remove all their assignments.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </MainLayout>
  );
}
