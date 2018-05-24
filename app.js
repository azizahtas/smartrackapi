var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var _ = require('lodash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var levelsRouter = require('./routes/levels');
var targetRouter = require('./routes/targetController');
var targetModel = require('./models/target');

var mosca = require('mosca');
var settings = require('./settings');
var racks = require('./racks');
var app = express();

var server = new mosca.Server(settings.database.redis);
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
app.use('/api/target', targetRouter);
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
      _.forEach(racks,function(rack) {
      var topic = 'headcount/target/'+rack.racknum;
      var footcount = 'footcount/target/'+rack.racknum;
          if(packet.topic == topic) {
           var data = {
              racknum : rack.racknum,
              time : JSON.parse(packet.payload.toString()).time
            }
            targetModel.addData(data, function(err, msg){
              if(err) console.log(err);
              else {
                console.log(msg);
              }
            })
            return false;
          } else if (packet.topic == footcount) {
            targetModel.addFootData(rack.racknum, function(err, msg){
              if(err) console.log(err);
              else {
                console.log(msg);
              }
            })
            return false;
          }
      })
});

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running.');
}
module.exports = app;
