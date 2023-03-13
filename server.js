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
createDefaultUsers('id1','user1', 'STUDENT1', 'password');
createDefaultUsers('id2','user2', 'STUDENT2', 'password2');
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
    jwt.verify(token, process.env.TOKENKEY)
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).redirect('/identify')
  }
}

function authorizeRole(requiredRoles) {
  return async (req, res, next) => {
    try {
      const user = await getUserFromToken(req);
      
      if (requiredRoles.includes(user.role)) {
        next();
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      console.log(error)
    }
  }
}


//Routes
app.get('/', (req, res) => {
  res.redirect('/identify')
})


app.get('/identify', (req, res) => {
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
      let userObj = { username: req.body.username, role: dbUser.role };
      const token = jwt.sign(userObj, process.env.TOKENKEY)
      //send cookie to user and render startpage
      res.cookie("jwt", token, { httpOnly: true }).status(200).redirect(`/users/${dbUser.username}`);
    } else {
      //passwords does not match
      const message = `Incorrect password for user "${req.body.username}".`
      res.status(401).render('fail.ejs', { message });
    }
  } catch(error){
    console.log(error);
  }
})

app.get('/granted', authorizeToken, (req, res) => {
  res.render('start.ejs')
})

app.get('/student1', authorizeToken, authorizeRole(['STUDENT1', 'TEACHER', 'ADMIN']), async (req, res) => {
  const user = await getUserFromToken(req);
  res.render('student1.ejs', { user: user })
})
app.get('/student2', authorizeToken, authorizeRole(['STUDENT2', 'TEACHER', 'ADMIN']), async (req, res) => {
  const user = await getUserFromToken(req);
  res.render('student2.ejs', { user: user })
})

app.get('/teacher', authorizeToken, authorizeRole(['TEACHER', 'ADMIN']), async (req, res) => {
    students = await db.getAllStudents();
    res.render('teacher.ejs', students)
})

app.get('/admin', authorizeToken, authorizeRole(['ADMIN']), async (req, res) => {
  users = await db.getAllUsers();
  res.render('admin.ejs', users)
})


app.get('/REGISTER', (req, res) => {
  res.render('register.ejs')
})

app.get('/users/:userid', authorizeToken, async (req, res) => {
  const token = req.cookies.jwt;
  const decryptedToken = jwt.verify(token, process.env.TOKENKEY);
  //get the user from db based on username from the cookie
  const user = await db.getUser(decryptedToken.username);


  //if the name in url is not matching the name in your cookie...
  if (req.params.userid !== decryptedToken.username) {
    return res.sendStatus(401);
  }

  if (user.role === 'STUDENT1') {
    res.render('student1.ejs', {user : user})
  } else if (user.role === 'STUDENT2') {
    res.render('student2.ejs', {user : user})
  } else if (user.role === 'TEACHER') {
    students = await db.getAllStudents();
    res.render('teacher.ejs', students)
  } else if (user.role === 'ADMIN') {
    users = await db.getAllUsers();
    res.render('admin.ejs', users)
  }
  
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



async function getUserFromToken(req) {
  const token = req.cookies.jwt;
  const decryptedToken = jwt.verify(token, process.env.TOKENKEY);
  const user = await db.getUser(decryptedToken.username);
  return user;
}

app.listen(process.env.PORT, () => {
  console.log("App is listening on " + process.env.PORT + "...")
})