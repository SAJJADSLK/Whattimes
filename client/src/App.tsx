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
import CountryPage from "./pages/CountryPage";
import Countries from "./pages/Countries";
import Widget from "./pages/Widget";
import InviteDetail from "./pages/InviteDetail";
import CountdownDetail from "./pages/CountdownDetail";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import CityPage from "./pages/CityPage";
import Timer from "./pages/Timer";
import Calendar from "./pages/Calendar";
import UnixConverter from "./pages/UnixConverter";

import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import ApiDocs from "./pages/ApiDocs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";

function Router() {
  // make sure to consider if you need authentication for certain routes
  //
  // IMPORTANT: every fixed-path route (e.g. /blog, /timer, /dashboard) MUST be
  // declared ABOVE the dynamic "/:country/:city" and "/:country" routes below.
  // wouter's <Switch> renders the FIRST matching route, and "/:country" matches
  // ANY single-segment path - so if it were declared first it would swallow
  // routes like /blog or /timer before they ever got a chance to render.
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/world-clock" component={WorldClock} />
      <Route path="/converter" component={Converter} />
      <Route path="/meeting-invite" component={MeetingInvite} />
      <Route path="/countdown" component={Countdown} />
      <Route path="/dst-tracker" component={DSTTracker} />
      <Route path="/team-dashboard" component={TeamDashboard} />
      <Route path="/countries" component={Countries} />
      <Route path="/widget" component={Widget} />
      <Route path="/invite/:inviteId" component={InviteDetail} />
      <Route path="/countdown/:countdownId" component={CountdownDetail} />
      <Route path="/admin/analytics" component={AdminDashboard} />
      <Route path="/dashboard" component={UserDashboard} />
      <Route path="/timer" component={Timer} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/unix-converter" component={UnixConverter} />
      <Route path="/blog" component={Blog} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/features" component={Features} />
      <Route path="/api-docs" component={ApiDocs} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/security" component={Security} />
      <Route path="/404" component={NotFound} />

      {/* Dynamic routing for Time.is-style SEO strategy - MUST stay last,
          right before the final NotFound fallback, since these wildcards
          match almost any path. */}
      <Route path="/:country/:city" component={CityPage} />
      <Route path="/:country" component={CountryPage} />

      {/* Final fallback route */}
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
