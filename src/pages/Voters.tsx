import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useVoterStore } from '@/store/voterStore';
import { Voter } from '@/types';
import { Plus, Edit, Trash2, CheckCircle, Search, Users, UserCheck, UserX, Phone, MapPin, Calendar } from 'lucide-react';
import { VoterFormDialog } from '@/components/voters/VoterFormDialog';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Voters() {
  const { voters, deleteVoter, markAsVoted } = useVoterStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'registered' | 'voted'>('all');
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

  const filteredVoters = voters.filter((voter) => {
    const matchesSearch =
      voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.aadhar.includes(searchTerm) ||
      voter.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || voter.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const registeredCount = voters.filter((v) => v.status === 'registered').length;
  const votedCount = voters.filter((v) => v.status === 'voted').length;

  return (
    <MainLayout title="Voter Registry" description="Manage and track voter records">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Voters</p>
              <p className="text-2xl font-bold text-foreground">{voters.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-amber-500/20">
              <UserX className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registered</p>
              <p className="text-2xl font-bold text-foreground">{registeredCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-500/20">
              <UserCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Voted</p>
              <p className="text-2xl font-bold text-foreground">{votedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, Aadhar, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'registered' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('registered')}
            size="sm"
          >
            Registered
          </Button>
          <Button
            variant={filterStatus === 'voted' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('voted')}
            size="sm"
          >
            Voted
          </Button>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Voter
        </Button>
      </div>

      {/* Voter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVoters.map((voter) => (
          <Card key={voter.vid} className="hover:shadow-lg transition-shadow border-border/50">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    voter.gender === 'male' 
                      ? 'bg-blue-500/20 text-blue-600' 
                      : voter.gender === 'female'
                      ? 'bg-pink-500/20 text-pink-600'
                      : 'bg-purple-500/20 text-purple-600'
                  }`}>
                    {voter.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{voter.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{voter.vid.slice(0, 8)}...</p>
                  </div>
                </div>
                <StatusBadge status={voter.status} />
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">Aadhar: {voter.aadhar}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{voter.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{format(new Date(voter.dob), 'dd MMM yyyy')}</span>
                  <span className="capitalize px-1.5 py-0.5 rounded bg-muted text-xs">{voter.gender}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span className="line-clamp-2 text-xs">{voter.address}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-border/50">
                {voter.status === 'registered' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsVoted(voter)}
                    className="text-emerald-600 border-emerald-600/30 hover:bg-emerald-500/10"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Mark Voted
                  </Button>
                ) : (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Vote Recorded
                  </span>
                )}
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(voter)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(voter)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVoters.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No voters found</p>
        </div>
      )}

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
