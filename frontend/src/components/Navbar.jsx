import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import "./navbar.css";

import {
  FaGithub,
  FaBars,
  FaBell,
  FaPlus,
  FaCodeBranch,
  FaInbox,
  FaSearch,
} from "react-icons/fa";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [filteredRepositories, setFilteredRepositories] = useState([]);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    setCurrentUser(null);

    navigate("/auth");
  };

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch("http://16.171.0.172:3000/repo/all");

        const data = await response.json();

        setRepositories(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRepositories();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredRepositories([]);
      return;
    }

    const result = repositories.filter((repo) =>
      repo.name.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredRepositories(result);
  }, [search, repositories]);

  return (
    <header className="navbar">
      {/* Left */}

      <div className="navbar-left">
        <button className="menu-btn">
          <FaBars />
        </button>

        <FaGithub className="github-logo" />

        <h3>Dashboard</h3>
      </div>

      {/* Search */}
      <div className="navbar-search">
        <FaSearch />

        <input
          type="text"
          placeholder="Type / to search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search.trim() !== "" && (
          <div className="search-dropdown">
            {filteredRepositories.length > 0 ? (
              filteredRepositories.map((repo) => (
                <div
                  className="search-item"
                  key={repo._id}
                  onClick={() => {
                    navigate(`/repo/${repo._id}`);
                    setSearch("");
                  }}
                >
                  📁 {repo.name}
                </div>
              ))
            ) : (
              <div className="search-item">No repositories found</div>
            )}
          </div>
        )}
      </div>
      {/* Right */}

      <div className="navbar-right">
        <button>
          <FaBell />
        </button>

        <button>
          <FaPlus />
        </button>

        <button>
          <FaCodeBranch />
        </button>

        <button>
          <FaInbox />
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="profile-image"
        />
      </div>
    </header>
  );
};

export default Navbar;
