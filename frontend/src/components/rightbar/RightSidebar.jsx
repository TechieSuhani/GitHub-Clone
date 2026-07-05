import React from "react";
import "./rightSidebar.css";

const RightSidebar = () => {
  return (
    <div className="right-sidebar">
      <div className="copilot-card">
        <h3>GitHub Copilot</h3>
        <p>Write code faster with AI assistance.</p>

        <button>Download App</button>
      </div>

      <div className="news-card">
        <h3>Latest News</h3>

        <div className="news-item">
          <p>Improved Copilot suggestions</p>
          <span>Yesterday</span>
        </div>

        <div className="news-item">
          <p>New Repository Insights</p>
          <span>2 days ago</span>
        </div>

        <div className="news-item">
          <p>GitHub Mobile Update</p>
          <span>3 days ago</span>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;