import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./RepositorySettings.css";

const RepositorySettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repository, setRepository] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("Public");

  const fetchRepository = async () => {
    try {
      const response = await fetch(`http://localhost:3000/repo/${id}`);
      const data = await response.json();

      const repo = Array.isArray(data) ? data[0] : data;

      setRepository(repo);

      setName(repo.name);
      setDescription(repo.description || "");
      setVisibility(repo.visibility || "Public");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRepository();
  }, []);

  const saveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/repo/settings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            visibility,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Repository updated successfully!");
      } else {
        alert(data.error || "Update failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteRepository = async () => {
    const confirmDelete = window.confirm(
      "Delete this repository permanently?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/repo/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      alert(data.message);

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  if (!repository)
    return <h1 style={{ color: "white" }}>Loading...</h1>;

  return (
    <div className="settings-page">
      <h1>General Settings</h1>

      <div className="settings-card">
        <label>Repository Name</label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Description</label>

        <textarea
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Visibility</label>

        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        >
          <option>Public</option>
          <option>Private</option>
        </select>

        <button
          className="save-btn"
          onClick={saveChanges}
        >
          Save Changes
        </button>
      </div>

      <div className="danger-zone">
        <h2>Danger Zone</h2>

        <button
          className="delete-btn"
          onClick={deleteRepository}
        >
          Delete Repository
        </button>
      </div>
    </div>
  );
};

export default RepositorySettings;