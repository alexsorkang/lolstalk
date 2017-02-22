var express = require('express');
var router = express.Router();
var lol = require('leagueapi');

// var lolClient = lol.client({
    // apiKey: 'RGAPI-ed53eab6-4dd0-4b4f-9d82-41c356030dd8'
    // cache: lol.redisCache({host: '127.0.0.1', port: 6379})
// });
// lolClient.getChampionById('na', 53, {champData: ['all']}, function(err, data) {
//     console.log("Found ", data.name);
//     lolClient.destroy();
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  var name = 'doublelift';
  var region = 'na';
  lol.init('RGAPI-ed53eab6-4dd0-4b4f-9d82-41c356030dd8', 'na')
  lol.Summoner.getByName(name, region, (err,data) => {
    var id = data[name].id;
    lol.getCurrentGame(id, region, (err1, data1) => {
      // console.log(data1);
      data1.participants.map((x) => {
        console.log(x.summonerName)
      })
    });
  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
