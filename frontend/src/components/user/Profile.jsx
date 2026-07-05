import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

import { FaBook, FaFolder } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    username: "username",
  });

  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axios.get(
            `http://16.171.0.172:3000/userProfile/${userId}`
          );

          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details:", err);
        }
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <>
      <Navbar />

      <div className="profile-tabs">
        <div className="profile-tab active">
          <FaBook />
          <span>Overview</span>
        </div>

        <div
          className="profile-tab"
          onClick={() => navigate("/repo")}
          style={{ cursor: "pointer" }}
        >
          <FaFolder />
          <span>Starred Repositories</span>
        </div>
      </div>

      <button
        id="logout"
        style={{
          position: "fixed",
          bottom: "50px",
          right: "50px",
        }}
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setCurrentUser(null);
          window.location.href = "/auth";
        }}
      >
        Logout
      </button>

      <div className="profile-page-wrapper">
        <div className="user-profile-section">
          <div className="profile-avatar"></div>

          <div className="name">
            <h3>{userDetails.username}</h3>
          </div>

          <button className="follow-btn">Follow</button>

          <div className="follower">
            <p>10 Followers</p>
            <p>3 Following</p>
          </div>
        </div>

        <div className="heat-map-section">
          <HeatMapProfile />
        </div>
      </div>
    </>
  );
};

export default Profile;