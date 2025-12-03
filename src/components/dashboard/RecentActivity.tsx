import { useVoterStore } from '@/store/voterStore';
import { CheckCircle2, UserPlus, Link2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function RecentActivity() {
  const { voters, assignments } = useVoterStore();

  // Create activity items from recent data
  const activities = [
    ...voters
      .filter((v) => v.status === 'voted')
      .slice(0, 3)
      .map((v) => ({
        id: `vote-${v.vid}`,
        type: 'vote' as const,
        title: `${v.name} has voted`,
        timestamp: v.updatedAt,
        icon: CheckCircle2,
        color: 'text-success',
        bgColor: 'bg-success/10',
      })),
    ...assignments.slice(0, 3).map((a) => ({
      id: `assign-${a.assignmentId}`,
      type: 'assignment' as const,
      title: `New booth assignment`,
      timestamp: a.timestamp,
      icon: Link2,
      color: 'text-info',
      bgColor: 'bg-info/10',
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.bgColor}`}>
              <activity.icon className={`w-4 h-4 ${activity.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
        )}
      </div>
    </div>
  );
}
