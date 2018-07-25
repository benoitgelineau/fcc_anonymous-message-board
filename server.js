'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var cors        = require('cors');
var logger      = require('morgan');
const helmet    = require('helmet');
const initDb    = require('./db').initDb;

// Enable .env variables to be used
require('dotenv').config();

var apiRoutes         = require('./routes/api');
var fccTestingRoutes  = require('./routes/fcctesting');
var runner            = require('./test-runner');

var app = express();

// Security middlewares
app.use(helmet({
  frameguard: {
    action: 'sameorigin'
  },
  contentSecurityPolicy: {
   directives: {
     defaultSrc: ["'none'"],
      connectSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: [
        "'self'",
        'https://hyperdev.com/favicon-app.ico',
        'http://glitch.com/favicon-app.ico',
        'https://cdn.gomix.com/8f5547a1-a0d6-48f6-aa38-51753a0105f4%2FScreen%20Shot%202017-01-02%20at%201.04.10%20AM.png'
      ],
      scriptSrc: [
        "'self'",
        'https://code.jquery.com/jquery-2.2.1.min.js',
        "'unsafe-inline'"
      ]
   }
  },
 dnsPrefetchControl: false
}))

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logger
app.use(logger('dev'));

//Sample front-end
app.route('/b/:board/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/board.html');
  });
app.route('/b/:board/:threadid')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/thread.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
app.use('/api', apiRoutes);

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404)
  .type('text')
  .send('Not Found');
});

// Database connection
initDb();

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for testing