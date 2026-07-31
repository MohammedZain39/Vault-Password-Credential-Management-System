import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Vault from "./pages/Vault";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Password Reset Flow */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Main Pages */}
      <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
      <Route path="/vault" element={<Vault />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;