const { databaseService } = require("../services/databaseService");
const { getCreditData } = require("../services/getCreditData");

async function creditDataController(ssn, creditDataResponse) {
  let result = {};

  try {
    const rows = await databaseService.selectData(ssn);

    if (rows.length > 0) {
      console.log("data is found");
      const data = JSON.parse(rows[0].data);
      creditDataResponse.send(data);
    } else {
      console.log(" no data in db");
      const personalDetailsresponse = await getCreditData(
        "personal-details",
        ssn
      );
      result = { ...personalDetailsresponse.data };

      const assessedIncomeResponse = await getCreditData(
        "assessed-income",
        ssn
      );
      result = { ...result, ...assessedIncomeResponse.data };

      const debtResponse = await getCreditData("debt", ssn);
      result = { ...result, ...debtResponse.data };

      const completeCallBack = (err) => {
        if (err) {
          console.error(err.message);
          creditDataResponse.status(500).send("Error saving data to database");
        } else {
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
}

module.exports = { creditDataController };
