const express = require("express");
const router = express.Router();
const { creditDataController } = require("./controllers/creditDataController");
const { databaseService } = require("./services/databaseService");

databaseService.createTable();

router.get("/ping", (req, res) => {
  res.send({
    result: "pong",
  });
});

router.get("/credit-data/:ssn", (req, res) => {
  const ssn = req.params.ssn;

  creditDataController(ssn, res);
});

module.exports = router;
