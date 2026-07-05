import React, { useEffect, useState } from "react";
import "../issue/CreateIssueModal.css";

const CreatePullRequestModal = ({
  onClose,
  onCreate,
  editingPR,
  onUpdate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingPR) {
      setTitle(editingPR.title);
      setDescription(editingPR.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingPR]);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Please enter title");
      return;
    }

    const prData = {
      title,
      description,
    };

    if (editingPR) {
      onUpdate(editingPR._id, prData);
    } else {
      onCreate(prData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="issue-modal">
        <h2>
          {editingPR
            ? "Edit Pull Request"
            : "Create Pull Request"}
        </h2>

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

        <div className="modal-buttons">
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="create-btn"
            onClick={handleSubmit}
          >
            {editingPR
              ? "Update Pull Request"
              : "Create Pull Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePullRequestModal;