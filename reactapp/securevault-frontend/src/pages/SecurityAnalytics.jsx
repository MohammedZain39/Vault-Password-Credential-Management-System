import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import "./SecurityAnalytics.css";

function SecurityAnalytics() {

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSection, setSelectedSection] =
    useState("login");

  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState("");


  // ==========================================
  // LOAD SECURITY ANALYTICS
  // ==========================================

  useEffect(() => {

    async function loadAnalytics() {

      try {

        setLoading(true);
        setError("");

        const response =
          await API.get("/security/analytics");

        console.log(
          "Security Analytics:",
          response.data
        );

        setAnalytics(response.data);

      } catch (err) {

        console.error(
          "Security Analytics Error:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Unable to load security analytics."
        );

      } finally {

        setLoading(false);

      }

    }

    loadAnalytics();

  }, []);


  // ==========================================
  // LOAD AUDIT LOGS
  // Only when Audit Logs is selected
  // ==========================================

  useEffect(() => {

    if (selectedSection !== "audit") {
      return;
    }

    async function loadAuditLogs() {

      try {

        setAuditLoading(true);
        setAuditError("");

        const response =
          await API.get("/security/audit-logs");

        console.log(
          "Audit Logs:",
          response.data
        );

        setAuditLogs(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } catch (err) {

        console.error(
          "Audit Logs Error:",
          err
        );

        setAuditError(
          err.response?.data?.message ||
          "Unable to load audit logs."
        );

      } finally {

        setAuditLoading(false);

      }

    }

    loadAuditLogs();

  }, [selectedSection]);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <MainLayout>

        <div className="security-page-loading">

          <div className="security-spinner"></div>

          <p>
            Loading security analytics...
          </p>

        </div>

      </MainLayout>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <MainLayout>

        <div className="security-page">

          <div className="security-error">

            <h2>
              Security Analytics
            </h2>

            <p>
              {error}
            </p>

          </div>

        </div>

      </MainLayout>

    );

  }


  if (!analytics) {
    return null;
  }


  // ==========================================
  // ANALYTICS VALUES
  // ==========================================

  const total =
    analytics.totalLogins || 0;

  const successful =
    analytics.successfulLogins || 0;

  const failed =
    analytics.failedLogins || 0;

  const suspicious =
    analytics.suspiciousActivities || 0;

  const alerts =
    analytics.securityAlerts || 0;

  const unread =
    analytics.unreadAlerts || 0;


  // ==========================================
  // LOGIN PERCENTAGES
  // ==========================================

  const successPercentage =
    total > 0
      ? Math.round(
          (successful / total) * 100
        )
      : 0;

  const failedPercentage =
    total > 0
      ? Math.round(
          (failed / total) * 100
        )
      : 0;


  // ==========================================
  // FORMAT AUDIT DATE
  // ==========================================

  function formatAuditTime(timestamp) {

    if (!timestamp) {
      return "Unknown time";
    }

    const date =
      new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }

    return date.toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <MainLayout>

      <div className="security-page">


        {/* =====================================
            HEADER
        ===================================== */}

        <div className="security-page-header">

          <div>

            <h1>
              Security Analytics
            </h1>

            <p>
              Monitor your account security
              and recent activity.
            </p>

          </div>


          <div
            className={
              unread > 0
                ? "security-indicator warning"
                : "security-indicator safe"
            }
          >

            <span></span>

            {unread > 0
              ? `${unread} unread alert${
                  unread > 1 ? "s" : ""
                }`
              : "All clear"}

          </div>

        </div>


        {/* =====================================
            SECURITY STATISTICS
        ===================================== */}

        <div className="security-stat-grid">


          {/* TOTAL LOGINS */}

          <div className="security-stat-card">

            <div className="stat-card-top">

              <span>
                Total Logins
              </span>

              <div className="stat-icon blue">
                ↗
              </div>

            </div>

            <strong>
              {total}
            </strong>

          </div>


          {/* SUCCESSFUL */}

          <div className="security-stat-card">

            <div className="stat-card-top">

              <span>
                Successful Logins
              </span>

              <div className="stat-icon green">
                ✓
              </div>

            </div>

            <strong>
              {successful}
            </strong>

          </div>


          {/* FAILED */}

          <div className="security-stat-card">

            <div className="stat-card-top">

              <span>
                Failed Logins
              </span>

              <div className="stat-icon red">
                ×
              </div>

            </div>

            <strong>
              {failed}
            </strong>

          </div>


          {/* SUSPICIOUS */}

          <div className="security-stat-card">

            <div className="stat-card-top">

              <span>
                Suspicious Activity
              </span>

              <div className="stat-icon orange">
                !
              </div>

            </div>

            <strong>
              {suspicious}
            </strong>

          </div>


          {/* ALERTS */}

          <div className="security-stat-card">

            <div className="stat-card-top">

              <span>
                Security Alerts
              </span>

              <div className="stat-icon purple">
                ⚠
              </div>

            </div>

            <strong>
              {alerts}
            </strong>

          </div>


          {/* UNREAD */}

          <div className="security-stat-card">

            <div className="stat-card-top">

              <span>
                Unread Alerts
              </span>

              <div className="stat-icon dark">
                •
              </div>

            </div>

            <strong>
              {unread}
            </strong>

          </div>

        </div>


        {/* =====================================
            SECURITY DETAILS
        ===================================== */}

        <div className="security-details-card">


          {/* DETAILS HEADER */}

          <div className="security-details-header">

            <div>

              <h2>
                Security Details
              </h2>

              <p>
                Select an activity to view
                more information.
              </p>

            </div>


            <select
              value={selectedSection}
              onChange={(event) =>
                setSelectedSection(
                  event.target.value
                )
              }
            >

              <option value="login">
                Login Activity
              </option>

              <option value="suspicious">
                Suspicious Activities
              </option>

              <option value="alerts">
                Security Alerts
              </option>

              <option value="audit">
                Audit Logs
              </option>

            </select>

          </div>


          {/* =====================================
              LOGIN ACTIVITY
          ===================================== */}

          {selectedSection === "login" && (

            <div className="details-content">

              <div className="details-title">

                <div className="details-icon blue">
                  🔐
                </div>

                <div>

                  <h3>
                    Login Activity
                  </h3>

                  <p>
                    Overview of your authentication
                    attempts.
                  </p>

                </div>

              </div>


              {/* SUCCESSFUL */}

              <div className="login-metric">

                <div className="metric-header">

                  <span>

                    <i className="dot success"></i>

                    Successful Logins

                  </span>

                  <strong>
                    {successful}
                  </strong>

                </div>


                <div className="metric-bar">

                  <div
                    className="metric-success"
                    style={{
                      width:
                        `${successPercentage}%`
                    }}
                  ></div>

                </div>


                <small>
                  {successPercentage}%
                  {" "}success rate
                </small>

              </div>


              {/* FAILED */}

              <div className="login-metric">

                <div className="metric-header">

                  <span>

                    <i className="dot failed"></i>

                    Failed Logins

                  </span>

                  <strong>
                    {failed}
                  </strong>

                </div>


                <div className="metric-bar">

                  <div
                    className="metric-failed"
                    style={{
                      width:
                        `${failedPercentage}%`
                    }}
                  ></div>

                </div>


                <small>
                  {failedPercentage}%
                  {" "}failure rate
                </small>

              </div>


              {/* SUMMARY */}

              <div className="login-summary">

                <div>

                  <span>
                    Total Attempts
                  </span>

                  <strong>
                    {total}
                  </strong>

                </div>


                <div>

                  <span>
                    Success Rate
                  </span>

                  <strong>
                    {successPercentage}%
                  </strong>

                </div>


                <div>

                  <span>
                    Failure Rate
                  </span>

                  <strong>
                    {failedPercentage}%
                  </strong>

                </div>

              </div>

            </div>

          )}


          {/* =====================================
              SUSPICIOUS ACTIVITIES
          ===================================== */}

          {selectedSection === "suspicious" && (

            <div className="details-content">

              <div className="details-title">

                <div className="details-icon orange">
                  !
                </div>

                <div>

                  <h3>
                    Suspicious Activities
                  </h3>

                  <p>
                    Activities detected by the
                    security monitoring system.
                  </p>

                </div>

              </div>


              <div className="simple-result">

                <div className="result-number orange-text">
                  {suspicious}
                </div>

                <div>

                  <strong>
                    Suspicious activities detected
                  </strong>

                  <p>
                    Review detected activities
                    for more information.
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* =====================================
              SECURITY ALERTS
          ===================================== */}

          {selectedSection === "alerts" && (

            <div className="details-content">

              <div className="details-title">

                <div className="details-icon purple">
                  ⚠
                </div>

                <div>

                  <h3>
                    Security Alerts
                  </h3>

                  <p>
                    Security notifications generated
                    for your account.
                  </p>

                </div>

              </div>


              <div className="simple-result">

                <div className="result-number purple-text">
                  {alerts}
                </div>

                <div>

                  <strong>
                    Security alerts generated
                  </strong>

                  <p>

                    {unread > 0
                      ? `${unread} alert${
                          unread > 1 ? "s" : ""
                        } require${
                          unread === 1
                            ? "s"
                            : ""
                        } your attention.`
                      : "No unread alerts require your attention."}

                  </p>

                </div>

              </div>

            </div>

          )}


          {/* =====================================
              AUDIT LOGS
          ===================================== */}

          {selectedSection === "audit" && (

            <div className="details-content">

              <div className="details-title">

                <div className="details-icon blue">
                  ≡
                </div>

                <div>

                  <h3>
                    Audit Logs
                  </h3>

                  <p>
                    Important security events recorded
                    by SecureVault.
                  </p>

                </div>

              </div>


              {/* AUDIT ERROR */}

              {auditError && (

                <div className="audit-error">

                  {auditError}

                </div>

              )}


              {/* AUDIT LOADING */}

              {auditLoading ? (

                <div className="audit-loading">

                  <div className="small-spinner"></div>

                  <span>
                    Loading audit logs...
                  </span>

                </div>

              ) : auditLogs.length === 0 ? (

                /* EMPTY */

                <div className="audit-empty">

                  <div className="audit-empty-icon">
                    ≡
                  </div>

                  <h3>
                    No audit activity
                  </h3>

                  <p>
                    Security events will appear
                    here as activity occurs.
                  </p>

                </div>

              ) : (

                /* AUDIT LIST */

                <div className="audit-list">

                  {auditLogs.map((log) => (

                    <div
                      className="audit-item"
                      key={log.id}
                    >

                      <div className="audit-item-icon">
                        ✓
                      </div>


                      <div className="audit-item-content">

                        <div className="audit-item-header">

                          <strong>
                            {log.action}
                          </strong>

                          <span>
                            {formatAuditTime(
                              log.timestamp
                            )}
                          </span>

                        </div>


                        <p>
                          {log.description}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          )}

        </div>


        {/* =====================================
            SECURITY STATUS
        ===================================== */}

        <div
          className={
            unread > 0
              ? "security-bottom warning"
              : "security-bottom safe"
          }
        >

          <div className="bottom-icon">

            {unread > 0
              ? "!"
              : "✓"}

          </div>


          <div>

            <strong>

              {unread > 0
                ? "Security attention required"
                : "Your account is secure"}

            </strong>


            <p>

              {unread > 0
                ? `You have ${unread} unread security alert${
                    unread > 1 ? "s" : ""
                  }.`
                : "No unread security alerts at this time."}

            </p>

          </div>

        </div>

      </div>

    </MainLayout>

  );

}

export default SecurityAnalytics;