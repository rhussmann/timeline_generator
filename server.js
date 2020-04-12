const  request  = require('request');
const cheerio = require('cheerio');
const express = require('express');
var cors = require('cors');
//let app = express();
const app=express().use('*', cors());
//var cors = require('cors');
app.use(cors());
var Datastore = require('nedb');
app.listen(7000,cors(), () =>console.log('listening at 7000'));
app.use(express.static('public',cors()));
app.use(express.static('public/data',cors()));
app.use(express.static('http://127.0.0.1:7000/'+ '/public',cors()));
app.use(express.json({limit: '10mb'}));
const database = new Datastore('database.db');
const wordStore = new Datastore('wordStore.db');
database.loadDatabase();
var http = require('http');
var fs = require('graceful-fs');
app.get('/getsubtitles', (request,response) => {
    database.find({},(err,data)=>{
      if (err){
        response.end();
        return;
      }
      response.json(data);
     //database.count({}, function (err, count) {
      //response.end();
      //console.log('Count = '+ database.count );})
    });
});
app.post ('/getsubtitles', (request1,response) =>  {
let Yserial = "";
 Yserial = request1.body.Yserial;
 let Zserial = Yserial.split("="); //this splits the id from the right hand side of the youtube address
console.log('Zserial[1] = '+Zserial[1])
var getSubtitles = require('youtube-captions-scraper').getSubtitles(Zserial[1]);
//const Zserial = Zserial[1];
getSubtitles({
  videoID: Zserial[1], // youtube video id
  lang: 'en' // default: `en`
}).then(function(captions) {
  captions.push(String(Zserial[1]));
   database.insert({captions});
   //database.insert({Zserial});
});
})

