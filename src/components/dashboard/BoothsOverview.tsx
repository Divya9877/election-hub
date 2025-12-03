import { useVoterStore } from '@/store/voterStore';
import { Progress } from '@/components/ui/progress';
import { Building2, MapPin } from 'lucide-react';

export function BoothsOverview() {
  const { booths } = useVoterStore();

  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Booth Status</h3>
        <Building2 className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {booths.map((booth) => {
          const progress = booth.assignedCount > 0 
            ? Math.round((booth.completedCount / booth.assignedCount) * 100) 
            : 0;
          
          return (
            <div key={booth.bid} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {booth.location}
                    </p>
                    <p className="text-xs text-muted-foreground">{booth.time}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{booth.completedCount} completed</span>
                <span>{booth.assignedCount} assigned</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
