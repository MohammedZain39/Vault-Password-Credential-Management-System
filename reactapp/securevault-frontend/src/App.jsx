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
import AddCredential from "./pages/AddCredential";
import EditCredential from "./pages/EditCredential";
import ViewCredential from "./pages/ViewCredential";
import SharedCredentials from "./pages/SharedCredentials";
import Security from "./pages/Security";

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
      <Route
  path="/vault"
  element={
    <ProtectedRoute>
      <Vault />
    </ProtectedRoute>
  }
/>
<Route
    path="/shared-credentials"
    element={<SharedCredentials />}
/>
<Route
  path="/security"
  element={
    <ProtectedRoute>
      <Security />
    </ProtectedRoute>
  }
/>


<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

<Route
  path="/add-credential"
  element={
    <ProtectedRoute>
      <AddCredential />
    </ProtectedRoute>
  }
/>
<Route
    path="/credential/:id"
    element={
        <ProtectedRoute>
            <ViewCredential />
        </ProtectedRoute>
    }
/>
<Route
  path="/edit-credential/:id"
  element={
    <ProtectedRoute>
      <EditCredential />
    </ProtectedRoute>
  }
/>

      <Route path="*" element={<NotFound />} />
    </Routes>
    
  );
}

export default App;