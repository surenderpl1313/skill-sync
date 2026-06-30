import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import CreateProject from "./pages/CreateProject";
import ProjectDetail from "./pages/ProjectDetail";
import Profile from "./pages/Profile";

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects/create" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={
          <div className="min-h-screen bg-slate-950 flex items-center justify-center text-center">
            <div>
              <p className="text-6xl font-bold text-slate-800 mb-4">404</p>
              <p className="text-white font-semibold mb-2">Page not found</p>
              <a href="/" className="text-blue-400 hover:text-blue-300 text-sm">Go home</a>
            </div>
          </div>
        } />
      </Routes>
    </>
  );
};

export default App;