import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import AppShell from "./components/AppShell";
import { TripSessionProvider } from "./hooks/useTripSession";
import LandingPage from "./pages/LandingPage";
import PlanTripPage from "./pages/PlanTripPage";
import VirtualBuddiesPage from "./pages/VirtualBuddiesPage";
import MatchPage from "./pages/MatchPage";
import CalmModePage from "./pages/CalmModePage";
import SafetyHubPage from "./pages/SafetyHubPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

// Recharts is only needed on the dashboard; keep it out of the first paint.
const CommunityPulsePage = lazy(() => import("./pages/CommunityPulsePage"));

const App = () => (
  <BrowserRouter>
    <TripSessionProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/plan" element={<PlanTripPage />} />
          <Route path="/buddies" element={<VirtualBuddiesPage />} />
          <Route path="/match/:buddyId" element={<MatchPage />} />
          <Route path="/calm" element={<CalmModePage />} />
          <Route path="/safety" element={<SafetyHubPage />} />
          <Route
            path="/pulse"
            element={
              <Suspense
                fallback={<div className="card h-64 animate-pulse bg-elevated/40" aria-busy="true" />}
              >
                <CommunityPulsePage />
              </Suspense>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: "#19213A",
            border: "1px solid #24304F",
            color: "#F8FAFC",
          },
        }}
      />
    </TripSessionProvider>
  </BrowserRouter>
);

export default App;
