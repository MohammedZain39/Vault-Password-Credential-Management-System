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

          <p>Create a secure 4-digit PIN to protect your vault.</p>

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

            <button
              className="add-btn"
              onClick={() => navigate("/add-credential")}
            >
              + Add Credential
            </button>

          </div>

          <input
            className="search-box"
            type="text"
            placeholder="Search Credentials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredCredentials.length === 0 ? (

            <p>No credentials found.</p>

          ) : (

            filteredCredentials.map((credential) => (

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
                  {credential.category}
                </p>

                <div className="card-buttons">

                  <button
                    onClick={() =>
                      navigate(`/credential/${credential.id}`)
                    }
                  >
                    👁 View
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/edit-credential/${credential.id}`)
                    }
                  >
                    ✏ Edit
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

            ))

          )}

        </div>

      )}

    </MainLayout>

  );

}

export default Vault;