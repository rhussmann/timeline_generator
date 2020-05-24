import request from 'request';
import cheerio from 'cheerio';
import express, { static, json } from 'express';
import cors from 'cors';
//let app = express();
//const app=express().use('*', cors());
const app=express().use('*', "45.76.18.92");
//var cors = require('cors');
app.use(cors());
import Datastore from 'nedb';
app.listen(7000,"45.76.18.92", () =>console.log('listening at 7000'));
app.use(static('public',cors()));
//app.use(express.static('public/data',cors()));
app.use(static('http://127.0.0.1:7000/'+ '/public',cors()));
app.use(json({limit: '1mb'}));
const database = new Datastore('database.db');
database.loadDatabase();

import http from 'http';
import fs from 'graceful-fs';

app.get('/getsubtitles', cors(), (request,response) => {
    console.log('IN HERE!')
    database.find({},(err,data)=>{
      if (err){
        response.end();
        return;
        
      }
    
      response.json(data);
      console.log('IN HERE!')
    });
});


app.post ('/getsubtitles',cors(), (request1,response) =>  {
let Yserial = "";
 Yserial = request1.body.Yserial;
console.log('Yserial = '+Yserial)
var getSubtitles = require('youtube-captions-scraper').getSubtitles;
gPass = getSubtitles;

getSubtitles({
  videoID: Yserial, // youtube video id
  lang: 'en' // default: `en`
}).then(function(captions) {
   // console.log(captions)
    database.insert({captions});
});
   
})
