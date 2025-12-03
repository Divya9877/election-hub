import { Progress } from '@/components/ui/progress';

interface VotingProgressProps {
  percentage: number;
  voted: number;
  total: number;
}

export function VotingProgress({ percentage, voted, total }: VotingProgressProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">Voting Progress</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Overall Progress</span>
          <span className="text-2xl font-bold text-primary">{percentage}%</span>
        </div>
        
        <Progress value={percentage} className="h-3" />
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            <span className="font-medium text-success">{voted}</span> voted
          </span>
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{total}</span> total voters
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-success/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-success">{voted}</p>
          <p className="text-xs text-success/80 mt-1">Voted</p>
        </div>
        <div className="bg-warning/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-warning">{total - voted}</p>
          <p className="text-xs text-warning/80 mt-1">Pending</p>
        </div>
      </div>
    </div>
  );
}
