require('dotenv').config();

const express = require('express');
const session = require('express-session');
const app = express();

const expressWs = require('express-ws')(app);
const rateLimit = require('express-rate-limit');
const minifyHTML = require('express-minify-html-2');

const fs = require('fs');
const passport = require('passport');
const ejs = require('ejs');
const path = require('path');
const requestIp = require('request-ip');
const cache = new Map();

const db = require('./handlers/db');

// Add admin users
if (!process.env.ADMIN_USERS) {
  console.warn('No admin users defined. Skipping admin user creation.');
} else {
  let admins = process.env.ADMIN_USERS.split(',');
  for (let i = 0; i < admins.length; i++) {
    db.set(`admin-${admins[i]}`, true);
  }
}

// Setup ejs as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/resources'));
app.set('trust proxy', 1);

// Setup rateLimit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: function (req, res) {
    res.status(429).json({
      error: 'Too many requests, please try again later.'
    });
  }
}));

// Parsing query data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// IP middleware
app.use(requestIp.mw());

// Optimization
app.set('view cache', true);
app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true, 
        minifyCSS: true 
    }
}));

// Custom Header
app.use((req, res, next) => {
  res.setHeader("Falcon v1.4.0");
  next();
});

// Require the routes
let allRoutes = fs.readdirSync('./app');
for (let i = 0; i < allRoutes.length; i++) {
  let route = require(`./app/${allRoutes[i]}`);
  expressWs.applyTo(route);
  app.use('/', route);
}

// Serve static files (after VPN detection)
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d' // Cache static assets for 1 day
}));

// Start the server
app.listen(process.env.APP_PORT || 3000, () => console.log(`Falcon has been started on https://localhost${process.env.APP_PORT} !`));
