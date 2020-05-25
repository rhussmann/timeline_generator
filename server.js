const  request  = require('request');
const cheerio = require('cheerio');
const express = require('express');
//var cors = require('cors');
//let app = express();
const app=express();
//var cors = require('cors');
//app.use();
//var Datastore = require('nedb');
const Datastore = require('nedb');
app.listen(7000 , "dev.citynet.net"|"45.76.18.92", () =>console.log('listening at 7000'));
app.use(express.static('public'));
app.use(express.static('public/data'));
app.use(express.static('http://127.0.0.1:7000/'+ '/public'));
app.use(express.json({limit: '10mb'}));
const database = new Datastore(filename : '../database.db');
const topiclist = new Datastore(filename : '../topiclist.db');
topiclist.loadDatabase();
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
let topic = "";
Yserial = request1.body.Yserial;
topic = request1.body.topicsSelect;
 let Zserial = Yserial.split("="); //this splits the id from the right hand side of the youtube address
console.log('Zserial[1] = '+Zserial[1]+' topic = '+topic);
var getSubtitles = require('youtube-captions-scraper').getSubtitles;
//const Zserial = Zserial[1];
getSubtitles({
  videoID: Zserial[1], // youtube video id
  lang: 'en' // default: `en`
}).then(function(captions, topic) {
  captions.push(String(Zserial[1]));
  // database.insert({captions},{topic});
   database.insert({captions});
  // database.insert({topic});
   console.log('in here');
});
response.json('finished grabbing timed text')
})


//below is the function to remove the database totally.  
app.post('/dropdatabase', (request1, response) => {
console.log('DROPPING DATABASE')
  database.remove({ }, { multi: true }, function (err, numRemoved) {
    database.loadDatabase(function (err) {
      // done
    });
  });
})

app.post('/droprecord', (request1, response) => {
  
  let currentRecord = "";
  currentRecord = (request1.body.data);
  console.log('currentRecord ='+currentRecord);
  database.remove({ _id: currentRecord }, {}, function (err, numRemoved){

  console.log('DROPPED RECORD');
})
database.persistence.compactDatafile();
response.json('dropped record');
  });

app.post('/addtopic', (request1,response) =>{
    let currentRecord = "";
    currentRecord = request1.body.Eserial;
    console.log('current Record = '+ currentRecord);
    topiclist.insert({currentRecord}, function (err, currentRecord){
      console.log('ADDED RECORD');
      let data = JSON.stringify(currentRecord);
      response.send(data);
      topiclist.persistence.compactDatafile()
     })
     //return (null, currentRecord);
    
  })

  app.get('/populatetopic', (request,response) => {
  console.log('inside the populate topic function in here to post the video');
    let currentRecord = "";
    currentRecord = request.body.data;
  
    //console.log('currentRecord ='+ currentRecord);
   // database.remove({ _id: currentRecord }, {}, function (err, numRemoved){
    //console.log('POPULATING THE TOPIC DROP DOWN');
    
      topiclist.find({},(err,data)=>{
        if (err){
          response.end();
          return;
        }else{
      response.send(data);
      //  console.log('DATA = '+ data)
        }//response = data;
       //database.count({}, function (err, count) {
        //response.end();
        //console.log('Count = '+ database.count );})
      });
  });

 // })
   // });
