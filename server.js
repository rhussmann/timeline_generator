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
const topiclist = new Datastore('topiclist.db');
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
 Yserial = request1.body.Yserial;
 let Zserial = Yserial.split("="); //this splits the id from the right hand side of the youtube address
console.log('Zserial[1] = '+Zserial[1])
var getSubtitles = require('youtube-captions-scraper').getSubtitles;
//const Zserial = Zserial[1];
getSubtitles({
  videoID: Zserial[1], // youtube video id
  lang: 'en' // default: `en`
}).then(function(captions) {
  captions.push(String(Zserial[1]));
   database.insert({captions});
   console.log('in here');
});
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
  console.log('inside the populate topic function');
    let currentRecord = "";
    //currentRecord = request.body.data;
    //console.log('currentRecord ='+ currentRecord);
   // database.remove({ _id: currentRecord }, {}, function (err, numRemoved){
    //console.log('POPULATING THE TOPIC DROP DOWN');
    
      topiclist.find({},(err,data)=>{
        if (err){
          response.end();
          return;
        }else{
      response.send(data);
        console.log('DATA = '+ data)
        }//response = data;
       //database.count({}, function (err, count) {
        //response.end();
        //console.log('Count = '+ database.count );})
      });
  });

 // })
   // });
