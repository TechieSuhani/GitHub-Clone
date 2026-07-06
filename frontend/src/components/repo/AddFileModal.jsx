import React, { useState } from "react";
import "./AddFileModal.css";

const AddFileModal = ({ closeModal, repositoryId, refreshRepository }) => {
  const [fileName, setFileName] = useState("");
  const [code, setCode] = useState("");

  const handleSave = async () => {
    if (!fileName.trim()) {
      alert("Please enter file name");
      return;
    }

    try {
      const response = await fetch(
        `https://github-clone-backend-jxkl.onrender.com/repo/update/${repositoryId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            content: {
              fileName: fileName,
              code: code,
            },
            description: "",
          }),
        },
      );

      const data = await response.json();

      console.log(data);

      alert("File added successfully");

      refreshRepository();

      closeModal();
    } catch (err) {
      console.log(err);

      alert("Something went wrong");
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Add New File</h2>

        <input
          type="text"
          placeholder="File name (example : index.js)"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />

        <textarea
          rows="12"
          placeholder="Write your code..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <div className="modal-buttons">
        

          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
             <button className="save-btn" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFileModal;
