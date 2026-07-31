import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      const response = await API.post("/auth/reset-password", {
        email,
        newPassword,
      });

      setMessage(response.data.message);
      setMessageType("success");

      // Clean up
      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      setMessage(error.response?.data?.message || "Password reset failed");
      setMessageType("error");
    }
  };

  return (
    <div className="reset-container">
      <form className="reset-box" onSubmit={handleReset}>
        <h2>Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <button type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;