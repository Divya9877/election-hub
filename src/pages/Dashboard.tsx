import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { VotingProgress } from '@/components/dashboard/VotingProgress';
import { BoothsOverview } from '@/components/dashboard/BoothsOverview';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { useVoterStore } from '@/store/voterStore';
import { Users, Building2, UserCog, Link2, Vote, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { getStats } = useVoterStore();
  const stats = getStats();

  return (
    <MainLayout title="Dashboard" description="Overview of voter management system">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard
          title="Total Voters"
          value={stats.totalVoters}
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Registered"
          value={stats.registeredVoters}
          icon={Users}
          variant="info"
        />
        <StatCard
          title="Voted"
          value={stats.votedVoters}
          icon={Vote}
          variant="success"
        />
        <StatCard
          title="Booths"
          value={stats.totalBooths}
          icon={Building2}
          variant="default"
        />
        <StatCard
          title="Officers"
          value={stats.totalOfficers}
          icon={UserCog}
          variant="default"
        />
        <StatCard
          title="Assignments"
          value={stats.totalAssignments}
          icon={Link2}
          variant="default"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VotingProgress
          percentage={stats.votingPercentage}
          voted={stats.votedVoters}
          total={stats.totalVoters}
        />
        <BoothsOverview />
        <RecentActivity />
      </div>
    </MainLayout>
  );
}
