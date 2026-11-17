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
import AdminStaff from "@/pages/admin/AdminStaff";
import AdminTrainings from "@/pages/admin/AdminTrainings";
import AdminClubInfo from "@/pages/admin/AdminClubInfo";
import AdminHistory from "@/pages/admin/AdminHistory";
import AdminBanners from "@/pages/admin/AdminBanners";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import MatchDetail from "@/pages/MatchDetail";
import AccessDenied from "@/pages/AccessDenied";
import NotFound from "@/pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/first-team" component={FirstTeam} />
      <Route path="/u15" component={U15} />
      <Route path="/u13" component={U13} />
      <Route path="/news" component={News} />
      <Route path="/news/:id" component={NewsDetail} />
      <Route path="/utakmica/:id" component={MatchDetail} />
      <Route path="/history" component={History} />
      <Route path="/contact" component={Contact} />
      <Route path="/pristup-odbijen" component={AccessDenied} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/posts" component={AdminPosts} />
      <Route path="/admin/staff" component={AdminStaff} />
      <Route path="/admin/trainings" component={AdminTrainings} />
      <Route path="/admin/club-info" component={AdminClubInfo} />
      <Route path="/admin/history" component={AdminHistory} />
      <Route path="/admin/banners" component={AdminBanners} />
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
