import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useVoterStore } from '@/store/voterStore';
import { ShieldCheck, ShieldX, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Eligibility() {
  const { voters, checkEligibility } = useVoterStore();
  const [selectedVoter, setSelectedVoter] = useState<string>('');
  const [result, setResult] = useState<{ eligible: boolean; age: number; message: string } | null>(null);

  const handleCheck = () => {
    if (!selectedVoter) return;
    const eligibilityResult = checkEligibility(selectedVoter);
    setResult(eligibilityResult);
  };

  const selectedVoterData = voters.find((v) => v.vid === selectedVoter);

  return (
    <MainLayout title="Eligibility Check" description="Verify voter eligibility (18+ years)">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Check Voter Eligibility
            </CardTitle>
            <CardDescription>
              Select a voter to verify if they meet the minimum age requirement (18 years)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Select value={selectedVoter} onValueChange={setSelectedVoter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a voter" />
                </SelectTrigger>
                <SelectContent>
                  {voters.map((voter) => (
                    <SelectItem key={voter.vid} value={voter.vid}>
                      {voter.name} ({voter.aadhar})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCheck} disabled={!selectedVoter}>
                Check Eligibility
              </Button>
            </div>

            {selectedVoterData && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{selectedVoterData.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    DOB: {new Date(selectedVoterData.dob).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {result && (
          <Card
            className={cn(
              'animate-scale-in border-2',
              result.eligible ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5'
            )}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center',
                    result.eligible ? 'bg-success/20' : 'bg-destructive/20'
                  )}
                >
                  {result.eligible ? (
                    <ShieldCheck className="w-8 h-8 text-success" />
                  ) : (
                    <ShieldX className="w-8 h-8 text-destructive" />
                  )}
                </div>
                <div>
                  <h3
                    className={cn(
                      'text-xl font-semibold',
                      result.eligible ? 'text-success' : 'text-destructive'
                    )}
                  >
                    {result.eligible ? 'Eligible to Vote' : 'Not Eligible'}
                  </h3>
                  <p className="text-muted-foreground mt-1">{result.message}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Current Age: <span className="font-medium text-foreground">{result.age} years</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Eligibility Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Voter must be at least 18 years of age
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Age is calculated based on date of birth
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Voter must be registered in the system
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
