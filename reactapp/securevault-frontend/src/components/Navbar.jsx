import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaLock,
  FaThLarge,
  FaShieldAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaBell,
  FaExclamationTriangle,
  FaClipboardList
} from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";

import API from "../services/api";
import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const [securityOpen, setSecurityOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const securityRef = useRef(null);


  // ==============================
  // LOAD SECURITY ALERTS
  // ==============================

  useEffect(() => {

    async function loadAlerts() {

      try {

        const response =
          await API.get("/security/alerts");

        setAlerts(response.data);

      } catch (error) {

        console.log(
          "Failed to load security alerts",
          error
        );

      }

    }

    loadAlerts();

  }, []);


  // ==============================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // ==============================

  useEffect(() => {

    function handleClickOutside(event) {

      if (
        securityRef.current &&
        !securityRef.current.contains(event.target)
      ) {

        setSecurityOpen(false);

      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  // ==============================
  // LOGOUT
  // ==============================

  function handleLogout() {

    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    navigate("/login", {
      replace: true
    });

  }


  // ==============================
  // UNREAD ALERT COUNT
  // ==============================

  const unreadAlerts =
    alerts.filter(
      alert => alert.status === "UNREAD"
    ).length;


  return (

    <nav className="navbar">

      {/* =========================
          LOGO
      ========================= */}

      <div className="logo">

        <FaLock className="logo-icon" />

        <span>SecureVault</span>

      </div>


      {/* =========================
          NAV LINKS
      ========================= */}

      <div className="nav-links">

        <NavLink to="/dashboard">

          <FaThLarge />

          Dashboard

        </NavLink>


        <NavLink to="/vault">

          <FaShieldAlt />

          Vault

        </NavLink>

        <NavLink to="/reports">
  <FaChartBar />
  Reports
</NavLink>


        {/* =========================
            SECURITY
        ========================= */}

        <div
          className="security-menu"
          ref={securityRef}
        >

          <button
            className={
              securityOpen
                ? "security-nav-btn active"
                : "security-nav-btn"
            }
            onClick={() =>
              setSecurityOpen(!securityOpen)
            }
          >

            <FaBell />

            Security

            {unreadAlerts > 0 && (

              <span className="alert-badge">

                {unreadAlerts}

              </span>

            )}

          </button>


          {/* =========================
              SECURITY DROPDOWN
          ========================= */}

          {securityOpen && (

            <div className="security-dropdown">

              <div className="security-dropdown-header">

                <div>

                  <h3>Security Center</h3>

                  <p>
                    Monitor your account security
                  </p>

                </div>

                {unreadAlerts > 0 && (

                  <span className="dropdown-count">

                    {unreadAlerts} unread

                  </span>

                )}

              </div>


              {/* ALERTS */}

              <button
                className="security-option"
                onClick={() => {

                  setSecurityOpen(false);

                  navigate("/security");

                }}
              >

                <div className="security-option-icon alert-icon">

                  <FaBell />

                </div>

                <div>

                  <strong>
                    Security Alerts
                  </strong>

                  <span>
                    View security warnings
                  </span>

                </div>

              </button>


              {/* SUSPICIOUS ACTIVITY */}

              <button
                className="security-option"
                onClick={() => {

                  setSecurityOpen(false);

                  navigate("/security");

                }}
              >

                <div className="security-option-icon suspicious-icon">

                  <FaExclamationTriangle />

                </div>

                <div>

                  <strong>
                    Suspicious Activity
                  </strong>

                  <span>
                    Review flagged activity
                  </span>

                </div>

              </button>


              {/* AUDIT LOGS */}

              <button
                className="security-option"
                onClick={() => {

                  setSecurityOpen(false);

                  navigate("/security");

                }}
              >

                <div className="security-option-icon audit-icon">

                  <FaClipboardList />

                </div>

                <div>

                  <strong>
                    Audit Logs
                  </strong>

                  <span>
                    View account activity
                  </span>

                </div>

              </button>

            </div>

          )}

        </div>


        <NavLink to="/profile">

          <FaUserCircle />

          Profile

        </NavLink>

      </div>


      {/* =========================
          LOGOUT
      ========================= */}

      <button
        className="logout-btn"
        onClick={handleLogout}
      >

        <FaSignOutAlt />

        Logout

      </button>

    </nav>

  );

}

export default Navbar;