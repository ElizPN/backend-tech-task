const axios = require("axios");

getCreditDataService = (creditData, ssn) => {
  return axios.get(`https://infra.devskills.app/api/credit-data/${creditData}/${ssn}`);
};

module.exports = getCreditDataService;
