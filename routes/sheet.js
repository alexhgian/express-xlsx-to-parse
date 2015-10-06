'use strict';

var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');
var Parse = require('parse').Parse;
var _ = require('underscore');

/* GET users listing. */
Parse.initialize('OxZLwjHXEjFjuFExxotUrwvOlxdT2efPN8pv06JI', 'lgIsixYXdeolvd45vb9W3e4obXlAjRJZBSB1kX9L');
var Mapper = require('./mapper').Mapper(Parse);

// Assoicate Conference Id to all Rows
var Conference = Parse.Object.extend("Conference");
var conference = new Conference();


router.post('/api/import', function (req, res, next) {
    var list = [];
    var wbPromises = [];
    var file = req.files.file;
    var type = req.body.import;

    if (!file) {
        return res.sendStatus(400);
    }

    conference.id = req.body.conference || 'yVEOkRMQ5w';
    console.log("ConId" + conference.id);

    var workbook = XLSX.readFile(file.path);


    var worksheet1 = workbook.Sheets['Attendee'];
    var jsonSheet1 = XLSX.utils.sheet_to_json(worksheet1);
    // Check if Sheet is empty
    if (jsonSheet1.length > 0) {
        var p1 = Mapper(conference, jsonSheet1, 'Attendee', function (data, err) {
            if (err) {
                return console.log("Error");
            }
            console.log("Success Saved Attednee");
        });
        wbPromises.push(p1);
    }


    if (type !== 'Attendee') {
        var worksheet2 = workbook.Sheets['Speaker'];
        var jsonSheet2 = XLSX.utils.sheet_to_json(worksheet2);

        // Check if Sheet is empty
        if (jsonSheet2.length > 0) {
            var p2 = Mapper(conference, jsonSheet2, 'Speaker', function (data, err) {
                if (err) {
                    return console.log("Error");
                }
                console.log("Success Saved Speaker");
            });
            wbPromises.push(p2);
        }

        var worksheet3 = workbook.Sheets['Session'];
        var jsonSheet3 = XLSX.utils.sheet_to_json(worksheet3);

        // Check if Sheet is empty
        if (jsonSheet3.length > 0) {
            var p3 = Mapper(conference, jsonSheet3, 'Session', function (data, err) {
                if (err) {
                    return console.log("Error");
                }
                console.log("Success Saved Session");
            });
            wbPromises.push(p3);
        }

        var worksheet4 = workbook.Sheets['Event'];
        var jsonSheet4 = XLSX.utils.sheet_to_json(worksheet4);

        // Check if Sheet is empty
        if (jsonSheet4.length > 0) {
            var p4 = new Parse.Promise();
            Parse.Promise.when([p2, p3]).then(function () {
                Mapper(conference, jsonSheet4, 'Event', function (data, err) {
                    if (err) {
                        p4.reject(err);
                        return console.log("Error");
                    }
                    p4.resolve(err);
                    console.log("Success Saved Event");
                });
            });
            wbPromises.push(p4);
        }


        var worksheet5 = workbook.Sheets['Sponsor'];
        var jsonSheet5 = XLSX.utils.sheet_to_json(worksheet5);

        // Check if Sheet is empty
        if (jsonSheet5.length > 0) {
            var p5 = Mapper(conference, jsonSheet5, 'Sponsor', function (data, err) {
                if (err) {
                    return console.log("Error");
                }
                console.log("Success Saved Sponsor");
            });
            wbPromises.push(p5);
            // Collect the promises
        }

        var worksheet6 = workbook.Sheets['TravelBusiness'];
        var jsonSheet6 = XLSX.utils.sheet_to_json(worksheet6);

        // Check if Sheet is empty
        if (jsonSheet6.length > 0) {
            var p6 = Mapper(conference, jsonSheet6, 'TravelBusiness', function (data, err) {
                if (err) {
                    return console.log("Error");
                }
                console.log("Success Saved Sponsor");
            });
            wbPromises.push(p6);
            // Collect the promises
        }
    }


    Parse.Promise.when(wbPromises).then(function () {
        console.log("Saves Finished");
        console.log(">>>>>>>>>> Generating Discussion Boards...");
        if (type !== 'Attendee') {
            createDiscussionBoards(conference.id, function (error, data) {
                if (error) {
                    res.sendStatus(400);
                } else {
                    res.sendStatus(200);
                }
            });
            populateEventRelationsInSpeakers(function (error, data) {
                if (error) {
                    res.sendStatus(400);
                } else {
                    res.sendStatus(200);
                }
            });
        } else {
            res.sendStatus(200);
        }
    }).fail(function () {
        console.log("One or more attempt to save has failed!");
        res.sendStatus(400);
    });

});

