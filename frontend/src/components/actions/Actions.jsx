import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Actions.css";

const Actions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workflows, setWorkflows] = useState([]);
  const [running, setRunning] = useState(false);

  const [selectedLogs, setSelectedLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  // ================= Fetch Workflows =================

  const fetchWorkflows = async () => {
    try {
      const response = await fetch(
        `http://16.171.0.172:3000/actions/all/${id}`
      );

      const data = await response.json();

      setWorkflows(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWorkflows();

    const interval = setInterval(() => {
      fetchWorkflows();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ================= Delete Workflow =================

  const deleteWorkflow = async (workflowId) => {
    const confirmDelete = window.confirm(
      "Delete this workflow?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(
        `http://16.171.0.172:3000/actions/delete/${workflowId}`,
        {
          method: "DELETE",
        }
      );

      fetchWorkflows();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= Run Workflow =================

  const runWorkflow = async () => {
    try {
      setRunning(true);

      // Delete previous workflow automatically
      if (workflows.length > 0) {
        await fetch(
          `http://16.171.0.172:3000/actions/delete/${workflows[0]._id}`,
          {
            method: "DELETE",
          }
        );
      }

      const response = await fetch(
        `http://16.171.0.172:3000/actions/run/${id}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      const actionId = data.action._id;

      let progress = 0;

      const logs = [
        "Workflow Started...",
        "Installing Dependencies...",
        "Running Tests...",
        "Building Project...",
        "Deploying Application...",
        "Workflow Completed Successfully."
      ];

      const interval = setInterval(async () => {
        progress += 20;

        let status = "Running";
        let duration = `${progress / 10} sec`;

        if (progress >= 100) {
          progress = 100;
          status = "Success";
          duration = "10 sec";
        }

        await fetch(
          `http://16.171.0.172:3000/actions/update/${actionId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status,
              progress,
              duration,
              logs: logs.slice(0, progress / 20 + 1),
            }),
          }
        );

        fetchWorkflows();

        if (progress === 100) {
          clearInterval(interval);
          setRunning(false);
        }
      }, 1000);

    } catch (err) {
      console.log(err);
      setRunning(false);
    }
  };

  return (
    <div className="actions-page">

      <div className="actions-header">
        <h1>GitHub Actions</h1>

        <button
          className="workflow-btn"
          disabled={running}
          onClick={runWorkflow}
        >
          {running ? "Running..." : "Run Workflow"}
        </button>
      </div>

      {workflows.length === 0 ? (
        <div className="empty-workflow">
          No Workflow History
        </div>
      ) : (
        workflows.map((workflow) => (
          <div
            className="workflow-card"
            key={workflow._id}
          >
            <div>

              <h2>{workflow.workflow}</h2>

              <p>
                <strong>Status :</strong> {workflow.status}
              </p>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${workflow.progress}%`,
                  }}
                ></div>
              </div>

              <p>{workflow.progress}%</p>

              <p>
                Duration : {workflow.duration}
              </p>

              <div className="workflow-buttons">

                <button
                  onClick={() => {
                    setSelectedLogs(
                      workflow.logs || []
                    );

                    setShowLogs(true);
                  }}
                >
                  View Logs
                </button>

                <button
                  className="delete-workflow-btn"
                  onClick={() =>
                    deleteWorkflow(workflow._id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

            <div className="status">
              {workflow.status}
            </div>

          </div>
        ))
      )}

      {/* ================= Logs Modal ================= */}

      {showLogs && (
        <div className="logs-overlay">

          <div className="logs-modal">

            <h2>Workflow Logs</h2>

            <div className="logs-container">

              {selectedLogs.length > 0 ? (
                selectedLogs.map((log, index) => (
                  <p key={index}>✔ {log}</p>
                ))
              ) : (
                <p>No Logs Available</p>
              )}

            </div>

            <button
              onClick={() => setShowLogs(false)}
            >
              Close
            </button>

          </div>

        </div>
      )}

      <button
        className="back-btn"
        onClick={() => navigate(`/repo/${id}`)}
      >
        ← Back
      </button>

    </div>
  );
};

export default Actions;