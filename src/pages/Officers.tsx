import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVoterStore } from '@/store/voterStore';
import { Officer } from '@/types';
import { Plus, Edit, Trash2, Search, Shield, Phone, Calendar, ClipboardList, User2 } from 'lucide-react';
import { OfficerFormDialog } from '@/components/officers/OfficerFormDialog';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Officers() {
  const { officers, deleteOfficer, assignments, booths } = useVoterStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const getOfficerStats = (officerId: string) => {
    const officerAssignments = assignments.filter((a) => a.officerId === officerId);
    const uniqueBooths = [...new Set(officerAssignments.map((a) => a.boothId))];
    return {
      totalAssignments: officerAssignments.length,
      boothsAssigned: uniqueBooths.length,
      boothNames: uniqueBooths.map((bid) => booths.find((b) => b.bid === bid)?.location || 'Unknown'),
    };
  };

  const filteredOfficers = officers.filter(
    (officer) =>
      officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.phone.includes(searchTerm)
  );

  const totalAssignments = assignments.length;
  const activeOfficers = officers.filter((o) => 
    assignments.some((a) => a.officerId === o.oid)
  ).length;

  return (
    <MainLayout title="Officers Directory" description="Polling officers management">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-indigo-600/10 via-indigo-500/5 to-transparent border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-indigo-400 mb-1">Total Officers</p>
                <p className="text-3xl font-bold text-foreground">{officers.length}</p>
              </div>
              <Shield className="w-10 h-10 text-indigo-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-cyan-600/10 via-cyan-500/5 to-transparent border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-cyan-400 mb-1">Active Officers</p>
                <p className="text-3xl font-bold text-foreground">{activeOfficers}</p>
              </div>
              <User2 className="w-10 h-10 text-cyan-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-violet-600/10 via-violet-500/5 to-transparent border-violet-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-violet-400 mb-1">Total Assignments</p>
                <p className="text-3xl font-bold text-foreground">{totalAssignments}</p>
              </div>
              <ClipboardList className="w-10 h-10 text-violet-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Add */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search officers by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setFormOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Officer
        </Button>
      </div>

      {/* Officers List */}
      <div className="space-y-3">
        {filteredOfficers.map((officer) => {
          const stats = getOfficerStats(officer.oid);
          return (
            <Card key={officer.oid} className="hover:border-indigo-500/30 transition-colors">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                  {/* Officer Avatar & Basic Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {officer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-foreground truncate">{officer.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          {officer.phone}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(officer.createdAt), 'dd MMM yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 pl-4 sm:pl-0">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-indigo-500">{stats.totalAssignments}</p>
                      <p className="text-xs text-muted-foreground">Assignments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-500">{stats.boothsAssigned}</p>
                      <p className="text-xs text-muted-foreground">Booths</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:border-l sm:border-border/50 sm:pl-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(officer)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(officer)}
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Booth Tags */}
                {stats.boothNames.length > 0 && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {stats.boothNames.map((booth, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20">
                          {booth}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredOfficers.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No officers found</p>
        </div>
      )}

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
