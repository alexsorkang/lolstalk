var express = require('express');
var router = express.Router();
var lol = require('leagueapi');
var twitter = require('twit');
var Crawler = require("js-crawler");
var cheerio = require('cheerio');

router.get('/', (req,res,next) => {
  res.render('index')
})

router.post('/', (req,res,next) => { 

  // twitter 
  var t_consumer_key = 'kjAkJECqGqGgbp8rTjKb3g7t8'
  var t_consumer_secret = 'zgCuZYJXaH4ACLRzJK3gsZFw5S9IrrXEVkQr72sWY09IDSgz8Z'

  var t = new twitter({
    consumer_key: t_consumer_key,
    consumer_secret: t_consumer_secret,
    app_only_auth: true
  });

  var ogname = req.body.sum_name;
  var name = ogname.replace(/\s+/g, '').toLowerCase();
  var region = req.body.region;
  var results = {};

  // new crawler().configure({depth: 1})
  //   .crawl("https://www.instagram.com/bjergsen/", function onSuccess(page) {
  //     // console.log(page.content.getElementsByClass('_79dar'));
  //     // var bod = cheerio.load(page.content);
  //     // if (bod('._79dar')) {
  //       // console.log(bod('._79dar').text())
  //     // }
  //     console.log(page.status)
  //   });

  // webcrawler for instagram window._sharedData = 
  // this will probably need a lot of maintainence
  // var crawler = new Crawler().configure({depth: 1});
  // crawler.crawl({
  //   // url: "https://www.instagram.com/bjergsen/",
  //   // url: "https://www.instagram.com/sdasdasdasdasdasdjefk/",
  //   url: "https://www.instagram.com/yiliangpeng/",
  //   success: function(page) {
  //     // console.log(page.content);
  //     var bod = cheerio.load(page.content);
  //     var str = bod('script').get()[3].children[0].data
  //     var re = /"full_name":\s*(.*)\s*, "has_blocked_viewer":/i;
  //     var thing = str.match(re)
  //     console.log(thing[1])
  //     // 0 3 5
  //     // console.log( bod('script').get()); 
  //   },
  //   failure: function(page) {
  //     console.log(page.url);
  //   }
  // });

  // types
  // 1 - summoner does not exist
  // 2 - summoner exists but not in game
  // 3 - summoner in game
  lol.init('RGAPI-ed53eab6-4dd0-4b4f-9d82-41c356030dd8', region)
  lol.Summoner.getByName(name, region, (err,data) => {
    // error if summoner does not exist
    // still tries to get twitter of that input
    if (err) {
      t.get('users/show', {screen_name: ogname}, (err, data, response) => {
        results[ogname] = data.name;
        res.render('results', { title: 'Express', data: results, type: 2});
      });
    } else {
      var id = data[name].id;
      lol.getCurrentGame(id, region, (err1, data1) => {
        if (!err1) {
          results['100'] = [];
          results['200'] = [];
          var counter = 0
          data1.participants.map((x) => {
            t.get('users/show', {screen_name: x.summonerName}, (err2, data2, response) => {
              lol.Static.getChampionById(x['championId'], {champData: 'image'}, (err3, data3) => {

                var crawler = new Crawler().configure({depth: 1});
                var url = "https://www.instagram.com/" + x.summonerName;
                crawler.crawl({
                  // url: "https://www.instagram.com/bjergsen/",
                  // url: "https://www.instagram.com/sdasdasdasdasdasdjefk/",
                  // url: "https://www.instagram.com/yiliangpeng/",
                  url: url,
                  success: function(page) {
                    // console.log(page.content);
                    var bod = cheerio.load(page.content);
                    var str = bod('script').get()[3].children[0].data
                    var re = /"full_name":\s*(.*)\s*, "has_blocked_viewer":/i;
                    var thing = str.match(re)
                    console.log("found: " + thing[1])
                    console.log(page.url)
                    // 0 3 5
                    // console.log( bod('script').get()); 

                    results[x.teamId].push({summonerName:x.summonerName, realName:[data2.name, thing[1]], championName:data3.name, championId:data3.id, image:data3.image})
                
                    counter+=1;
                    if (counter == 10) {
                      res.render('results', { title: 'Express', data: results, type:1});
                    }

                  },
                  failure: function(page) {
                    // console.log(page.url);
                    console.log("failed")
                    console.log(page.url)
                    results[x.teamId].push({summonerName:x.summonerName, realName:[data2.name], championName:data3.name, championId:data3.id, image:data3.image})
                
                    counter+=1;
                    if (counter == 10) {
                      res.render('results', { title: 'Express', data: results, type:1});
                    }
                  }
                });

                // results[x.teamId].push({summonerName:x.summonerName, realName:data2.name, championName:data3.name, championId:data3.id, image:data3.image})
                
                // counter+=1;
                // if (counter == 10) {
                //   res.render('results', { title: 'Express', data: results, type:1});
                // }
              });
              
            });
          })
          
        // error if user is found but not in a game
        // still finds the data of the user
        } else {
          t.get('users/show', {screen_name: name}, (err, data, response) => {
            results[name] = data.name;
            res.render('results', { title: 'Express', data: results, type:3});
          });
        }
      });
    }
  });
}),
module.exports = router;