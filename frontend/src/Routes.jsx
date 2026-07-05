import React, { useEffect } from "react";
import { useNavigate, useRoutes, Navigate } from "react-router-dom";

// Pages List
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepository from "./components/repo/CreateRepository";
import Repository from "./components/repo/Repository";
import RepositoryIssues from "./components/issue/RepositoryIssues";
import RepositorySettings from "./components/settings/RepositorySettings";
import PullRequests from "./components/pullrequests/PullRequests";
import Insights from "./components/insights/Insights";
import Actions from "./components/actions/Actions";

// Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }
  }, [currentUser, navigate, setCurrentUser]);

  let element = useRoutes([
    {
      path: "/",
      element: currentUser ? <Dashboard /> : <Navigate to="/auth" replace />,
    },
    {
      path: "/auth",
      element: currentUser ? <Navigate to="/" replace /> : <Login />,
    },
    {
      path: "/signup",
      element: currentUser ? <Navigate to="/" replace /> : <Signup />,
    },
    {
      path: "/profile",
      element: currentUser ? <Profile /> : <Navigate to="/auth" replace />,
    },
    {
      path: "/create",
      element: currentUser ? (
        <CreateRepository />
      ) : (
        <Navigate to="/auth" replace />
      ),
    },
    {
      path: "/repo/:id",
      element: currentUser ? <Repository /> : <Navigate to="/auth" replace />,
    },
    {
  path: "/repo/:id/issues",
  element: currentUser ? (
    <RepositoryIssues />
  ) : (
    <Navigate to="/auth" replace />
  ),
},
{
  path: "/repo/:id/settings",
  element: currentUser
    ? <RepositorySettings />
    : <Navigate to="/auth" replace />,
},
{
  path: "/repo/:id/pulls",
  element: currentUser ? (
    <PullRequests />
  ) : (
    <Navigate to="/auth" replace />
  ),
},
{
  path: "/repo/:id/insights",
  element: currentUser ? (
    <Insights />
  ) : (
    <Navigate to="/auth" replace />
  ),
},
{
  path: "/repo/:id/actions",
  element: currentUser ? (
    <Actions />
  ) : (
    <Navigate to="/auth" replace />
  ),
},


  ]);
  

  return element;
};

export default ProjectRoutes;
