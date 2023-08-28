const sqlite3 = require("sqlite3").verbose();
let sql;

// connect to db
const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
});

// create table
// sql = `CREATE TABLE users(id INTEGER PRIMARY KEY, first_name, last_nane, username, password, email)`;
// db.run(sql);

// insert
// sql = `INSERT INTO users(first_name, last_nane, username, password, email) VALUES (?,?,?,?,?)`;
// db.run(sql, ["john", "doe", "john_user", "testing", "john@mail.co"], (err) => {
//   if (err) return console.error(err);
// });

// query
sql = `SELECT * FROM users`;
db.all(sql, [], (err, rows) => {
  if (err) {
    return console.error(err.message);
  }
  rows.forEach((row) => {
    console.log(row);
  });
});

// update
// sql = `UPDATE users SET first_name = ? WHERE id = ?`;
// db.run(sql, ["Jake", 1], (err) => {
//   if (err) return console.error(err.message);
// });

// delete
// sql = `DELETE FROM users WHERE id = ?`;
// db.run(sql, [1], (err) => {
//   if (err) return console.error(err.message);
// });
