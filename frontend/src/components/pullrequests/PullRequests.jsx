import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PullRequests.css";
import CreatePullRequestModal from "./CreatePullRequestModal";

const PullRequests = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pullRequests, setPullRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPR, setEditingPR] = useState(null);

  // ================= FETCH =================

  const fetchPullRequests = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/pullrequest/all/${id}`,
      );

      const data = await response.json();

      setPullRequests(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPullRequests();
  }, [id]);

  // ================= CREATE =================

  const createPullRequest = async (prData) => {
    try {
      const response = await fetch(
        `http://localhost:3000/pullrequest/create/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setShowModal(false);
        fetchPullRequests();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= UPDATE =================

  const updatePullRequest = async (pullRequestId, prData) => {
    try {
      const response = await fetch(
        `http://localhost:3000/pullrequest/update/${pullRequestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: prData.title,
            description: prData.description,
            status: editingPR.status,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        setShowModal(false);
        setEditingPR(null);

        fetchPullRequests();
      } else {
        alert(data.error || "Update failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= MERGE =================

  const mergePullRequest = async (pr) => {
    try {
      const response = await fetch(
        `http://localhost:3000/pullrequest/update/${pr._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: pr.title,
            description: pr.description,
            status: "merged",
          }),
        },
      );

      const data = await response.json();

      alert(data.message);

      fetchPullRequests();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DELETE =================

  const deletePullRequest = async (pullRequestId) => {
    if (!window.confirm("Delete this Pull Request?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/pullrequest/delete/${pullRequestId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      alert(data.message);

      fetchPullRequests();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="pull-page">
      <div className="pull-header">
        <h1>Pull Requests</h1>

        <button
          className="new-pr-btn"
          onClick={() => {
            setEditingPR(null);
            setShowModal(true);
          }}
        >
          New Pull Request
        </button>
      </div>

      {pullRequests.length === 0 ? (
        <div className="empty-pr">No Pull Requests Yet</div>
      ) : (
        pullRequests.map((pr) => (
          <div className="pr-card" key={pr._id}>
            <div className="pr-top">
              <div>
                <h2>{pr.title}</h2>

                <span className={pr.status}>
                  {pr.status.charAt(0).toUpperCase() + pr.status.slice(1)}
                </span>
              </div>

              <div className="pr-buttons">
                <button
                  onClick={() => {
                    setEditingPR(pr);
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>

                <button onClick={() => mergePullRequest(pr)}>Merge</button>

                <button
                  className="delete"
                  onClick={() => deletePullRequest(pr._id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="pr-description">{pr.description}</p>
          </div>
        ))
      )}

      <button className="back-btn" onClick={() => navigate(`/repo/${id}`)}>
        ← Back
      </button>

      {showModal && (
        <CreatePullRequestModal
          editingPR={editingPR}
          onCreate={createPullRequest}
          onUpdate={updatePullRequest}
          onClose={() => {
            setShowModal(false);
            setEditingPR(null);
          }}
        />
      )}
    </div>
  );
};

export default PullRequests;
