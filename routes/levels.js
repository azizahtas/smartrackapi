var express = require('express');
var router = express.Router();
var { Pool, Client } = require('pg');
var _ = require('lodash');
/* GET users listing. */
router
.post('/:_num', function(req, res, next) {
      var data = req.body;
      var racknum = req.params['_num'];
      var start = data.startDate;
      var end = data.endDate;

      var querry = "SELECT rack_num,shelf_num,percent_full*100 AS percent,date_recorded,url FROM shelf_levels " + 
              "WHERE date_recorded > '"+start+"' AND  date_recorded < '"+end+"' " + 
              "AND rack_num = '"+racknum+"' " + 
              "ORDER BY shelf_levels.date_recorded ASC";

      var client = new Client({
          user: 'azizahtas',
          host: 'smart-rack.c7neg6roarnk.us-east-1.rds.amazonaws.com',
          database: 'smartrack',
          password: 'azizahtas',
          port: 5432,
      });
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
