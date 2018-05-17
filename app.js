var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var levelsRouter = require('./routes/levels');
var mosca = require('mosca');
var app = express();
var ascoltatore = {
  type: 'redis',
  redis: require('redis'),
  port: 15356,
  return_buffers: true, // to handle binary payloads
  host: "redis-15356.c11.us-east-1-2.ec2.cloud.redislabs.com",
  password: "kbDG1s4EyMaVbQ1Y7bCErLE2lQ0ciyvd"
};
var moscaSettings = {
  port: 1883,
  backend: ascoltatore,
  persistence: {
    factory: mosca.persistence.Redis,
    host:  "redis-15356.c11.us-east-1-2.ec2.cloud.redislabs.com",
    port: 15356,
    password: "kbDG1s4EyMaVbQ1Y7bCErLE2lQ0ciyvd"
  }
};
var server = new mosca.Server(moscaSettings);
server.on('ready', setup);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/levels', levelsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.on('clientConnected', function(client) {
	console.log('client connected', client.id);		
});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published', packet.topic, packet.payload);
});

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running')
}
module.exports = app;
