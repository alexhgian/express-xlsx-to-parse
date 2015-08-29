'use strict';

var _ = require('underscore');

var Schema = require('./validator.schema');

//Array for Grammar Validation
var eventTracks = [];
var tracksDict = [];
var eventSpeakers = [];
var speakersDict = [];


module.exports = {
    getSchema: function () {
        return Schema;
    },
    validate: function (data) {
        var hasError = false;
        var sheetObject = {};

        // Get each sheet
        _.each(data, function (val, key) {
            console.log('>>>>>>>>>>>>>>>> ' + key + ' : ' + val.length);

            var sheetMessages = [];

            // Loop through each row
            _.each(val, function (rowVal, rowKey) {

                //MISSING FIELDS

                var res = findMissingFieldSchema(rowVal, Schema[key], rowKey);
                if (res.msg.length > 0) {
                    sheetMessages.push(res.msg);
                }
                // Only if a required field is missing
                if (res.err) {
                    hasError = true;
                }

                //CONSTANT GRAMMAR
                getData(key, rowVal, Schema[key], rowKey);

            });

            sheetObject[key] = sheetMessages;
        });


        //VALIDATE ALL ARRAYS
        var results = checkGrammar();
        var sheetMessages = [];
        if (results.msg.length > 0) {
            sheetMessages.push(results.msg);
        }
        if (results.err) {
            hasError = true;
        }

        sheetObject['Grammar'] = sheetMessages;

        eventTracks = [];
        tracksDict = [];
        eventSpeakers = [];
        speakersDict = [];

        return {
            status: sheetObject,
            err: hasError
        };
    }
};

function findMissingFieldSchema(data, subschema, rowNum) {
    var hasError = false;
    var messageString = [];

    _.each(subschema, function (schemaVal, key) {
        var value = data[key];
        // If they have a value
        // console.log('Data: '+value);
        if (!value) {
            if (schemaVal) {
                // Check schema for the required level
                var level = schemaVal.requiredLevel;
                var requiredStatus = {};
                // Check to see the exact level
                if (level) {
                    switch (level) {
                        case 2:
                            console.log('row: [' + rowNum + '] column: [' + key + '] is required!');
                            requiredStatus.rowNum = rowNum + 2;
                            requiredStatus.key = key;
                            requiredStatus.requiredLevel = 2;
                            hasError = true;
                            break;
                        case 1:
                            console.log('row: [' + rowNum + '] column: [' + key + '] is recommended, but not necessary!');
                            requiredStatus.rowNum = rowNum + 2;
                            requiredStatus.key = key;
                            requiredStatus.requiredLevel = 1;
                            break;
                        default:
                            requiredStatus.rowNum = null;
                            requiredStatus.key = null;
                            requiredStatus.requiredLevel = 0;
                            break;
                    }
                    messageString.push(requiredStatus);
                }
            }

        }
    });
    return {
        msg: messageString,
        err: hasError
    };
}


function getData(masterKey, data, subschema, rowNum) {
    _.each(subschema, function (schemaVal, key) {
        //console.log(key);
        if(data[key]) {
            if (masterKey === 'Session' && key === 'Track') {
                tracksDict.push(data[key]);
            } else if (masterKey === 'Speaker' && key === 'Name') {
                speakersDict.push(data[key]);
            } else if (masterKey === 'Event') {
                if (key === 'Track') {
                    eventTracks.push(data[key]);
                } else if (key === 'Speakers') {
                    eventSpeakers.push(data[key]);
                }
            }
        }
    });

}


function checkGrammar() {

    var checkTrack = false; //checkflags
    var checkSpeaker = false; //checkflags
    var hasError = false;
    var messageString = [];

    //Trim ALL
    eventTracks = eventTracks.map(function (s) {
        return s.trim();
    });
    tracksDict = tracksDict.map(function (s) {
        return s.trim();
    });
    speakersDict = speakersDict.map(function (s) {
        return s.trim();
    });

    //Validate Tracks
    _.each(eventTracks, function (track) {
        _.each(tracksDict, function (t) {
            if (track === t) {
                checkTrack = true;
                console.log('CHECK TRACK  ' + track + ' ' + t + ' TRUE');
            }
        });
        if (checkTrack === false) {
            hasError = true;
            console.log('CHECK TRACK  ' + track + ' FALSE');
            messageString.push(track);
        } else {
            checkTrack = false;
        }
    });

    //Validate Names
    _.each(eventSpeakers, function (speakers) {

        //Tokenize Speakers
        var sp = speakers.split(',');
        //Iterate sp remove whitespace
        sp = sp.map(function (s) {
            return s.trim();
        });
        //Itereate sp to dictionary
        _.each(sp, function (s) {
            _.each(speakersDict, function (sd) {
                if (s === sd) {
                    console.log('CHECK SPEAKER  ' + s + ' ' + sd + ' TRUE');
                    checkSpeaker = true;
                }
            });
            if (checkSpeaker === false) {
                hasError = true;
                if (s !== 'N/A') {
                    messageString.push(s);
                }
                console.log('CHECK SPEAKER  ' + s + ' FALSE');
            } else {
                checkSpeaker = false;
            }
        });

    });

    return {
        msg: messageString,
        err: hasError
    };

}
