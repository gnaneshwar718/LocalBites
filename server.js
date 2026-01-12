'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const PATHS = {
  PUBLIC: path.join(__dirname, 'public'),
  PAGES: path.join(__dirname, 'public', 'pages'),
  CSS: path.join(__dirname, 'src', 'css'),
  JS: path.join(__dirname, 'src', 'js'),
  DATA: path.join(__dirname, 'src', 'data'),
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(PATHS.PUBLIC));
app.use('/css', express.static(PATHS.CSS));
app.use('/js', express.static(PATHS.JS));
app.use('/data', express.static(PATHS.DATA));

const users = [];

const sendPage = (res, fileName) => {
  res.sendFile(path.join(PATHS.PAGES, fileName));
};

const findUserByEmail = (email) => users.find((user) => user.email === email);

const isValidSignup = ({ name, email, password }) =>
  Boolean(name && email && password);

(async () => {
  try {
    const { ROUTES } = await import('./src/js/routes.js');

    app.get(ROUTES.HOME, (req, res) => {
      sendPage(res, 'index.html');
    });

    app.get(ROUTES.AUTH, (req, res) => {
      sendPage(res, 'auth.html');
    });

    app.get(ROUTES.EXPLORE, (req, res) => {
      sendPage(res, 'explore.html');
    });

    app.post(ROUTES.SIGNUP, (req, res) => {
      const { name, email, password } = req.body;

      if (!isValidSignup(req.body)) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (findUserByEmail(email)) {
        return res.status(400).json({ message: 'User already exists' });
      }

      users.push({ name, email, password });

      res.status(201).json({ message: 'User created successfully' });
    });

    app.post(ROUTES.SIGNIN, (req, res) => {
      const { email, password } = req.body;

      const user = findUserByEmail(email);

      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      res.status(200).json({
        message: 'Sign in successful',
        user: {
          name: user.name,
          email: user.email,
        },
      });
    });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
