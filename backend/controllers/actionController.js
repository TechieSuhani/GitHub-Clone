const Action = require("../models/actionModel");

// ================= RUN WORKFLOW =================

// ================= RUN WORKFLOW =================

async function runWorkflow(req, res) {
  const { repoId } = req.params;

  try {

    let action = await Action.findOne({
      repository: repoId,
    });

    if (!action) {
      action = new Action({
        repository: repoId,
        workflow: "CI/CD Pipeline",
      });
    }

    action.status = "Queued";
    action.progress = 0;
    action.duration = "--";
    action.logs = [
      "Workflow queued...",
    ];

    await action.save();

    setTimeout(async () => {
  action.status = "Running";
  action.progress = 25;
  action.logs.push("Installing dependencies...");
  await action.save();
}, 2000);

setTimeout(async () => {
  action.progress = 50;
  action.logs.push("Running tests...");
  await action.save();
}, 4000);

setTimeout(async () => {
  action.progress = 75;
  action.logs.push("Building project...");
  await action.save();
}, 6000);

setTimeout(async () => {
  action.status = "Success";
  action.progress = 100;
  action.duration = "10 sec";
  action.logs.push("Deployment successful!");
  await action.save();
}, 10000);

    res.status(200).json({
      message: "Workflow started successfully!",
      action,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
}

// ================= GET ALL WORKFLOWS =================
async function getAllWorkflows(req, res) {
  const { repoId } = req.params;

  try {
    const actions = await Action.find({
      repository: repoId,
    })
      .sort({ createdAt: -1 })
      .limit(1);

    res.json(actions);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
}

// ================= UPDATE WORKFLOW =================

async function updateWorkflow(req, res) {
  const { id } = req.params;

  try {
    const action = await Action.findById(id);

    if (!action) {
      return res.status(404).json({
        error: "Workflow not found",
      });
    }

    action.status = req.body.status ?? action.status;
    action.progress = req.body.progress ?? action.progress;
    action.duration = req.body.duration ?? action.duration;

    if (req.body.logs) {
      action.logs = req.body.logs;
    }

    await action.save();

    res.json({
      message: "Workflow updated successfully!",
      action,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
}

// ================= DELETE WORKFLOW =================

async function deleteWorkflow(req, res) {
  const { id } = req.params;

  try {
    await Action.findByIdAndDelete(id);

    res.json({
      message: "Workflow deleted successfully!",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
}

module.exports = {
  runWorkflow,
  getAllWorkflows,
  updateWorkflow,
  deleteWorkflow,
};