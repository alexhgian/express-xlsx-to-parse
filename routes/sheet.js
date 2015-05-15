var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');
var Parse = require('parse').Parse;
var _ = require('underscore');
/* GET users listing. */
router.get('/', function(req, res, next){
    // // if(typeof require !== 'undefined') XLSX = require('xlsx');
    // Parse.initialize('olCKrLaKEACbv4YLE1UUjRzVzRbAfYoatW8SH4S6','jCoQ3IDnzNm2qmxD2fsZpfpZhMgREWXWdHAVU5fg');
    // // Simple syntax to create a new subclass of Parse.Object.
    // var Attendee = Parse.Object.extend("Attendee");
    //
    // // Create a new instance of that class.
    // var attendee = new Attendee();
    // attendee.set("name", 'alex1234');
    // attendee.save(null, {
    //     success: function(gameScore) {
    //         // Execute any logic that should take place after the object is saved.
    //         console.log('New object created with objectId: ' + gameScore.id);
    //     },
    //     error: function(gameScore, error) {
    //         // Execute any logic that should take place if the save fails.
    //         // error is a Parse.Error with an error code and message.
    //         console.log('Failed to create new object, with error code: ' + error.message);
    //     }
    // });

    res.sendStatus(200);
});

router.post('/api/import/', function(req, res, next) {

    Parse.initialize('olCKrLaKEACbv4YLE1UUjRzVzRbAfYoatW8SH4S6','jCoQ3IDnzNm2qmxD2fsZpfpZhMgREWXWdHAVU5fg');

    var file = req.files.file;

    // Assoicate Conference Id to all Rows
    var Conference = Parse.Object.extend("Conference");
    var conference = new Conference();
    conference.id = req.body.conference;

    console.log("ConId"+ conference.id);
    if(file){
        var workbook = XLSX.readFile(file.path);

        _.forEach(workbook.SheetNames, function(sheet_name, key){
            console.log(sheet_name);
            /* Get worksheet */
            var worksheet = workbook.Sheets[sheet_name];
            var jsonSheet = XLSX.utils.sheet_to_json(worksheet);

            console.log(jsonSheet);
            //Simple syntax to create a new subclass of Parse.Object.
            var Collection = Parse.Object.extend(sheet_name);

            var list = [];

            // Loop through rows
            _.forEach(jsonSheet, function(row, key) {
                // Create a new instance of that class.
                var collection = new Collection();
                // Loop throw columns

                collection.set('conference', conference);
                _.forEach(row, function(val, key){
                    console.log(key+" : "+val);
                    if((val.toLowerCase()=='true') || (val.toLowerCase()=='false')) {
                        console.log("Boolean Detected!");
                        collection.set(key, (val.toLowerCase()=='true'));
                    } else {
                        collection.set(key, val);
                    }
                });
                list.push(collection);
            });

            // Save col to row
            Parse.Object.saveAll(list, {
                success: function(data) {
                    // Execute any logic that should take place after the object is saved.
                    console.log('Objects [' + data.length + '] saved!');
                },
                error: function(data, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    console.log('Failed to create new object, with error code: ' + error.message);
                }
            });
        });



        res.sendStatus(200);

    } else {
        res.sendStatus(400);
    }
});





module.exports = router;
