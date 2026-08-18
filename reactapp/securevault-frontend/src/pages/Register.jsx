import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import API from "../services/api";
import "./Register.css";
import { generatePassword } from "../utils/passwordGenerator";
import { checkPasswordStrength } from "../utils/passwordStrength";

function Register() {

  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleGeneratePassword = () => {
  const newPassword = generatePassword();
  setPassword(newPassword);
  };

  const strength = checkPasswordStrength(password);

  const handleRegister = async (e) => {

    e.preventDefault();

    setMessage("");

    if (!fullName.trim()) {

      setMessage("Full name is required.");

      setMessageType("error");

      return;

    }

    if (password.length < 8) {

      setMessage("Password must be at least 8 characters.");

      setMessageType("error");

      return;

    }

    try {

      await API.post("/auth/register", {

        fullName,
        email,
        password

      });

      navigate("/login");

    } catch (error) {

      setMessage(

        error.response?.data?.message ||

        "Registration Failed"

      );

      setMessageType("error");

    }

  };

  return (

    <div className="register-container">

      <form
        className="register-box"
        onSubmit={handleRegister}
      >

        <div className="logo">

          <FaLock />

        </div>

        <h1>SecureVault</h1>

        <p className="subtitle">

          Create Your Secure Account

        </p>

        <div className="input-box">

          <FaUser className="input-icon"/>

          <input

            type="text"

            placeholder="Full Name"

            value={fullName}

            onChange={(e)=>setFullName(e.target.value)}

          />

        </div>

        <div className="input-box">

          <input

            type="email"

            placeholder="Email Address"

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

          />

        </div>

        <div className="input-box">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <span
    className="eye"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>

</div>

{/* Password Strength */}

{password.length > 0 && (

<div className="strength-container">

    <div className="strength-header">

        <span className="strength-label">
            Password Strength
        </span>

        <span
            className="strength-text"
            style={{ color: strength.color }}
        >
            {strength.text}
        </span>

    </div>

    <div className="strength-bar">

        <div
            className="strength-fill"
            style={{
                width: strength.width,
                backgroundColor: strength.color
            }}
        ></div>

    </div>

</div>

)}

<button
  type="button"
  className="generate-btn"
  onClick={handleGeneratePassword}
>
  Generate
</button>

        {message && (

          <div className={`message ${messageType}`}>

            {message}

          </div>

        )}

        <button>

          Create Account

        </button>

        <p className="login-text">

          Already have an account?

          <Link to="/login">

            Login

          </Link>

        </p>

      </form>

    </div>

  );

}

export default Register;