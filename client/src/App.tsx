import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import FirstTeam from "@/pages/FirstTeam";
import U15 from "@/pages/U15";
import U13 from "@/pages/U13";
import History from "@/pages/History";
import Contact from "@/pages/Contact";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminPosts from "@/pages/admin/AdminPosts";
import AdminFixtures from "@/pages/admin/AdminFixtures";
import AdminLeagueTable from "@/pages/admin/AdminLeagueTable";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/first-team" component={FirstTeam} />
      <Route path="/u15" component={U15} />
      <Route path="/u13" component={U13} />
      <Route path="/history" component={History} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/posts" component={AdminPosts} />
      <Route path="/admin/fixtures" component={AdminFixtures} />
      <Route path="/admin/league-table" component={AdminLeagueTable} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
