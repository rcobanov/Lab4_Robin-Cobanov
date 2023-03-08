const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database')
app.set('view-engine', 'ejs');

require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("App is listening on " + process.env.PORT + "...")
})