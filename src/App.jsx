import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import JourneyMap from "./pages/JourneyMap";
import Phase from "./pages/Phase";
import ProgressPage from "./pages/Progress";
import Mural from "./pages/Mural";
import PrayerRequests from "./pages/PrayerRequests";
import Ranking from "./pages/Ranking";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const AppLoading = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } =
    useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return <AppLoading />;
  }

  if (authError) {
    if (authError.type === "user_not_registered") {
      return <UserNotRegisteredError />;
    }

    if (authError.type === "auth_required") {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Área pública da Jornada */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jornada" element={<JourneyMap />} />
        <Route path="/fase/:phaseId" element={<Phase />} />
        <Route path="/progresso" element={<ProgressPage />} />
        <Route path="/mural" element={<Mural />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/oracao" element={<PrayerRequests />} />
      </Route>

      {/* Área administrativa */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Página não encontrada */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>

        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;