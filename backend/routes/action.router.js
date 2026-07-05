const express = require("express");
const actionController = require("../controllers/actionController");

const actionRouter = express.Router();

actionRouter.post(
  "/actions/run/:repoId",
  actionController.runWorkflow
);

actionRouter.get(
  "/actions/all/:repoId",
  actionController.getAllWorkflows
);

actionRouter.put(
  "/actions/update/:id",
  actionController.updateWorkflow
);

actionRouter.delete(
  "/actions/delete/:id",
  actionController.deleteWorkflow
);

module.exports = actionRouter;