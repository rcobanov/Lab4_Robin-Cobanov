const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./users.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Database created.')
});

function initDb() {
  db.serialize(function () {
    db.run("DROP TABLE IF EXISTS users;");
    db.run("CREATE TABLE IF NOT EXISTS users(username TEXT NOT NULL PRIMARY KEY, name TEXT, role TEXT CHECK(role in('STUDENT1', 'STUDENT2', 'TEACHER','ADMIN')), password TEXT NOT NULL);");
  })
}

async function registerUser(username, name, role, password) {
  let checkUserExist = await getUser(username);
  if (checkUserExist) {
    return new Promise((resolve, reject) => {
      reject(`User with username: "${username}" already exists.`)
    })
  }

  return new Promise((resolve, reject) => {
    db.run('INSERT INTO users(username, name, role, password) VALUES (?, ?, ?, ?);', [username, name, role, password], (err, res) =>{
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  })
}

function getUser(username) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users where username = ?",[username], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
function getAllStudents() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users where role like 'STUDENT%'", (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}



module.exports = {
  initDb: initDb,
  registerUser: registerUser,
  getUser: getUser,
  getAllUsers: getAllUsers,
  getAllStudents: getAllStudents,
}
