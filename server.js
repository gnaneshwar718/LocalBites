import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(dotenv.config());
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { ROUTES, API_ENDPOINTS } from './route.js';
import {
  STATUS_CODES,
  MESSAGES,
  SERVER_DEFAULTS,
} from './src/js/constants/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT;

const PATHS = {
  PUBLIC: path.join(__dirname, 'public'),
  PAGES: path.join(__dirname, 'public', 'pages'),
  CSS: path.join(__dirname, 'src', 'css'),
  JS: path.join(__dirname, 'src', 'js'),
  CONSTANTS: path.join(__dirname, 'src', 'constants'),
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(PATHS.PUBLIC));
app.use('/css', express.static(PATHS.CSS));
app.use('/js', express.static(PATHS.JS));
app.use('/constants', express.static(PATHS.CONSTANTS));
app.get('/route.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'route.js'));
});

const sendPage = (res, fileName) => {
  res.sendFile(path.join(PATHS.PAGES, fileName));
};

app.get(ROUTES.HOME, (req, res) => sendPage(res, 'index.html'));
app.get(ROUTES.AUTH, (req, res) => sendPage(res, 'auth.html'));
app.get(ROUTES.EXPLORE, (req, res) => sendPage(res, 'explore.html'));
app.get(ROUTES.CULTURE, (req, res) => sendPage(res, 'culture.html'));
app.get(ROUTES.ABOUT, (req, res) => sendPage(res, 'about.html'));
app.get(API_ENDPOINTS.CONFIG, (req, res) => {
  res.json({
    contactEmail: process.env.CONTACT_EMAIL,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  });
});

import { createUser, findUserByEmail } from './src/js/db.js';

app.post(ROUTES.SIGNUP, async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: MESSAGES.FIELDS_REQUIRED });

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: MESSAGES.USER_EXISTS });
    }

    await createUser(name, email, password);
    res.status(STATUS_CODES.CREATED).json({ message: MESSAGES.USER_CREATED });
  } catch (err) {
    console.error(err);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
});

app.post(ROUTES.SIGNIN, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user || user.password !== password)
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: MESSAGES.INVALID_CREDENTIALS });

    res.status(STATUS_CODES.OK).json({
      message: MESSAGES.SIGNIN_SUCCESS,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

setInterval(() => {}, SERVER_DEFAULTS.KEEP_ALIVE_INTERVAL);
