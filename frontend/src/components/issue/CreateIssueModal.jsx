import React, { useEffect, useState } from "react";
import "./CreateIssueModal.css";

const CreateIssueModal = ({ onClose, onCreate, editingIssue, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Open");

  useEffect(() => {
    if (editingIssue) {
      setTitle(editingIssue.title);
      setDescription(editingIssue.description);
      setStatus(editingIssue.status);
    }
  }, [editingIssue]);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Please enter title");
      return;
    }

    const issueData = {
      title,
      description,
      status,
    };

    if (editingIssue) {
      onUpdate(editingIssue._id, issueData);
    } else {
      onCreate(issueData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="issue-modal">
        <h2>{editingIssue ? "Edit Issue" : "Create New Issue"}</h2>

        <label>Title</label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description</label>

        <textarea
          rows="6"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Status</label>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button className="create-btn" onClick={handleSubmit}>
            {editingIssue ? "Update Issue" : "Create Issue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateIssueModal;
