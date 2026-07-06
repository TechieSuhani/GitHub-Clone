import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

import Navbar from "../Navbar";
import Sidebar from "../sidebar/Sidebar";
import RightSidebar from "../rightbar/RightSidebar";


const Dashboard = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/repo/user/${userId}`,
        );

        const data = await response.json();

        setRepositories(data.repositories || []);
      } catch (err) {
        console.error("Error while fetching repositories:", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch("http://localhost:3000/repo/all");

        const data = await response.json();

        setSuggestedRepositories(data || []);
      } catch (err) {
        console.error("Error while fetching repositories:", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div className="home-header">
            <div>
              <h1 className="home-title">Home</h1>

              <p className="home-subtitle">
                Welcome back! Manage your repositories and collaborate with your
                team.
              </p>
            </div>
          </div>

        

          <div className="repo-section">
            <div className="repo-header">
              <div className="repo-title">
                <h2>Your Repositories</h2>

                <p>Manage and organize your repositories.</p>
              </div>

    
            </div>

            <input
              className="repo-search-box"
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="repo-grid">
              {searchResults.length === 0 ? (
                <div className="empty-card">No Repository Found</div>
              ) : (
                searchResults.map((repo) => (
                  <div
                    className="repo-card"
                    key={repo._id}
                    onClick={() => navigate(`/repo/${repo._id}`)}
                  >
                    <div className="repo-top">
                      <h3>{repo.name}</h3>

                      <span className="repo-type">Public</span>
                    </div>

                    <p className="repo-description">
                      {repo.description || "No description available"}
                    </p>

                    <div className="repo-footer">
                      <div className="repo-language">
                        <span className="language-dot"></span>
                        JavaScript
                      </div>

                      <span className="repo-updated">Updated today</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        <RightSidebar />
      </div>
    </>
  );
};

export default Dashboard;
