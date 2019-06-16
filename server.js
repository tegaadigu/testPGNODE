require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const signup = require('./app/controllers/signup');
const login = require('./app/controllers/login');
const users = require('./app/controllers/user');

const PORT = process.env.DEFAULT_HTTP_PORT;

app.use(bodyParser.json());

app.use('/', [login, signup, users]);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

function stop() {
  app.close();
}

module.exports = app;
module.exports.stop = stop;
