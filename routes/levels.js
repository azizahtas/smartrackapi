var express = require('express');
var router = express.Router();
var { Pool, Client } = require('pg');
var _ = require('lodash');
var settings = require('../settings');
/* GET users listing. */
router
.post('/:_num', function(req, res, next) {
      var data = req.body;
      var racknum = req.params['_num'];
      var start = data.startDate;
      var end = data.endDate;

      var querry = "SELECT racknum,shelf_num,percent_full*100 AS percent,date_recorded,url FROM shelf_stock " + 
              "WHERE date_recorded > '"+start+"' AND  date_recorded < '"+end+"' " + 
              "AND racknum = '"+racknum+"' " + 
              "ORDER BY shelf_stock.date_recorded ASC";
      console.log(querry);
      var client = new Client(settings.database.postgres);
        client.connect();
        
        client.query(querry, function (err, dbres){
          console.log(err, dbres);
          if(dbres) {
            var output = _.groupBy(dbres.rows, function(b) { return b.shelf_num;});
            res.json({err:null,data:output});
          } else {
            res.json({err:dbres,data:[]});
          }

          client.end();
        });
})
;



module.exports = router;
