const express = require("express");
const axios = require("axios");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose(); 

const db = new sqlite3.Database("mydatabase.db");

db.run(`
  CREATE TABLE IF NOT EXISTS credit_data (
    ssn TEXT PRIMARY KEY,
    data TEXT
  )
`);


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
      // res.send(result);

       db.run(
         "INSERT INTO credit_data (ssn, data) VALUES (?, ?)",
         [ssn, JSON.stringify(result)],
         (err) => {
           if (err) {
             console.error(err.message);
             res.status(500).send("Error saving data to database");
           } else {
             res.send(result);
           }
         }
       );



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
