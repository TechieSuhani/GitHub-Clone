import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./RepositoryIssues.css";
import CreateIssueModal from "./CreateIssueModal";

const RepositoryIssues = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);

  const fetchIssues = async () => {
    try {
      const response = await fetch(`http://16.171.0.172:3000/issue/all/${id}`);

      const data = await response.json();

      setIssues(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateIssue = async (issueData) => {
    try {
      const response = await fetch(`http://16.171.0.172:3000/issue/create/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issueData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowModal(false);
        fetchIssues();
        alert("Issue created successfully!");
      } else {
        alert(data.error || "Failed to create issue");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateIssue = async (issueId, issueData) => {
    try {
      const response = await fetch(
        `http://16.171.0.172:3000/issue/update/${issueId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(issueData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Issue updated successfully!");

        setShowModal(false);
        setEditingIssue(null);

        fetchIssues();
      } else {
        alert(data.error || "Failed to update issue");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteIssue = async (issueId) => {
    if (!window.confirm("Delete this issue?")) return;

    try {
      const response = await fetch(
        `http://16.171.0.172:3000/issue/delete/${issueId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      alert(data.message);

      fetchIssues();
    } catch (err) {
      console.log(err);
    }
  };

  const editIssue = (issue) => {
    setEditingIssue(issue);
    setShowModal(true);
  };

  useEffect(() => {
    fetchIssues();
  }, [id]);

  return (
    <div className="issues-page">
      <div className="issues-header">
        <h1>Issues</h1>

        <button
          className="new-issue-btn"
          onClick={() => {
            setEditingIssue(null);
            setShowModal(true);
          }}
        >
          New Issue
        </button>
      </div>

      {issues.length === 0 ? (
        <div className="empty-issues">No Issues Found</div>
      ) : (
        issues.map((issue) => (
          <div className="issue-card" key={issue._id}>
            <div className="issue-top">
              <div>
                <h3>{issue.title}</h3>

                <span className={issue.status === "closed" ? "closed" : "open"}>
                  {issue.status === "closed" ? "Closed" : "Open"}
                </span>
              </div>

              <div className="issue-actions">
                <button className="edit-btn" onClick={() => editIssue(issue)}>
                  ✏ Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteIssue(issue._id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>

            <p>{issue.description}</p>
          </div>
        ))
      )}

      <button className="back-btn" onClick={() => navigate(`/repo/${id}`)}>
        ← Back to Repository
      </button>

      {showModal && (
        <CreateIssueModal
          editingIssue={editingIssue}
          onCreate={handleCreateIssue}
          onUpdate={updateIssue}
          onClose={() => {
            setShowModal(false);
            setEditingIssue(null);
          }}
        />
      )}
    </div>
  );
};

export default RepositoryIssues;
