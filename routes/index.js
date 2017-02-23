var express = require('express');
var router = express.Router();
var lol = require('leagueapi');
var twitter = require('twit');
 

// var lolClient = lol.client({
    // apiKey: 'RGAPI-ed53eab6-4dd0-4b4f-9d82-41c356030dd8'
    // cache: lol.redisCache({host: '127.0.0.1', port: 6379})
// });
// lolClient.getChampionById('na', 53, {champData: ['all']}, function(err, data) {
//     console.log("Found ", data.name);
//     lolClient.destroy();
// });


/* GET home page. */
router.get('/', (req, res, next) => {

  var t = new twitter({
    consumer_key: 'kjAkJECqGqGgbp8rTjKb3g7t8',
    consumer_secret: 'zgCuZYJXaH4ACLRzJK3gsZFw5S9IrrXEVkQr72sWY09IDSgz8Z',
    app_only_auth: true
  });

// https://api.twitter.com/1.1/users/show.json?screen_name=twitterdev

  var name = 'bobjenkins';
  var region = 'na';
  lol.init('RGAPI-ed53eab6-4dd0-4b4f-9d82-41c356030dd8', 'na')
  lol.Summoner.getByName(name, region, (err,data) => {
    var id = data[name].id;
    lol.getCurrentGame(id, region, (err1, data1) => {
      // console.log(data1);
      data1.participants.map((x) => {
        // console.log(x.summonerName)
        t.get('users/show', {screen_name: x.summonerName}, (err, data, response) => {
          console.log(x.summonerName + ": "+ data.name);  // 
        });
      })
    });
  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
