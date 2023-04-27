const sqlite3 = require("sqlite3").verbose();
// connent with db

// open the database connection
const openConnection = () => {
  const db = new sqlite3.Database("mydatabase.db", (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Connected to the database.");
    }
  });
  return db
};


// create table credit_data
const createTable = (db) => {
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
};

// select data from db
const selectData = async (db, ssn) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM credit_data WHERE ssn = ?", ssn, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// insert data to db
const insertData = async (db, ssn, dataResponse, completeCallBack) => {
  db.run(
    "INSERT INTO credit_data (ssn, data) VALUES (?, ?)",
    [ssn, JSON.stringify(dataResponse)],
    completeCallBack
  );
};

module.exports = { openConnection, createTable, selectData, insertData };
