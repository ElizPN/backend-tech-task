async function creditDataController(
  databaseService,
  getCreditData,
  ssn,
  creditDataResponse
) {
  let result = {};
  // check if cached data exists in db
  const rows = await databaseService.selectData(ssn);

  if (rows.length > 0) {
    console.log("data is found");
    const data = JSON.parse(rows[0].data);
    creditDataResponse.send(data);
  } else {
    try {
      console.log("no data in db");
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
    } catch (error) {
      console.error(error)
      if (error.response.status === 404) {
        console.log("http error:", error);
        creditDataResponse.status(404).send("SSN not found");
        return;
      } else {
        creditDataResponse
          .status(error.response.status)
          .send(error.response.status);
      }
    }
    creditDataResponse.send(result);

    // cache data to db
    databaseService.insertData(ssn, result);
  }
}

module.exports = { creditDataController };
