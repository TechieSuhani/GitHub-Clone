import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { FaBook, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `https://github-clone-backend-jxkl.onrender.com/repo/user/${userId}`,
        );

        const data = await response.json();

        if (data.repositories) {
          setRepositories(data.repositories);
        }
      } catch (err) {
        console.error("Error fetching repositories:", err);
      }
    };

    fetchRepositories();
  }, []);
  const filteredRepositories = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Top repositories</h3>
        <button className="new-btn" onClick={() => navigate("/create")}>
          <FaPlus />
          <span>New</span>
        </button>
      </div>
      <input
        className="repo-search"
        type="text"
        placeholder="Find a repository..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="repo-list">
        {repositories.length === 0 ? (
          <p style={{ color: "#8b949e", padding: "10px" }}>
            No repositories found
          </p>
        ) : (
          filteredRepositories.map((repo) => (
            <div
              className="repo-item"
              key={repo._id}
              onClick={() => navigate(`/repo/${repo._id}`)}
            >
              <FaBook className="repo-icon" />

              <span>{repo.name}</span>
            </div>
          ))
        )}
      </div>

      <p className="show-more">Show more</p>
    </aside>
  );
};

export default Sidebar;
