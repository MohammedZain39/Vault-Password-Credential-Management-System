import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./AddCredential.css";

function AddCredential() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        website: "",
        username: "",
        password: "",
        category: "",
        notes: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await API.post("/credentials", formData);

            alert("Credential Added Successfully");

            navigate("/vault");

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Failed to save credential."
            );

        }

    };

    return (

        <div className="add-container">

            <form
                className="add-form"
                onSubmit={handleSubmit}
            >

                <h2>Add Credential</h2>

                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="website"
                    placeholder="Website"
                    value={formData.website}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="username"
                    placeholder="Username / Email"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                />

                <textarea
                    name="notes"
                    placeholder="Notes"
                    rows="4"
                    value={formData.notes}
                    onChange={handleChange}
                />

                {message && (
                    <p className="error">{message}</p>
                )}

                <div className="buttons">

                    <button type="submit">
                        Save Credential
                    </button>

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate("/vault")}
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>

    );

}

export default AddCredential;