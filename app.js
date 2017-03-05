'use strict';

require('dotenv').load({ silent: true });
require('./model');

const logger = require('./lib/logging.js');

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const passport = require('passport');
const strategy = require('./lib/auth0-strategy');

passport.use(strategy);

const app = express();
app.use(cookieParser());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(favicon(__dirname + '/public/images/_.png'));
app.use(helmet());

app.use(session({
	store: new RedisStore({ url: process.env.REDIS_URL }),
	secret: process.env.REDIS_SESSION_SECRET,
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(require('./lib/middleware.js'));

app.use('/', require('./routes'));
app.use('/auth', require('./routes/auth'));

app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
	logger.log('info', 'Node app is running at localhost:' + app.get('port'));
});