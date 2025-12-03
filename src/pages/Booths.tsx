import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable } from '@/components/common/DataTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useVoterStore } from '@/store/voterStore';
import { Booth } from '@/types';
import { Plus, Edit, Trash2, MapPin, Clock } from 'lucide-react';
import { BoothFormDialog } from '@/components/booths/BoothFormDialog';
import { toast } from 'sonner';

export default function Booths() {
  const { booths, deleteBooth } = useVoterStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editingBooth, setEditingBooth] = useState<Booth | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; booth: Booth | null }>({
    open: false,
    booth: null,
  });

  const handleEdit = (booth: Booth) => {
    setEditingBooth(booth);
    setFormOpen(true);
  };

  const handleDelete = (booth: Booth) => {
    setDeleteDialog({ open: true, booth });
  };

  const confirmDelete = () => {
    if (deleteDialog.booth) {
      deleteBooth(deleteDialog.booth.bid);
      toast.success('Booth deleted successfully');
    }
    setDeleteDialog({ open: false, booth: null });
  };

  const columns = [
    {
      key: 'bid',
      header: 'ID',
      render: (booth: Booth) => (
        <span className="font-mono text-xs text-muted-foreground">{booth.bid}</span>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (booth: Booth) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{booth.location}</span>
        </div>
      ),
    },
    {
      key: 'time',
      header: 'Timing',
      render: (booth: Booth) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{booth.time}</span>
        </div>
      ),
    },
    {
      key: 'progress',
      header: 'Progress',
      render: (booth: Booth) => {
        const progress = booth.assignedCount > 0
          ? Math.round((booth.completedCount / booth.assignedCount) * 100)
          : 0;
        return (
          <div className="min-w-[150px]">
            <div className="flex justify-between text-xs mb-1">
              <span>{booth.completedCount}/{booth.assignedCount}</span>
              <span className="text-primary font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      searchable: false,
      render: (booth: Booth) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(booth);
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
              handleDelete(booth);
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
    <MainLayout title="Booths" description="Manage polling booth locations">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">
            Total: <span className="font-medium text-foreground">{booths.length}</span> booths
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Booth
        </Button>
      </div>

      <DataTable data={booths} columns={columns} searchPlaceholder="Search booths..." />

      <BoothFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingBooth(null);
        }}
        booth={editingBooth}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, booth: deleteDialog.booth })}
        title="Delete Booth"
        description={`Are you sure you want to delete this booth? This will also remove all associated assignments.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </MainLayout>
  );
}
