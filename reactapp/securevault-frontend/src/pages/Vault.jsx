import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import "./Vault.css";

function Vault() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [hasPin, setHasPin] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const [credentials, setCredentials] = useState([]);
  const [search, setSearch] = useState("");

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [message, setMessage] = useState("");

  // ==========================
  // SHARE STATE
  // ==========================

  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [sharing, setSharing] = useState(false);

  useEffect(() => {

    async function loadVault() {

      try {

        const response = await API.get("/vault/status");

        setHasPin(response.data.hasPin);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    }

    loadVault();

  }, []);

  async function fetchCredentials() {

    try {

      const response = await API.get("/credentials");

      const sorted = [...response.data].sort(
        (a, b) => b.id - a.id
      );

      setCredentials(sorted);

    } catch (error) {

      console.log(error);

    }

  }

  async function createPin() {

    if (pin !== confirmPin) {

      setMessage("PINs do not match.");

      return;

    }

    try {

      const response = await API.post("/vault/create-pin", {
        pin,
      });

      setMessage(response.data.message);

      setHasPin(true);

      setPin("");
      setConfirmPin("");

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Failed to create PIN"
      );

    }

  }

  async function verifyPin() {

    try {

      const response = await API.post("/vault/verify-pin", {
        pin,
      });

      setMessage(response.data.message);

      setUnlocked(true);

      setPin("");

      await fetchCredentials();

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Invalid PIN"
      );

    }

  }

  async function deleteCredential(id) {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this credential?"
    );

    if (!confirmDelete) return;

    try {

      const response = await API.delete(
        `/credentials/${id}`
      );

      alert(response.data.message);

      await fetchCredentials();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to delete credential."
      );

    }

  }

  // ==========================
  // OPEN SHARE MODAL
  // ==========================

  function openShareModal(credential) {

    setSelectedCredential(credential);
    setRecipientEmail("");
    setExpiresAt("");
    setShareMessage("");
    setShowShareModal(true);

  }

  // ==========================
  // CLOSE SHARE MODAL
  // ==========================

  function closeShareModal() {

    if (sharing) return;

    setShowShareModal(false);
    setSelectedCredential(null);
    setRecipientEmail("");
    setExpiresAt("");
    setShareMessage("");

  }

  // ==========================
  // SHARE CREDENTIAL
  // ==========================

  async function shareCredential() {

    if (!recipientEmail.trim()) {

      setShareMessage("Please enter the recipient email.");

      return;

    }

    setSharing(true);
    setShareMessage("");

    try {

      let url =
        `/credentials/${selectedCredential.id}/share` +
        `?email=${encodeURIComponent(recipientEmail.trim())}`;

      if (expiresAt) {

        url += `&expiresAt=${encodeURIComponent(
          expiresAt
        )}`;

      }

      const response = await API.post(url);

      setShareMessage(
        response.data.message ||
        "Credential shared successfully."
      );

      setRecipientEmail("");
      setExpiresAt("");

      setTimeout(() => {

        closeShareModal();

      }, 1500);

    } catch (error) {

      setShareMessage(
        error.response?.data?.message ||
        "Failed to share credential."
      );

    } finally {

      setSharing(false);

    }

  }

  const filteredCredentials = credentials.filter((credential) =>

    (credential.title || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    (credential.username || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    (credential.website || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    (credential.category || "")
      .toLowerCase()
      .includes(search.toLowerCase())

  );

  if (loading) {

    return (

      <MainLayout>

        <h2>Loading Vault...</h2>

      </MainLayout>

    );

  }

  return (

    <MainLayout>

      {/* CREATE PIN */}

      {!hasPin && (

        <div className="vault-box">

          <h1>Create Master PIN</h1>

          <p>
            Create a secure 4-digit PIN to protect your vault.
          </p>

          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm PIN"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
          />

          <button onClick={createPin}>
            Create PIN
          </button>

          {message && <p>{message}</p>}

        </div>

      )}

      {/* VERIFY PIN */}

      {hasPin && !unlocked && (

        <div className="vault-box">

          <h1>Unlock Vault</h1>

          <p>Enter your Master PIN</p>

          <input
            type="password"
            placeholder="Master PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />

          <button onClick={verifyPin}>
            Unlock Vault
          </button>

          {message && <p>{message}</p>}

        </div>

      )}

      {/* VAULT */}

      {unlocked && (

        <div className="vault-page">

          <div className="vault-header">

            <h1>🔐 Secure Vault</h1>

            <div className="vault-actions">

    <button
        className="shared-btn"
        onClick={() => navigate("/shared-credentials")}
    >
        ↗ Shared With Me
    </button>

    <button
        className="add-btn"
        onClick={() => navigate("/add-credential")}
    >
        + Add Credential
    </button>

</div>

          </div>

          <input
            className="search-box"
            type="text"
            placeholder="Search Credentials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredCredentials.length === 0 ? (

            <p className="empty-state">
              No credentials found.
            </p>

          ) : (

            <div className="credentials-grid">

              {filteredCredentials.map((credential) => (

                <div
                  className="credential-card"
                  key={credential.id}
                >

                  <h3>{credential.title}</h3>

                  <p>
                    <strong>Username:</strong>{" "}
                    {credential.username}
                  </p>

                  <p>
                    <strong>Website:</strong>{" "}
                    {credential.website}
                  </p>

                  <p>
                    <strong>Category:</strong>{" "}
                    {credential.category || "General"}
                  </p>

                  <div className="card-buttons">

                    <button
                      onClick={() =>
                        navigate(
                          `/credential/${credential.id}`
                        )
                      }
                    >
                      👁 View
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/edit-credential/${credential.id}`
                        )
                      }
                    >
                      ✏ Edit
                    </button>

                    <button
                      className="share-card-btn"
                      onClick={() =>
                        openShareModal(credential)
                      }
                    >
                      🔗 Share
                    </button>

                    <button
                      onClick={() =>
                        deleteCredential(credential.id)
                      }
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      )}

      {/* ==========================
          SHARE MODAL
      ========================== */}

      {showShareModal && selectedCredential && (

        <div className="share-overlay">

          <div className="share-modal">

            <button
              className="share-close"
              onClick={closeShareModal}
              disabled={sharing}
            >
              ×
            </button>

            <div className="share-icon">
              🔗
            </div>

            <h2>Share Credential</h2>

            <p className="share-subtitle">
              Share <strong>{selectedCredential.title}</strong>{" "}
              securely with another user.
            </p>

            <label>
              Recipient Email
            </label>

            <input
              type="email"
              placeholder="recipient@example.com"
              value={recipientEmail}
              onChange={(e) =>
                setRecipientEmail(e.target.value)
              }
              disabled={sharing}
            />

            <label>
              Access Expires
              <span className="optional">
                Optional
              </span>
            </label>

            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) =>
                setExpiresAt(e.target.value)
              }
              disabled={sharing}
            />

            <p className="share-hint">
              Leave the expiry empty for permanent access.
            </p>

            {shareMessage && (

              <div
                className={
                  shareMessage.toLowerCase().includes("success")
                    ? "share-success"
                    : "share-error"
                }
              >
                {shareMessage}
              </div>

            )}

            <div className="share-actions">

              <button
                className="share-cancel"
                onClick={closeShareModal}
                disabled={sharing}
              >
                Cancel
              </button>

              <button
                className="share-confirm"
                onClick={shareCredential}
                disabled={sharing}
              >
                {sharing ? "Sharing..." : "Share Credential"}
              </button>

            </div>

          </div>

        </div>

      )}

    </MainLayout>

  );

}

export default Vault;