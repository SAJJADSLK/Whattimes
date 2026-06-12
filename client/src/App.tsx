import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MobileNav } from "./components/MobileNav";
import Home from "./pages/Home";
import WorldClock from "./pages/WorldClock";
import Converter from "./pages/Converter";
import MeetingInvite from "./pages/MeetingInvite";
import Countdown from "./pages/Countdown";
import DSTTracker from "./pages/DSTTracker";
import TeamDashboard from "./pages/TeamDashboard";
import CityDetail from "./pages/CityDetail";
import CityDetailPage from "./pages/CityDetailPage";
import CityStaticPage from "./pages/CityStaticPage";
import CountryPage from "./pages/CountryPage";
import Countries from "./pages/Countries";
import CountryDetail from "./pages/CountryDetail";
import Widget from "./pages/Widget";
import InviteDetail from "./pages/InviteDetail";
import CountdownDetail from "./pages/CountdownDetail";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

function Router() {
  return (
    <Switch>
      {/* Static/exact routes first — must come before any wildcards */}
      <Route path="/" component={Home} />
      <Route path="/world-clock" component={WorldClock} />
      <Route path="/converter" component={Converter} />
      <Route path="/meeting-invite" component={MeetingInvite} />
      <Route path="/countdown" component={Countdown} />
      <Route path="/dst-tracker" component={DSTTracker} />
      <Route path="/team-dashboard" component={TeamDashboard} />
      <Route path="/countries" component={Countries} />
      <Route path="/country/:country" component={CountryDetail} />
      <Route path="/city/:timezone" component={CityDetail} />
      <Route path="/city-detail/:city" component={CityDetailPage} />
      <Route path="/pages/city-:cityId" component={CityStaticPage} />
      <Route path="/widget" component={Widget} />
      <Route path="/invite/:inviteId" component={InviteDetail} />
      <Route path="/countdown/:countdownId" component={CountdownDetail} />
      <Route path="/admin/analytics" component={AdminDashboard} />
      <Route path="/dashboard" component={UserDashboard} />
      <Route path="/404" component={NotFound} />

      {/* Wildcard SEO routes last — /:country/:city and /:country will match
          anything not caught above, so they must be at the bottom */}
      <Route path="/:country/:city" component={CityDetailPage} />
      <Route path="/:country" component={CountryPage} />

      {/* Final fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <MobileNav />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
