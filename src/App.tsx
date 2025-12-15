import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Dashboard from '@/pages/Dashboard';
import Voters from '@/pages/Voters';
import Booths from '@/pages/Booths';
import Officers from '@/pages/Officers';
import Assignments from '@/pages/Assignments';
import Eligibility from '@/pages/Eligibility';
import DuplicateCheck from '@/pages/DuplicateCheck';
import VotingStatus from '@/pages/VotingStatus';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/voters" element={<Voters />} />
        <Route path="/booths" element={<Booths />} />
        <Route path="/officers" element={<Officers />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/eligibility" element={<Eligibility />} />
        <Route path="/duplicate" element={<DuplicateCheck />} />
        <Route path="/voting-status" element={<VotingStatus />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
