var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');
var Parse = require('parse').Parse;
var _ = require('underscore');
/* GET users listing. */
Parse.initialize('UnTJ7KjFdK1wNMHkvJBMBAMu4jqh7tog5WZYRJ5c','aT6vbh3DMGGzfxDmcjJH23qsZGts7hop2gTWetFy');

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

    res.render('index',{title:'world'});
});

router.post('/api/import/', function(req, res, next) {

    Parse.initialize('UnTJ7KjFdK1wNMHkvJBMBAMu4jqh7tog5WZYRJ5c','aT6vbh3DMGGzfxDmcjJH23qsZGts7hop2gTWetFy');

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

            // console.log(jsonSheet);
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
                    // console.log(key+" : "+val);
                    if((val.toLowerCase()=='yes') || (val.toLowerCase()=='no')) {
                        console.log("Boolean Detected!");
                        collection.set(lowerFirst(key), (val.toLowerCase()=='yes'));
                    } else if(key.toLowerCase()=='zip') {
                        console.log("Number Detected!");
                        collection.set(lowerFirst(key),parseInt(val));
                    } else {
                        collection.set(lowerFirst(key), val);
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
                    console.log('Failed to create new object, with error code: ');
                    console.log(data);
                }
            });
        });
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

var ParseUtil = {
    setPointer : function(val, collection) {
        var Collect = Parse.Object.extend(collection);
        var collect = new Collect();
        collect.id = val;
        return collect;
    },
    findPerson : function(val, cb){
        var Attendee = Parse.Object.extend('Attendee');
        var query = new Parse.Query(Attendee);

        query.equalTo("name", val);
        return query.find({
            success: function(results) {
                console.log("Successfully retrieved " + results.length + " attendees.");
                // Do something with the returned Parse.Object values
                // for (var i = 0; i < results.length; i++) {
                //     var object = results[i];
                //     console.log(object.id + ' - ' + object.get('name'));
                // }
                cb(ParseUtil.setPointer(results[0].id, 'Attendee'), false);
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                cb(null, error);
            }
        });

    }
}

var EventMap = function(rowData, callback) {
    cb = callback || _.noop; // Optional Callback

    var promises = [];
    // List of simple fields that don't require processing
    var primativeFields = ['name', 'description'];
    // Select the Object to manipulate.
    var Event = Parse.Object.extend('Event');
    var event = new Event();

    // Select the primatives
    var simpleObject = _.pick(rowData, primativeFields);

    // Only loop through primative data types (non-pointer, non-relational, non-files...)
    //Name, Description
    _.forEach(simpleObject, function(val, key){
        event.set(key, val);
    });

    // speakerPtr, TODO: loop through array
    var sPromise = ParseUtil.findPerson('D Chop', function(data, err){
        if(err) { return console.log("Error: " + err); }

        var eventRel = event.relation('speakerPtr');
        eventRel.add(data);

        console.log('Finished relation...');
    });
    promises.push(sPromise); // Add to list of promises


    // For the rest we need to manually set them.
    // Like pointers
    event.set('session', ParseUtil.setPointer(rowData.session, 'Session'));

    Parse.Promise.when(promises).then(function(){
        console.log('Event Promises finished');
        cb(event);
    });

    return Parse.Promise.when(promises);
}

router.get('/test1', function(req, res, next) {
    var list = [];
    var promises = [];
    var sheet = [{
        'name' : 'Wellness Matters',
        'speaker' : ['D Chop'],
        'description' : 'Being Well in the 33rd century',
        'slideName' : 'myslide.pdf',
        'conference': 'x9e1mtYnwH',
        'session': 'bjURosMXyC'
    },{
        'name' : 'Robots Matters',
        'speaker' : ['Alex Gian'],
        'description' : 'Arduino Microcontrollers',
        'slideName' : 'myslide1.pdf',
        'conference': 'x9e1mtYnwH',
        'session': 'bjURosMXyC'
    }];

    _.forEach(sheet, function(val, key){
        var promise = EventMap(val, function(data){
            list.push(data);
        });
        promises.push(promise);
    });



    Parse.Promise.when(promises).then(function(){
        Parse.Object.saveAll(list, {
            success: function(data) {
                // Execute any logic that should take place after the object is saved.
                console.log('Objects [' + data.length + '] saved!');
                res.json(data);
            },
            error: function(data, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                console.log('Failed to create new object, with error code: ');
                console.log(data);
                res.sendStatus(400);
            }
        });
    });

});

function fileToParse(cb){


}

function lowerFirst(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}



module.exports = router;
