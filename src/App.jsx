import { useContext } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppSidebar } from "./components/sidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { UserContext, UserProvider } from "./context/AuthContext";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import { Dashboard } from "./pages/Dashboard/DashboardPage";
import JobTracker from "./pages/Tracker/TrackerPage";

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
  };

  const hideSidebar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <SidebarProvider defaultOpen={true}>
      {!hideSidebar && <AppSidebar user={user} onLogout={handleLogout} />}
      <SidebarInset>
        <div className={!hideSidebar ? "p-6" : "p-0"}>
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <JobTracker user={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                user ? (
                  <Dashboard user={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
