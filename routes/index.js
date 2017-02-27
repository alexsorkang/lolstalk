var express = require('express');
var router = express.Router();
var lol = require('leagueapi');
var twitter = require('twit');

router.get('/', (req,res,next) => {
  res.render('index')
})

router.post('/', (req,res,next) => { 
  var t = new twitter({
    consumer_key: 'kjAkJECqGqGgbp8rTjKb3g7t8',
    consumer_secret: 'zgCuZYJXaH4ACLRzJK3gsZFw5S9IrrXEVkQr72sWY09IDSgz8Z',
    app_only_auth: true
  });

  var ogname = req.body.sum_name;
  var name = ogname.replace(/\s+/g, '').toLowerCase();
  var region = req.body.region;
  var results = {};
  lol.init('RGAPI-ed53eab6-4dd0-4b4f-9d82-41c356030dd8', region)
  lol.Summoner.getByName(name, region, (err,data) => {
    if (err) {
      t.get('users/show', {screen_name: ogname}, (err, data, response) => {
        console.log(data)
        results[ogname] = data.name;
        res.render('results', { title: 'Express', data: results});
      });
    } else {
      var id = data[name].id;
      lol.getCurrentGame(id, region, (err1, data1) => {
        if (!err1) {
        var counter = 0
        data1.participants.map((x) => {
          t.get('users/show', {screen_name: x.summonerName}, (err, data, response) => {
            results[x.summonerName] = data.name;
            counter+=1;
            if (counter == 10) {
              res.render('results', { title: 'Express', data: results});
            }
          });
        })
        } else {
          t.get('users/show', {screen_name: ogname}, (err, data, response) => {
            results[ogname] = data.name;
            res.render('results', { title: 'Express', data: results});
          });
        }
      });
    }
  });
})
module.exports = router;
