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


router.post('/api/import', function(req, res, next) {
    var list = [];
    var wbPromises = [];
    var file = req.files.file;

    if(!file){ return res.sendRequest(400, "File missing!"); }

    conference.id = req.body.conference || 'yVEOkRMQ5w';
    console.log("ConId"+ conference.id);


    var workbook = XLSX.readFile(file.path);

    _.forEach(workbook.SheetNames, function(sheet_name, key){
        console.log(sheet_name);

        var worksheet = workbook.Sheets[sheet_name];
        var jsonSheet = XLSX.utils.sheet_to_json(worksheet);

        // The magic method
        var sheetPromise = Mapper(conference, jsonSheet, sheet_name, function(data, err){
            if(err) {return console.log("Error");}
            console.log("Success Saved P1");
        });

        // Collect the promises
        wbPromises.push(sheetPromise);

    });// End Sheet Loop

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
