var { Pool, Client } = require('pg');
var _ = require('lodash');
var target = {};
var today = new Date();
var settings = require('../settings');

target.addData = function(data, callback) {
    var todaysDate = getDateTime();
    var racknum = data.racknum;
    var time = Math.round((data.time) / 1000);
    var querry = "INSERT INTO target (racknum, date_recorded, time_recorded)" 
                + " VALUES('"+racknum+"','"+todaysDate+"',"+time+")" ;
    var client = new Client(settings.database.postgres);
       client.connect();
       client.query(querry, function (err, dbres){
          console.log(err, dbres);
          if(dbres) {
              callback(null, {data: dbres, querry: querry})
          } else {
              callback(err, {data: querry})
          }

          client.end();
        });
}

target.addFootData = function(rackid, callback) {
    var todaysDate = getDateTime();
    var racknum = rackid;
    var querry = "INSERT INTO foot (racknum, date_recorded)" 
                + " VALUES('"+racknum+"','"+todaysDate+"')" ;
    var client = new Client(settings.database.postgres);
       client.connect();
       client.query(querry, function (err, dbres){
          console.log(err, dbres);
          if(dbres) {
              callback(null, {data: dbres, querry: querry})
          } else {
              callback(err, {data: querry})
          }

          client.end();
        });
}

function getDateTime() {
    var hour = today.getHours();
    hour = (hour < 10 ? "0" : '') + hour;

    var min = today.getMinutes();
    min = (min < 10 ? "0" : '') + min;

    var sec = today.getSeconds();
    sec = (sec < 10 ? "0" : '') + sec;

    var year = today.getFullYear();

    var month = today.getMonth()+1;
    month = (month < 10 ? "0" : '') + month;

    var day = today.getDate();
    day = (day < 10 ? "0" : '') + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec
}
module.exports = target;