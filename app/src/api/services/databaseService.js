const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("mydatabase.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the database.");
  }
});

const databaseService = {
  createTable: () => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS credit_data (
        ssn TEXT PRIMARY KEY,
        data TEXT
      )
    `,
      (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log("Credit data table created.");
        }
      }
    );
  },

  selectData: async (ssn) => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM credit_data WHERE ssn = ?", ssn, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  insertData: async (ssn, dataResponse, completeCallBack) => {
    db.run(
      "INSERT INTO credit_data (ssn, data) VALUES (?, ?)",
      [ssn, JSON.stringify(dataResponse)],
      completeCallBack
    );
  },
};

module.exports = { databaseService };
