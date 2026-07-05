const express = require("express");
const pullRequestController = require("../controllers/pullRequestController");

const pullRequestRouter = express.Router();

// Create Pull Request
pullRequestRouter.post(
  "/pullrequest/create/:id",
  pullRequestController.createPullRequest
);

// Get All Pull Requests
pullRequestRouter.get(
  "/pullrequest/all/:id",
  pullRequestController.getAllPullRequests
);

// Update Pull Request
pullRequestRouter.put(
  "/pullrequest/update/:id",
  pullRequestController.updatePullRequest
);

// Delete Pull Request
pullRequestRouter.delete(
  "/pullrequest/delete/:id",
  pullRequestController.deletePullRequest
);

module.exports = pullRequestRouter;