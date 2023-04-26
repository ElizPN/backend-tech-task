const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/ping", (req, res) => {
  res.send({
    result: "pong",
  });
});

router.get("/credit-data/:ssn", (req, res) => {
  const ssn = req.params.ssn;
  let result = {};

  (async () => {
    try {
      const response = await axios.get(
        `https://infra.devskills.app/api/credit-data/personal-details/${ssn}`
      );
      result = { ...response.data };

      const response2 = await axios.get(
        `https://infra.devskills.app/api/credit-data/assessed-income/${ssn}`
      );
      result = { ...result, ...response2.data };

      const response3 = await axios.get(
        `https://infra.devskills.app/api/credit-data/debt/${ssn}`
      );
      result = { ...result, ...response3.data };

      res.send(result);
    } catch (error) {
      if (error.response.status === 404) {
        res.status(404).send("SSN not found");
      } else {
        res.status(error.response.status).send(error.response.status);
      }
    }
  })();
});

module.exports = router;
