const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database')
app.set('view-engine', 'ejs');

require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.initDb();

//Create default users
createDefaultUsers('id1','user1', 'STUDENT', 'password');
createDefaultUsers('id2','user2', 'STUDENT', 'password2');
createDefaultUsers('id3', 'user3', 'TEACHER', 'password3');
createDefaultUsers('admin', 'admin', 'ADMIN', 'admin');


async function createDefaultUsers(username, name, role, password) {
    let encryptedPassword = await bcrypt.hash(password, 10);
    await db.registerUser(username, name, role, encryptedPassword);
}


//db.registerUser('user2', await bcrypt.hash('password2', 10));
//db.registerUser('user3', await bcrypt.hash('password3', 10));
//db.registerUser('admin', await(bcrypt.hash('admin'), 10));

app.get('/', (req, res) => {
  res.redirect('/identify')
})

app.get('/identify', (req, res) => {
  res.render('identify.ejs')
})

app.listen(process.env.PORT, () => {
  console.log("App is listening on " + process.env.PORT + "...")
})