import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateRepository.css";

const CreateRepository = () => {
  const navigate = useNavigate();
  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);

  const handleCreateRepository = async () => {
    if (repoName.trim() === "") {
      alert("Repository name is required");
      return;
    }

    try {
      const owner = localStorage.getItem("userId");

      const response = await fetch("http://16.171.0.172:3000/repo/create", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          owner,
          name: repoName,
          description,
          visibility,
          issues: [],
          content: [],
        }),
      });

      const data = await response.json();

      alert(data.message);

      navigate("/");
    } catch (err) {
      console.error(err);

      alert("Repository creation failed");
    }
  };

  return (
    <div className="create-page">
      <div className="create-container">
        <h1>Create a new repository</h1>

        <p className="subtitle">
          A repository contains all your project files.
        </p>

        <div className="form-group">
          <label>Repository name</label>

          <input
            type="text"
            placeholder="Repository name"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description (optional)</label>

          <textarea
            rows="4"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="visibility-box">
          <label>
            <input
              type="radio"
              checked={visibility}
              onChange={() => setVisibility(true)}
            />
            Public
          </label>

          <label>
            <input
              type="radio"
              checked={!visibility}
              onChange={() => setVisibility(false)}
            />
            Private
          </label>
        </div>

        <button className="create-btn" onClick={handleCreateRepository}>
          Create Repository
        </button>
      </div>
    </div>
  );
};

export default CreateRepository;
