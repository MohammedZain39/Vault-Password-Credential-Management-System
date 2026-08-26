import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import "./Security.css";

function Security() {

  const [selectedSection, setSelectedSection] =
    useState("alerts");

  const [alerts, setAlerts] = useState([]);
  const [suspiciousActivities, setSuspiciousActivities] =
    useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // LOAD SECURITY DATA
  // ==========================================

  useEffect(() => {

    async function loadSecurityData() {

      try {

        setLoading(true);
        setError("");

        const [
          alertsResponse,
          suspiciousResponse,
          auditResponse
        ] = await Promise.all([

          API.get("/security/alerts"),

          API.get("/security/suspicious"),

          API.get("/security/audit-logs")

        ]);

        setAlerts(alertsResponse.data);

        setSuspiciousActivities(
          suspiciousResponse.data
        );

        setAuditLogs(
          auditResponse.data
        );

      } catch (error) {

        console.error(
          "Failed to load security data:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load security information."
        );

      } finally {

        setLoading(false);

      }

    }

    loadSecurityData();

  }, []);


  // ==========================================
  // FORMAT DATE
  // ==========================================

  function formatDate(date) {

    if (!date) {
      return "Unknown";
    }

    return new Date(date).toLocaleString();

  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <MainLayout>

        <div className="security-loading">

          <div className="loading-spinner"></div>

          <h2>
            Loading Security Center...
          </h2>

        </div>

      </MainLayout>

    );

  }


  return (

    <MainLayout>

      <div className="security-page">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="security-page-header">

          <div>

            <h1>
              🔐 Security Center
            </h1>

            <p>
              Monitor your account security,
              suspicious activity and audit history.
            </p>

          </div>

        </div>


        {/* ==================================
            ERROR
        ================================== */}

        {error && (

          <div className="security-error">

            {error}

          </div>

        )}


        {/* ==================================
            SECURITY SELECTOR
        ================================== */}

        <div className="security-selector">

          <label>
            Security Activity
          </label>

          <select
            value={selectedSection}
            onChange={(e) =>
              setSelectedSection(e.target.value)
            }
          >

            <option value="alerts">
              ⚠ Security Alerts
            </option>

            <option value="suspicious">
              🚨 Suspicious Activity
            </option>

            <option value="audit">
              📋 Audit Logs
            </option>

          </select>

        </div>


        {/* ==================================
            SECURITY ALERTS
        ================================== */}

        {selectedSection === "alerts" && (

          <section className="security-section">

            <div className="section-title">

              <div>

                <h2>
                  ⚠ Security Alerts
                </h2>

                <p>
                  Security warnings detected
                  for your account.
                </p>

              </div>

              <span>
                {alerts.length} alert
                {alerts.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>


            {alerts.length === 0 ? (

              <div className="empty-security">

                <div className="empty-icon">
                  ✓
                </div>

                <h3>
                  No Security Alerts
                </h3>

                <p>
                  No security alerts have
                  been detected for your
                  account.
                </p>

              </div>

            ) : (

              <div className="security-list">

                {alerts.map((alert) => (

                  <div
                    className="security-card alert-card"
                    key={alert.id}
                  >

                    <div className="security-card-icon alert-icon-large">

                      ⚠

                    </div>


                    <div className="security-card-content">

                      <div className="security-card-top">

                        <h3>

                          {alert.alertType
                            ?.replaceAll(
                              "_",
                              " "
                            )}

                        </h3>

                        <span
                          className={
                            alert.severity ===
                            "HIGH"
                              ? "severity high"
                              : "severity"
                          }
                        >

                          {alert.severity}

                        </span>

                      </div>


                      <p>
                        {alert.message}
                      </p>


                      <div className="security-card-meta">

                        <span>

                          Status:

                          <strong>
                            {" "}
                            {alert.status}
                          </strong>

                        </span>

                        <span>

                          {formatDate(
                            alert.createdAt
                          )}

                        </span>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        )}


        {/* ==================================
            SUSPICIOUS ACTIVITY
        ================================== */}

        {selectedSection === "suspicious" && (

          <section className="security-section">

            <div className="section-title">

              <div>

                <h2>
                  🚨 Suspicious Activity
                </h2>

                <p>
                  Activities that have been
                  flagged as suspicious.
                </p>

              </div>

              <span>
                {suspiciousActivities.length}
                {" "}
                flagged
              </span>

            </div>


            {suspiciousActivities.length === 0 ? (

              <div className="empty-security">

                <div className="empty-icon">
                  ✓
                </div>

                <h3>
                  No Suspicious Activity
                </h3>

                <p>
                  Your account has no flagged
                  suspicious activity.
                </p>

              </div>

            ) : (

              <div className="security-list">

                {suspiciousActivities.map(
                  (activity) => (

                    <div
                      className="security-card suspicious-card"
                      key={activity.id}
                    >

                      <div className="security-card-icon suspicious-icon-large">

                        🚨

                      </div>


                      <div className="security-card-content">

                        <div className="security-card-top">

                          <h3>

                            {activity.activityType
                              ?.replaceAll(
                                "_",
                                " "
                              )}

                          </h3>

                          <span className="flagged-badge">

                            {activity.status}

                          </span>

                        </div>


                        <p>
                          {activity.description}
                        </p>


                        <div className="security-card-meta">

                          <span>
                            Detected
                          </span>

                          <span>

                            {formatDate(
                              activity.detectedAt
                            )}

                          </span>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        )}


        {/* ==================================
            AUDIT LOGS
        ================================== */}

        {selectedSection === "audit" && (

          <section className="security-section">

            <div className="section-title">

              <div>

                <h2>
                  📋 Audit Logs
                </h2>

                <p>
                  Complete history of important
                  account activities.
                </p>

              </div>

              <span>

                {auditLogs.length} record
                {auditLogs.length !== 1
                  ? "s"
                  : ""}

              </span>

            </div>


            {auditLogs.length === 0 ? (

              <div className="empty-security">

                <div className="empty-icon">
                  ✓
                </div>

                <h3>
                  No Audit Logs
                </h3>

                <p>
                  No account activity has
                  been recorded yet.
                </p>

              </div>

            ) : (

              <div className="audit-table-wrapper">

                <table className="audit-table">

                  <thead>

                    <tr>

                      <th>
                        Action
                      </th>

                      <th>
                        Description
                      </th>

                      <th>
                        Time
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {auditLogs.map((log) => (

                      <tr key={log.id}>

                        <td>

                          <span className="action-badge">

                            {log.action
                              ?.replaceAll(
                                "_",
                                " "
                              )}

                          </span>

                        </td>

                        <td>
                          {log.description}
                        </td>

                        <td>

                          {formatDate(
                            log.timestamp
                          )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        )}

      </div>

    </MainLayout>

  );

}

export default Security;