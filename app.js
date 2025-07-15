const path = require('path');
const express = require('express');
const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
// const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./src/utils/appError');
const indexRouter = require('./src/routes/indexRoutes');

// Start Express App
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// USING CORS
app.use(
  cors(
    {
      origin: 'http://localhost:5000', // Shell frontend URL
      credentials: true, // REQUIRED to allow cookies
    },
    {
      origin: 'http://localhost:5008', // Settings frontend URL
      credentials: true, // REQUIRED to allow cookies
    }
  )
);

// SET SECURITY HTTP HEADERS
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: false,
    originAgentCluster: false,
  })
);

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Node Version:', process.version);

app.use(express.json()); //{ limit: '10kb' }
app.use(express.urlencoded({ extended: true })); // limit: '10kb'
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());
app.use(compression());

// Test Middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const attachUserToLocals = (req, res, next) => {
  if (req.user) res.locals.user = req.user;
  next();
};

// Apply the middleware to all routes
app.use(attachUserToLocals);

// 3) ROUTE
app.use('/api/v1/users', indexRouter);

// eslint-disable-next-line arrow-body-style
app.get('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

module.exports = app;
