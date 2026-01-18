import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { ROUTES, API_ENDPOINTS } from './route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const PATHS = {
  PUBLIC: path.join(__dirname, 'public'),
  PAGES: path.join(__dirname, 'public', 'pages'),
  CSS: path.join(__dirname, 'src', 'css'),
  JS: path.join(__dirname, 'src', 'js'),
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/about', (req, res) => sendPage(res, 'about.html'));

app.use(express.static(PATHS.PUBLIC));
app.use('/css', express.static(PATHS.CSS));
app.use('/js', express.static(PATHS.JS));

app.get('/route.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'route.js'));
});

const sendPage = (res, fileName) => {
  res.sendFile(path.join(PATHS.PAGES, fileName));
};

app.get(ROUTES.HOME, (req, res) => sendPage(res, 'index.html'));
app.get(ROUTES.AUTH, (req, res) => sendPage(res, 'auth.html'));
app.get(ROUTES.EXPLORE, (req, res) => sendPage(res, 'explore.html'));
// Remove redundant /about and use constants if preferred, but keeping the one above for priority if needed.
// Actually, let's keep it consistent.

app.get(API_ENDPOINTS.CONFIG, (req, res) => {
  res.json({
    contactEmail: process.env.CONTACT_EMAIL,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  });
});

const users = [];

app.post(ROUTES.SIGNUP, (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });
  if (users.find((u) => u.email === email))
    return res.status(400).json({ message: 'User already exists' });
  users.push({ name, email, password });
  res.status(201).json({ message: 'User created successfully' });
});

app.post(ROUTES.SIGNIN, (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user || user.password !== password)
    return res.status(401).json({ message: 'Invalid credentials' });
  res
    .status(200)
    .json({
      message: 'Sign in successful',
      user: { name: user.name, email: user.email },
    });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

setInterval(() => {
  // Keep alive
}, 1000000);
