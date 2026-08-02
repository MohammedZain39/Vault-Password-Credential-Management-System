import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./ViewCredential.css";

function ViewCredential() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [credential, setCredential] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showPinBox, setShowPinBox] = useState(false);
    const [pin, setPin] = useState("");
    const [password, setPassword] = useState("********");

    useEffect(() => {

        async function loadCredential() {

            try {

                const response = await API.get(`/credentials/${id}`);

                setCredential(response.data);

            } catch (error) {

                console.error(error);

                alert("Failed to load credential.");

                navigate("/vault");

            } finally {

                setLoading(false);

            }

        }

        loadCredential();

    }, [id, navigate]);

    async function revealPassword() {

        try {

            const response = await API.post(
                `/credentials/${id}/reveal`,
                {
                    pin
                }
            );

            setPassword(response.data.password);

            setShowPinBox(false);

            setPin("");

        } catch (error) {

            alert(

                error.response?.data?.message ||

                "Incorrect Vault PIN"

            );

        }

    }

    if (loading) {

        return (

            <div className="view-container">

                <h2>Loading...</h2>

            </div>

        );

    }

    if (!credential) {

        return (

            <div className="view-container">

                <h2>Credential Not Found</h2>

            </div>

        );

    }

    return (

        <div className="view-container">

            <div className="view-card">

                <h2>{credential.title}</h2>

                <p>

                    <strong>Website</strong>

                    <br />

                    {credential.website}

                </p>

                <p>

                    <strong>Username</strong>

                    <br />

                    {credential.username}

                </p>

                <p>

                    <strong>Password</strong>

                    <br />

                    {password}

                </p>

                <p>

                    <strong>Category</strong>

                    <br />

                    {credential.category}

                </p>

                <p>

                    <strong>Notes</strong>

                    <br />

                    {credential.notes}

                </p>

                {!showPinBox && (

                    <button
                        onClick={() => setShowPinBox(true)}
                    >

                        👁 Reveal Password

                    </button>

                )}

                {showPinBox && (

                    <div style={{ marginTop: "15px" }}>

                        <input
                            type="password"
                            placeholder="Enter Master PIN"
                            value={pin}
                            onChange={(e) =>
                                setPin(e.target.value)
                            }
                        />

                        <button
                            onClick={revealPassword}
                            style={{ marginLeft: "10px" }}
                        >

                            Unlock

                        </button>

                    </div>

                )}

                <button
                    className="back-btn"
                    onClick={() => navigate("/vault")}
                >

                    Back

                </button>

            </div>

        </div>

    );

}

export default ViewCredential;