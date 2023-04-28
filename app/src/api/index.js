const express = require("express");
const axios = require("axios");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const { databaseService } = require("./services/databaseService");

databaseService.createTable();

router.get("/ping", (req, res) => {
  res.send({
    result: "pong",
  });
});

router.get("/credit-data/:ssn", (req, creditDataResponse) => {
  const ssn = req.params.ssn;
  let result = {};

  (async () => {
    try {
      const rows = await databaseService.selectData(ssn);
      if (rows.length > 0) {
        console.log("data is found");
        const data = JSON.parse(rows[0].data);
        creditDataResponse.send(data);
      } else {
        console.log(" no data in db");
        const personalDetailsresponse = await axios.get(
          `https://infra.devskills.app/api/credit-data/personal-details/${ssn}`
        );
        result = { ...personalDetailsresponse.data };

        const assessedIncomeResponse = await axios.get(
          `https://infra.devskills.app/api/credit-data/assessed-income/${ssn}`
        );
        result = { ...result, ...assessedIncomeResponse.data };

        const debtResponse = await axios.get(
          `https://infra.devskills.app/api/credit-data/debt/${ssn}`
        );
        result = { ...result, ...debtResponse.data };

        const completeCallBack = (err) => {
          if (err) {
            console.error(err.message);
            creditDataResponse
              .status(500)
              .send("Error saving data to database");
          } else {
            console.log();
            creditDataResponse.send(result);
          }
        };
        databaseService.insertData(ssn, result, completeCallBack);
      }
    } catch (error) {
      console.log("error:", error);

      if (error.response.status === 404) {
        creditDataResponse.status(404).send("SSN not found");
      } else {
        creditDataResponse
          .status(error.response.status)
          .send(error.response.status);
      }
    }
  })();
});

module.exports = router;
