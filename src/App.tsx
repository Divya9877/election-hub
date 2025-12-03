import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Voters from "./pages/Voters";
import Booths from "./pages/Booths";
import Officers from "./pages/Officers";
import Assignments from "./pages/Assignments";
import Eligibility from "./pages/Eligibility";
import DuplicateCheck from "./pages/DuplicateCheck";
import VotingStatus from "./pages/VotingStatus";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/voters" element={<Voters />} />
          <Route path="/booths" element={<Booths />} />
          <Route path="/officers" element={<Officers />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/eligibility" element={<Eligibility />} />
          <Route path="/duplicate" element={<DuplicateCheck />} />
          <Route path="/voting-status" element={<VotingStatus />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
