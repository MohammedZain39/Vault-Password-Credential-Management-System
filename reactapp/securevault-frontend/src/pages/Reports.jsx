import { useEffect, useState } from "react";
import {
  FaShieldAlt,
  FaKey,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSignInAlt,
  FaChartLine,
  FaLock,
} from "react-icons/fa";

import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import "./Reports.css";

function Reports() {
  const [passwordHealth, setPasswordHealth] = useState(null);
  const [loginActivity, setLoginActivity] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const [passwordResponse, loginResponse] =
          await Promise.all([
            API.get("/reports/password-health"),
            API.get("/reports/login-activity"),
          ]);

        setPasswordHealth(passwordResponse.data);
        setLoginActivity(loginResponse.data);
      } catch (err) {
        console.error("Failed to load reports:", err);

        setError(
          "Unable to load security reports. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <MainLayout>
        <div className="reports-page">
          <div className="reports-loading">
            <div className="loading-spinner"></div>
            <p>Loading security reports...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error) {
    return (
      <MainLayout>
        <div className="reports-page">

          <div className="reports-header">
            <div className="reports-title">
              <div className="reports-title-icon">
                <FaChartLine />
              </div>

              <div>
                <h1>Security Reports</h1>
                <p>
                  Password health and login activity overview
                </p>
              </div>
            </div>
          </div>

          <div className="reports-error">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>

        </div>
      </MainLayout>
    );
  }

  /* =========================================================
     LOGIN DATA
     ========================================================= */

  const totalAttempts =
    loginActivity?.totalAttempts ?? 0;

  const successfulLogins =
    loginActivity?.successfulLogins ?? 0;

  const failedLogins =
    loginActivity?.failedLogins ?? 0;

  const successRate =
    totalAttempts > 0
      ? Math.round(
          (successfulLogins / totalAttempts) * 100
        )
      : 0;

  /* =========================================================
     PASSWORD DATA
     ========================================================= */

  const totalCredentials =
    passwordHealth?.totalCredentials ?? 0;

  const strongPasswords =
    passwordHealth?.strongPasswords ?? 0;

  const mediumPasswords =
    passwordHealth?.mediumPasswords ?? 0;

  const weakPasswords =
    passwordHealth?.weakPasswords ?? 0;

  const healthScore =
    passwordHealth?.healthScore ?? 0;

  return (
    <MainLayout>

      <div className="reports-page">

        {/* =================================================
            PAGE HEADER
            ================================================= */}

        <div className="reports-header">

          <div className="reports-title">

            <div className="reports-title-icon">
              <FaChartLine />
            </div>

            <div>
              <h1>Security Reports</h1>

              <p>
                Monitor your password health and login activity
              </p>
            </div>

          </div>

        </div>


        {/* =================================================
            PASSWORD HEALTH
            ================================================= */}

        <section className="report-section">

          <div className="section-heading">

            <div className="section-icon blue">
              <FaKey />
            </div>

            <div>
              <h2>Password Health</h2>

              <p>
                Overview of the strength of your stored credentials
              </p>
            </div>

          </div>


          <div className="password-report-card">

            {/* PASSWORD STATISTICS */}

            <div className="password-stats">

              {/* TOTAL */}

              <div className="stat-card">

                <div className="stat-icon total">
                  <FaLock />
                </div>

                <div>
                  <span>Total Credentials</span>

                  <strong>
                    {totalCredentials}
                  </strong>
                </div>

              </div>


              {/* STRONG */}

              <div className="stat-card">

                <div className="stat-icon strong">
                  <FaCheckCircle />
                </div>

                <div>
                  <span>Strong</span>

                  <strong>
                    {strongPasswords}
                  </strong>
                </div>

              </div>


              {/* MEDIUM */}

              <div className="stat-card">

                <div className="stat-icon medium">
                  <FaExclamationTriangle />
                </div>

                <div>
                  <span>Medium</span>

                  <strong>
                    {mediumPasswords}
                  </strong>
                </div>

              </div>


              {/* WEAK */}

              <div className="stat-card">

                <div className="stat-icon weak">
                  <FaTimesCircle />
                </div>

                <div>
                  <span>Weak</span>

                  <strong>
                    {weakPasswords}
                  </strong>
                </div>

              </div>

            </div>


            {/* PASSWORD HEALTH SCORE */}

            <div className="health-score">

              <div className="health-score-left">

                <div className="score-circle">

                  <div>
                    <strong>
                      {healthScore}%
                    </strong>

                    <span>
                      Health
                    </span>
                  </div>

                </div>

              </div>


              <div className="health-score-content">

                <h3>
                  Overall Password Health
                </h3>

                <p>
                  Your password security score is based on
                  the strength of credentials stored in your vault.
                </p>


                <div className="health-progress">

                  <div
                    className="health-progress-fill"
                    style={{
                      width: `${Math.min(
                        Math.max(healthScore, 0),
                        100
                      )}%`,
                    }}
                  />

                </div>


                <span className="health-score-value">
                  {healthScore}% secure
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            LOGIN ACTIVITY
            ================================================= */}

        <section className="report-section">

          <div className="section-heading">

            <div className="section-icon purple">
              <FaSignInAlt />
            </div>

            <div>
              <h2>Login Activity</h2>

              <p>
                Overview of recent authentication activity
              </p>
            </div>

          </div>


          <div className="login-report-card">

            {/* LOGIN STATISTICS */}

            <div className="login-stats">

              {/* TOTAL ATTEMPTS */}

              <div className="login-stat">

                <div className="login-stat-icon attempts">
                  <FaSignInAlt />
                </div>

                <div>

                  <span>
                    Total Attempts
                  </span>

                  <strong>
                    {totalAttempts}
                  </strong>

                </div>

              </div>


              {/* SUCCESSFUL */}

              <div className="login-stat">

                <div className="login-stat-icon success">
                  <FaCheckCircle />
                </div>

                <div>

                  <span>
                    Successful Logins
                  </span>

                  <strong>
                    {successfulLogins}
                  </strong>

                </div>

              </div>


              {/* FAILED */}

              <div className="login-stat">

                <div className="login-stat-icon failed">
                  <FaTimesCircle />
                </div>

                <div>

                  <span>
                    Failed Logins
                  </span>

                  <strong>
                    {failedLogins}
                  </strong>

                </div>

              </div>

            </div>


            {/* =================================================
                LOGIN SUCCESS RATE
                ================================================= */}

            <div className="login-rate-card">

              <div className="login-rate-info">

                <div>

                  <h3>
                    Login Success Rate
                  </h3>

                  <p>
                    Successful authentication attempts compared
                    with total attempts
                  </p>

                </div>


                <strong>
                  {successRate}%
                </strong>

              </div>


              {/* PROGRESS BAR */}

              <div className="login-rate-bar">

                <div
                  className="login-rate-fill"
                  style={{
                    width: `${successRate}%`,
                  }}
                />

              </div>


              {/* LABELS */}

              <div className="login-rate-labels">

                <span className="successful-label">
                  {successfulLogins} successful
                </span>

                <span className="failed-label">
                  {failedLogins} failed
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            SECURITY OVERVIEW
            ================================================= */}

        <section className="report-summary">

          <div className="summary-icon">
            <FaShieldAlt />
          </div>

          <div>

            <h3>
              Security Overview
            </h3>

            <p>
              Your SecureVault security reports are generated
              directly from your stored credentials and login
              activity. The values shown above are fetched from
              your backend database.
            </p>

          </div>

        </section>

      </div>

    </MainLayout>
  );
}

export default Reports;