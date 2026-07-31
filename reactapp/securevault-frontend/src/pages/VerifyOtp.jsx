import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./VerifyOtp.css";

function VerifyOtp() {
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!otp.trim()) {
      setMessage("Please enter the OTP.");
      setMessageType("error");
      return;
    }

    try {
      const response = await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      setMessage(response.data.message);
      setMessageType("success");

      setTimeout(() => {
        navigate("/reset-password");
      }, 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || "OTP Verification Failed");
      setMessageType("error");
    }
  };

  return (
    <div className="verify-container">
      <form className="verify-box" onSubmit={handleVerify}>
        <h2>Verify OTP</h2>

        <p className="email-text">
          OTP sent to <strong>{email}</strong>
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          required
        />

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <button type="submit">
          Verify OTP
        </button>
      </form>
    </div>
  );
}

export default VerifyOtp;