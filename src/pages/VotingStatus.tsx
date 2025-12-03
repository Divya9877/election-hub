import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useVoterStore } from '@/store/voterStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Vote, CheckCircle, Clock, RefreshCw, Users, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function VotingStatus() {
  const { voters, booths, assignments, markAsVoted, getStats } = useVoterStore();
  const stats = getStats();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMarkAsVoted = (voterId: string, voterName: string) => {
    markAsVoted(voterId);
    toast.success(`${voterName} marked as voted`);
    setRefreshKey((k) => k + 1);
  };

  const getBoothForVoter = (voterId: string) => {
    const assignment = assignments.find((a) => a.voterId === voterId);
    if (!assignment) return null;
    return booths.find((b) => b.bid === assignment.boothId);
  };

  const registeredVoters = voters.filter((v) => v.status === 'registered');
  const votedVoters = voters.filter((v) => v.status === 'voted');

  return (
    <MainLayout title="Voting Status" description="Real-time voting progress">
      <div className="space-y-6" key={refreshKey}>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Voters</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalVoters}</p>
                </div>
                <Users className="w-10 h-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Voted</p>
                  <p className="text-3xl font-bold text-success">{stats.votedVoters}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-success/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-warning">{stats.registeredVoters}</p>
                </div>
                <Clock className="w-10 h-10 text-warning/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-3xl font-bold text-info">{stats.votingPercentage}%</p>
                </div>
                <Vote className="w-10 h-10 text-info/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booth Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Booth-wise Progress
                </CardTitle>
                <CardDescription>Real-time voting status by booth</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {booths.map((booth) => {
                const progress =
                  booth.assignedCount > 0
                    ? Math.round((booth.completedCount / booth.assignedCount) * 100)
                    : 0;
                return (
                  <div
                    key={booth.bid}
                    className="p-4 rounded-lg border bg-card hover:shadow-card-hover transition-shadow"
                  >
                    <p className="font-medium text-sm line-clamp-1">{booth.location}</p>
                    <p className="text-xs text-muted-foreground mb-3">{booth.time}</p>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full transition-all duration-500',
                          progress >= 75 ? 'bg-success' : progress >= 50 ? 'bg-info' : 'bg-warning'
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs">
                      <span className="text-success font-medium">{booth.completedCount} voted</span>
                      <span className="text-muted-foreground">{booth.assignedCount} assigned</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Voter Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Voters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <Clock className="w-5 h-5" />
                Pending Voters ({registeredVoters.length})
              </CardTitle>
              <CardDescription>Voters who haven't voted yet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {registeredVoters.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">All voters have voted!</p>
                ) : (
                  registeredVoters.map((voter) => {
                    const booth = getBoothForVoter(voter.vid);
                    return (
                      <div
                        key={voter.vid}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{voter.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {booth ? `Booth: ${booth.location.slice(0, 30)}...` : 'Not assigned'}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-success border-success hover:bg-success hover:text-success-foreground"
                          onClick={() => handleMarkAsVoted(voter.vid, voter.name)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Voted
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Voted Voters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="w-5 h-5" />
                Voted ({votedVoters.length})
              </CardTitle>
              <CardDescription>Voters who have completed voting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {votedVoters.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No votes recorded yet</p>
                ) : (
                  votedVoters.map((voter) => {
                    const booth = getBoothForVoter(voter.vid);
                    return (
                      <div
                        key={voter.vid}
                        className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/20"
                      >
                        <div>
                          <p className="font-medium text-sm">{voter.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {booth ? `Booth: ${booth.location.slice(0, 30)}...` : 'Not assigned'}
                          </p>
                        </div>
                        <StatusBadge status="voted" />
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
