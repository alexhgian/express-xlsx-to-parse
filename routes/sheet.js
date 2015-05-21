'use strict';

var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');
var Parse = require('parse').Parse;
var _ = require('underscore');

/* GET users listing. */
Parse.initialize('UnTJ7KjFdK1wNMHkvJBMBAMu4jqh7tog5WZYRJ5c','aT6vbh3DMGGzfxDmcjJH23qsZGts7hop2gTWetFy');
var Mapper = require('./mapper').Mapper(Parse);

// Assoicate Conference Id to all Rows
var Conference = Parse.Object.extend("Conference");
var conference = new Conference();


var fakeRes = {
    sendStatus : function(status) {
        console.log(status);
    }
}

router.post('/api/import', function(req, res, next) {
    var list = [];
    var savePromises = [];
    var file = req.files.file;

    conference.id = req.body.conference || 'yVEOkRMQ5w';
    console.log("ConId"+ conference.id);

    if(file){
        var workbook = XLSX.readFile(file.path);

        _.forEach(workbook.SheetNames, function(sheet_name, key){

            console.log(sheet_name);
            /* Get worksheet */
            var worksheet = workbook.Sheets[sheet_name];
            var jsonSheet = XLSX.utils.sheet_to_json(worksheet);
            var sheetPromise = Mapper(conference, jsonSheet, sheet_name);

            savePromises.push(sheetPromise);

        });// End Sheet Loop


        Parse.Promise.when(savePromises).then(function(){
            console.log("Saves Finished");
            res.sendStatus(200);
        });
    }
    // fileToParse(req, res, next);
});

fileToParse();
function fileToParse(req, res, next){
    res = res || fakeRes;
    if(req){
        conference.id = req.body.conference;
    } else {
        conference.id = 'yVEOkRMQ5w';
    }

    var list = [];
    var promises = [];
    var sheet = [{
        'name' : 'Wellness Matters',
        'speakers' : 'Deepak Chopra, Gary Conkright',
        'description' : 'Being Well in the 33rd century',
        'slideName' : '2eb01cc0-8ebb-451f-855a-52008979a5de/tfss-4f405416-a80b-41a9-bbec-f468a6141666-cat1.jpeg',
        'conference': 'x9e1mtYnwH',
        'session': 'Morning Session One',
        'date':'10/17/1991',
        'startTime':'9:59 AM',
        'endTime':'10:59 AM'
    },{
        'name' : 'Robots Matters',
        'speakers' : 'Gary Conkright',

        'description' : 'Arduino Microcontrollers',
        'slideName' : '2eb01cc0-8ebb-451f-855a-52008979a5de/tfss-4f405416-a80b-41a9-bbec-f468a6141666-cat1.jpeg',
        'conference': 'x9e1mtYnwH',
        'session': 'Morning Session One',
        'date':'11/20/2039',
        'startTime':'9:59 AM',
        'endTime':'10:59 AM'
    }];

    var p1 = Mapper(conference, sheet, 'Event', function(data, err){
        if(err) {return console.log("Error");}
        console.log("Success Saved P1");
        //console.log(data);
    });
    var p2 = Mapper(conference, sheet, 'Event', function(data, err){
        if(err) {return console.log("Error");}
        console.log("Success Saved P2");
        //console.log(data);
    });

    Parse.Promise.when([p1,p2]).then(function(data,err){
        console.log('Finished');
    });

}

router.get('/', function(req, res, next){
    res.render('index',{title:'world'});
});




module.exports = router;
