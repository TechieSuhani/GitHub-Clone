import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./repository.css";

import { FaBook, FaStar } from "react-icons/fa";

import {
  GoCode,
  GoIssueOpened,
  GoGitPullRequest,
  GoGraph,
  GoGear,
  GoPlay,
  GoRepoForked,
} from "react-icons/go";

import AddFileModal from "./AddFileModal";

const Repository = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [repository, setRepository] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileCode, setFileCode] = useState("");

  const [editing, setEditing] = useState(false);
  const [editedCode, setEditedCode] = useState("");

  const fetchRepository = async () => {
    try {
      const response = await fetch(`https://github-clone-backend-jxkl.onrender.com/repo/${id}`);

      const data = await response.json();

      if (Array.isArray(data)) {
        setRepository(data[0]);
      } else {
        setRepository(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRepository();
  }, [id]);

  if (!repository) {
    return (
      <h1
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "80px",
        }}
      >
        Loading...
      </h1>
    );
  }

  const updateFile = async () => {
    try {
      const response = await fetch(
        `https://github-clone-backend-jxkl.onrender.com/repo/update/${repository._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: selectedFile.fileName,
            code: editedCode,
            description: repository.description,
          }),
        },
      );

      if (!response.ok) {
        alert("Update failed");
        return;
      }

      await fetchRepository();

      setFileCode(editedCode);
      setEditing(false);

      alert("File updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFile = async () => {
    const confirmDelete = window.confirm(`Delete ${selectedFile.fileName} ?`);

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://github-clone-backend-jxkl.onrender.com/repo/file/${repository._id}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fileName: selectedFile.fileName,
          }),
        },
      );

      const data = await response.json();

      alert(data.message);

      setSelectedFile(null);
      setFileCode("");
      setEditing(false);

      fetchRepository();
    } catch (err) {
      console.log(err);

      alert("Unable to delete file");
    }
  };

  return (
    <div className="repository-page">
     
    <div className="repo-header">
  <div>
    <h1 className="repo-title">
      <FaBook />
      <span>
        {repository.owner?.username || "You"} / {repository.name}
      </span>
    </h1>

    <p className="repo-description">
      {repository.description}
    </p>
  </div>

  <div className="repo-buttons">
    <button>
      <FaStar />
      <span>Star</span>
    </button>

    <button>
      <GoRepoForked />
      <span>Fork</span>
    </button>

    <button className="green-btn">
      <GoCode />
      <span>Code</span>
    </button>
  </div>
</div>

      <div className="repo-tabs">

  <div className="active-tab">
    <GoCode />
    <span>Code</span>
  </div>

  <div
    className="repo-tab"
    onClick={() => navigate(`/repo/${id}/issues`)}
  >
    <GoIssueOpened />
    <span>Issues</span>
  </div>

  <div
    className="repo-tab"
    onClick={() => navigate(`/repo/${id}/pulls`)}
  >
    <GoGitPullRequest />
    <span>Pull Requests</span>
  </div>

  <div
    className="repo-tab"
    onClick={() => navigate(`/repo/${id}/insights`)}
  >
    <GoGraph />
    <span>Insights</span>
  </div>

  <div
    className="repo-tab"
    onClick={() => navigate(`/repo/${id}/actions`)}
  >
    <GoPlay />
    <span>Actions</span>
  </div>

  <div
    className="repo-tab"
    onClick={() => navigate(`/repo/${id}/settings`)}
  >
    <GoGear />
    <span>Settings</span>
  </div>

</div>

      <div className="repo-content">
        <div className="repo-toolbar">
          <select>
            <option>main</option>
          </select>

          <div className="toolbar-buttons">
            <button>Go to file</button>

            <button onClick={() => setShowModal(true)}>Add file</button>

            <button className="green-btn">Code</button>
          </div>
        </div>

        <div className="file-list">
          {repository.content && repository.content.length > 0 ? (
            repository.content.map((file, index) => (
              <div
                className="file-row"
                key={index}
                onClick={() => {
                  if (selectedFile && selectedFile.fileName === file.fileName) {
                    setSelectedFile(null);
                    setFileCode("");
                    setEditedCode("");
                    setEditing(false);
                    return;
                  }

                  setSelectedFile(file);
                  setFileCode(file.code);
                  setEditedCode(file.code);
                  setEditing(false);
                }}
              >
                📄 {file.fileName}
              </div>
            ))
          ) : (
            <div className="file-row">No files available</div>
          )}
        </div>
      </div>
      {selectedFile && (
        <div className="code-viewer">
          <div className="code-header">
            <span>📄 {selectedFile.fileName}</span>

            <div className="code-actions">
              {!editing ? (
                <>
                  <button className="edit-btn" onClick={() => setEditing(true)}>
                    ✏ Edit
                  </button>

                  <button className="delete-btn" onClick={deleteFile}>
                    🗑 Delete
                  </button>
                </>
              ) : (
                <button className="save-btn" onClick={updateFile}>
                  💾 Save
                </button>
              )}
            </div>
          </div>

          {!editing ? (
            <pre>{fileCode}</pre>
          ) : (
            <textarea
              className="editor"
              value={editedCode}
              onChange={(e) => setEditedCode(e.target.value)}
            />
          )}
        </div>
      )}

      {showModal && (
        <AddFileModal
          closeModal={() => setShowModal(false)}
          repositoryId={repository._id}
          refreshRepository={fetchRepository}
        />
      )}
    </div>
  );
};

export default Repository;
