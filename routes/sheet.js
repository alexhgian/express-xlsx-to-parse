'use strict';

var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');
var Parse = require('parse').Parse;
var _ = require('underscore');

/* GET users listing. */
Parse.initialize('341E4A86uPW4m5xKuTy7XvoqjjKgSuEZZ1Me0q5W','VgB990f4aE5ukT0mcu9J4JNzuQ3hevmMwqicHTr6');
// Parse.initialize('olCKrLaKEACbv4YLE1UUjRzVzRbAfYoatW8SH4S6','jCoQ3IDnzNm2qmxD2fsZpfpZhMgREWXWdHAVU5fg');
var Mapper = require('./mapper').Mapper(Parse);

// Assoicate Conference Id to all Rows
var Conference = Parse.Object.extend("Conference");
var conference = new Conference();


router.post('/api/import', function(req, res, next) {
    var list = [];
    var wbPromises = [];
    var file = req.files.file;

    if(!file){ return res.sendRequest(400, "File missing!"); }

    conference.id = req.body.conference || 'yVEOkRMQ5w';
    console.log("ConId"+ conference.id);

    var workbook = XLSX.readFile(file.path);


    var worksheet1 = workbook.Sheets['Attendee'];
    var jsonSheet1 = XLSX.utils.sheet_to_json(worksheet1);
    var p1 = Mapper(conference, jsonSheet1, 'Attendee', function(data, err){
        if(err) {return console.log("Error");}
        console.log("Success Saved Attednee");
    });
    wbPromises.push(p1);


    var worksheet2 = workbook.Sheets['Speaker'];
    var jsonSheet2 = XLSX.utils.sheet_to_json(worksheet2);
    var p2 = Mapper(conference, jsonSheet2, 'Speaker', function(data, err){
        if(err) {return console.log("Error");}
        console.log("Success Saved Speaker");
    });
    wbPromises.push(p2);


    var worksheet3 = workbook.Sheets['Session'];
    var jsonSheet3 = XLSX.utils.sheet_to_json(worksheet3);
    var p3 = Mapper(conference, jsonSheet3, 'Session', function(data, err){
        if(err) {return console.log("Error");}
        console.log("Success Saved Session");
    });
    wbPromises.push(p3);


    var worksheet4 = workbook.Sheets['Event'];
    var jsonSheet4 = XLSX.utils.sheet_to_json(worksheet4);
    var p4 = Parse.Promise.when([p2,p3]).then(function(){
        Mapper(conference, jsonSheet4, 'Event', function(data, err){
            if(err) {return console.log("Error");}
            console.log("Success Saved Event");
        });
    });
    wbPromises.push(p4);


    var worksheet5 = workbook.Sheets['Sponsor'];
    var jsonSheet5 = XLSX.utils.sheet_to_json(worksheet5);
    var p5 = Mapper(conference, jsonSheet5, 'Sponsor', function(data, err){
        if(err) {return console.log("Error");}
        console.log("Success Saved Sponsor");
    });
    wbPromises.push(p5);
    // Collect the promises



    Parse.Promise.when(wbPromises).then(function(){
        console.log("Saves Finished");
        res.sendStatus(200);
    }).fail(function(){
        console.log("One or more attempt to save has failed!");
        res.sendStatus(400);
    });

});

// Placeholder just to show that its working
router.get('/', function(req, res, next){
    res.render('index',{title:'File Upload'});
});


module.exports = router;
