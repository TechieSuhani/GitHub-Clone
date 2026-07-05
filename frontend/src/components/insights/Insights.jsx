import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Insights.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar, Doughnut } from "react-chartjs-2";

import {
  FaFolder,
  FaBug,
  FaCheckCircle,
  FaCodeBranch,
  FaFile,
} from "react-icons/fa";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

const Insights = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [insights, setInsights] = useState(null);

  const fetchInsights = async () => {
    try {
      const response = await fetch(`http://localhost:3000/repo/insights/${id}`);

      const data = await response.json();
      setInsights(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (!insights) {
    return (
      <h2
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "80px",
        }}
      >
        Loading...
      </h2>
    );
  }

  const issueData = {
    labels: ["Open", "Closed"],
    datasets: [
      {
        data: [insights.openIssues, insights.closedIssues],
        backgroundColor: ["#2ea043", "#da3633"],
      },
    ],
  };

  const prData = {
    labels: ["Open", "Merged"],

    datasets: [
      {
        data: [insights.openPullRequests, insights.mergedPullRequests],

        backgroundColor: ["#2ea043", "#8957e5"],
      },
    ],
  };

  const repoData = {
    labels: [
      "Files",
      "Issues",
      "Open Issues",
      "Closed Issues",
      "Pull Requests",
    ],

    datasets: [
      {
        label: "Repository Statistics",

        data: [
          insights.totalFiles,
          insights.totalIssues,
          insights.openIssues,
          insights.closedIssues,
          insights.totalPullRequests,
        ],

        backgroundColor: [
          "#58a6ff",
          "#8957e5",
          "#2ea043",
          "#da3633",
          "#f39c12",
        ],
      },
    ],
  };

  return (
    <div className="insights-page">
      <h1>Repository Insights</h1>

      {/* ================= Cards ================= */}

      <div className="insights-grid">
        <div className="insight-card">
          <h3>Repository</h3>
          <p>{insights.repositoryName}</p>
        </div>

        <div className="insight-card">
          <h3>Total Files</h3>
          <p>{insights.totalFiles}</p>
        </div>

        <div className="insight-card">
          <h3>Total Issues</h3>
          <p>{insights.totalIssues}</p>
        </div>

        <div className="insight-card">
          <h3>Open Issues</h3>
          <p>{insights.openIssues}</p>
        </div>

        <div className="insight-card">
          <h3>Closed Issues</h3>
          <p>{insights.closedIssues}</p>
        </div>

        <div className="insight-card">
          <h3>Visibility</h3>
          <p>{insights.visibility ? "Public" : "Private"}</p>
        </div>

        <div className="insight-card">
          <h3>Last Updated</h3>
          <p>{new Date(insights.updatedAt).toLocaleDateString()}</p>
        </div>

        <div className="insight-card">
          <h3>Total Pull Requests</h3>
          <p>{insights.totalPullRequests}</p>
        </div>

        <div className="insight-card">
          <h3>Merged Pull Requests</h3>
          <p>{insights.mergedPullRequests}</p>
        </div>

        <div className="insight-card">
          <h3>Open Pull Requests</h3>
          <p>{insights.openPullRequests}</p>
        </div>

        <div className="insight-card">
          <h3>Repository Health</h3>

          <div className="health-bar">
            <div
              className="health-progress"
              style={{
                width: `${insights.health}%`,
              }}
            ></div>
          </div>

          <span className="health-text">{insights.health}%</span>
        </div>
      </div>

      {/* ================= Charts ================= */}
<div className="charts-container">

  <div className="chart-card">

    <h2>Issues Overview</h2>

    {insights.totalIssues === 0 ? (
      <div className="empty-chart">
        No Issues Available
      </div>
    ) : (
      <Pie data={issueData} />
    )}

  </div>

  <div className="chart-card">

    <h2>Repository Statistics</h2>

    {insights.totalFiles === 0 &&
    insights.totalIssues === 0 ? (
      <div className="empty-chart">
        Repository is Empty
      </div>
    ) : (
      <Bar data={repoData} />
    )}

  </div>

  <div className="chart-card">

    <h2>Pull Requests</h2>

    {insights.totalPullRequests === 0 ? (
      <div className="empty-chart">
        No Pull Requests
      </div>
    ) : (
      <Doughnut data={prData} />
    )}

  </div>

</div>

<div className="activity-card">

  <h2>Recent Activity</h2>

  <div className="activity-item">
    <FaFolder className="activity-icon folder" />
    <span>Repository Created</span>
  </div>

  <div className="activity-item">
    <FaFile className="activity-icon file" />
    <span>{insights.totalFiles} Files Added</span>
  </div>

  <div className="activity-item">
    <FaBug className="activity-icon bug" />
    <span>{insights.totalIssues} Issues Created</span>
  </div>

  <div className="activity-item">
    <FaCheckCircle className="activity-icon check" />
    <span>{insights.closedIssues} Issues Closed</span>
  </div>

  <div className="activity-item">
    <FaCodeBranch className="activity-icon branch" />
    <span>{insights.totalPullRequests} Pull Requests</span>
  </div>

</div>

      <button className="back-btn" onClick={() => navigate(`/repo/${id}`)}>
        ← Back to Repository
      </button>
    </div>
  );
};

export default Insights;
