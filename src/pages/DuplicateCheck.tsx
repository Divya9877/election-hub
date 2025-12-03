import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useVoterStore } from '@/store/voterStore';
import { Copy, CheckCircle2, AlertTriangle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DuplicateCheck() {
  const { checkDuplicate, voters } = useVoterStore();
  const [aadhar, setAadhar] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<{ isDuplicate: boolean; field: string; message: string } | null>(
    null
  );

  const handleCheck = () => {
    if (!aadhar && !phone) return;
    const duplicateResult = checkDuplicate(aadhar, phone);
    setResult(duplicateResult);
  };

  return (
    <MainLayout title="Duplicate Check" description="Detect duplicate Aadhar or phone numbers">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copy className="w-5 h-5 text-primary" />
              Check for Duplicates
            </CardTitle>
            <CardDescription>
              Enter Aadhar number or phone to check if it already exists in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aadhar">Aadhar Number</Label>
                <Input
                  id="aadhar"
                  placeholder="1234-5678-9012"
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleCheck} disabled={!aadhar && !phone} className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Check for Duplicates
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card
            className={cn(
              'animate-scale-in border-2',
              result.isDuplicate ? 'border-warning bg-warning/5' : 'border-success bg-success/5'
            )}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center',
                    result.isDuplicate ? 'bg-warning/20' : 'bg-success/20'
                  )}
                >
                  {result.isDuplicate ? (
                    <AlertTriangle className="w-8 h-8 text-warning" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  )}
                </div>
                <div>
                  <h3
                    className={cn(
                      'text-xl font-semibold',
                      result.isDuplicate ? 'text-warning' : 'text-success'
                    )}
                  >
                    {result.isDuplicate ? 'Duplicate Found' : 'No Duplicates'}
                  </h3>
                  <p className="text-muted-foreground mt-1">{result.message}</p>
                  {result.isDuplicate && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Duplicate field:{' '}
                      <span className="font-medium text-foreground uppercase">{result.field}</span>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Reference</CardTitle>
            <CardDescription>Existing records in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {voters.slice(0, 5).map((voter) => (
                <div
                  key={voter.vid}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm"
                >
                  <div>
                    <p className="font-medium">{voter.name}</p>
                    <p className="text-muted-foreground text-xs">{voter.vid}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs">{voter.aadhar}</p>
                    <p className="text-muted-foreground text-xs">{voter.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
