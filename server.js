const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database');
const cookieParser = require('cookie-parser');
app.set('view-engine', 'ejs');

require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

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

//Middleware 
function authorizeToken(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect('/identify')
  }

  try {
    const data = jwt.verify(token, process.env.TOKENKEY)
    res.redirect('/granted')
  } catch {
    return res.status(403).redirect('/identify')
  }
  console.log(req.cookies.jwt)
}

//Routes

app.get('/', authorizeToken, (req, res) => {
  res.redirect('/identify')
})


app.get('/identify',(req, res) => {
 res.render('identify.ejs')
})


app.post('/identify', async (req, res) => {

  //Fetch user from database
  let dbUser = await db.getUser(req.body.username)
  
  //Render the fail page and return if user is not found
  if (typeof dbUser === 'undefined') {
    res.status(400).render('fail.ejs', { message: `The username "${req.body.username}" was not found.` });
    return;
  }
  
  //Make sure both fields are filled in 
  if (req.body.password === '' || req.body.username === '' ) {
    res.status(400).render('fail.ejs', { message: "You need to enter username and password" });
    return;
  }
  
  //User found and both fields are filled in
  try {
    if (await bcrypt.compare(req.body.password, dbUser.password)) {
      //passwords match
      let userObj = { username: req.body.username };
      const token = jwt.sign(userObj, process.env.TOKENKEY)
      //send to user and render startpage
      return res.cookie("jwt", token, { httpOnly: true }).status(200).render('start.ejs');
    } else {
      //passwords does not match
      const message = `Incorrect password for user "${req.body.username}".`
      res.status(401).render('fail.ejs', { message });
    }
  } catch(error){
    console.log(error);
  }
})

app.get('/granted', (req, res) => {
  res.render('start.ejs')
})


app.get('/REGISTER', (req, res) => {
  res.render('register.ejs')
})

app.post('/REGISTER', async (req, res) => {
  //If username or password is blank, render fail and return
  if (req.body.password === '' || req.body.username === '') {
    res.status(400).render('fail.ejs', { message: "You need to enter username and password" });
    return;
  }
  
  //if username and passwords are filled in:
  try {
    let encryptedPassword = await bcrypt.hash(req.body.password, 10);
    await db.registerUser(req.body.username, req.body.name, req.body.role, encryptedPassword);
    res.status(200).redirect('/identify')
  } catch (error) {
    res.status(400).render('fail.ejs', { message: error })
    return;
  }
})


app.listen(process.env.PORT, () => {
  console.log("App is listening on " + process.env.PORT + "...")
})