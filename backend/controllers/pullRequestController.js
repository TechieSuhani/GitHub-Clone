const PullRequest = require("../models/pullRequestModel");
const Repository = require("../models/repoModel");

// ================= CREATE =================

async function createPullRequest(req, res) {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found!",
      });
    }

    const pullRequest = new PullRequest({
      title,
      description,
      repository: id,
    });

    await pullRequest.save();

    res.status(201).json({
      message: "Pull Request created successfully!",
      pullRequest,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

// ================= GET ALL =================

async function getAllPullRequests(req, res) {
  const { id } = req.params;

  try {
    const pullRequests = await PullRequest.find({
      repository: id,
    });

    res.json(pullRequests);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

// ================= UPDATE =================

async function updatePullRequest(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const pullRequest = await PullRequest.findById(id);

    if (!pullRequest) {
      return res.status(404).json({
        error: "Pull Request not found!",
      });
    }

    pullRequest.title = title;
    pullRequest.description = description;
    pullRequest.status = status;

    await pullRequest.save();

    res.json({
      message: "Pull Request updated!",
      pullRequest,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

// ================= DELETE =================

async function deletePullRequest(req, res) {
  const { id } = req.params;

  try {
    await PullRequest.findByIdAndDelete(id);

    res.json({
      message: "Pull Request deleted!",
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

module.exports = {
  createPullRequest,
  getAllPullRequests,
  updatePullRequest,
  deletePullRequest,
};