// Placeholder just to show that its working
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'File Upload'
    });
});

/**
 * Creates Discussion Board
 */
function createDiscussionBoards(conId, cb) {
    var Con = Parse.Object.extend('Conference');
    var con = new Con();
    con.id = conId;

    // Create Event object and query
    var Event = Parse.Object.extend("Event");
    var query = new Parse.Query(Event);
    var list = [];

    // Query for events that do not have discussion board.
    query.doesNotExist("board");
    var qPromise = query.find({
        success: function (data) {
            data.forEach(function (val, key) {
                var Board = Parse.Object.extend("DiscussionBoard");
                var board = new Board();
                board.set('conference', con); // Add Conference pointer
                board.set('hasQuestions', false); // Add Conference pointer
                board.set('event', data[key]); // Add Event pointer
                data[key].set('board', board);
            });
            list = data;
        }
    });

    // Wait for promise to resolve
    qPromise.then(function () {
        Parse.Object.saveAll(list, {
            success: function (data) {
                console.log('Number of objects saved: ' + data.length);
                cb(false, data);
            },
            error: function (error) {
                cb(true, error);
            }
        });
    });
}

/**
 * Creates Event Relation Speaker - (Event)
 */

function populateEventRelationsInSpeakers(cb) {

    //query speakers
    var Speaker = Parse.Object.extend("Speaker");
    var querySpeaker = new Parse.Query(Speaker);
    querySpeaker.equalTo('conference', conference);
    var speakerList = [];

    //query events speaker relations
    var Event = Parse.Object.extend("Event");
    var queryEvent = new Parse.Query(Event);
    queryEvent.equalTo('conference', conference);
    var eventList = [];

    querySpeaker.find({
        success: function (results) {
            console.log("Successfully retrieved " + results.length + " speakers.");
            speakerList = results;
        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    }).then(function () {
        return queryEvent.find({
            success: function (results) {
                console.log("Successfully retrieved " + results.length + " events.");
                eventList = results;
            },
            error: function (error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });
    }).then(function () {
        _.each(eventList, function (e) {
            e.relation("speakers").query().find({
                success: function (res) {
                    _.each(res, function (r) {
                        var index = speakerList.indexOf(r.id);
                        if (index > -1) {
                            speakerList[index].relation("event").add(e);
                        }
                    });
                    Parse.Object.saveAll(speakerList, {
                        success: function (data) {
                            console.log('Number of objects saved: ' + data.length);
                            cb(false, data);
                        },
                        error: function (error) {
                            cb(true, error);
                        }
                    });
                },
                error: function (error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            });
        });
    });

}


var Validator = require('./validator.controller');
router.post('/api/validate', function (req, res, next) {
    var file = req.files.file;
    if (!file) {
        return res.sendStatus(400);
    }
    var workbook = XLSX.readFile(file.path);


    var workbookObj = {};
    _.each(workbook.Sheets, function (val, key) {
        var jsonSheet = XLSX.utils.sheet_to_json(val);
        if (jsonSheet.length > 0) {
            workbookObj[key] = jsonSheet;
        }
    });

    var results = Validator.validate(workbookObj);
    res.send(results);
});

module.exports = router;
