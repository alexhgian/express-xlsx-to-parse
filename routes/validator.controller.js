'use strict';

var _ = require('underscore');

var Schema = require('./validator.schema');

//Array for Grammar Validation
var eventTracks = [];
var tracksDict = [];
var eventSpeakers = [];
var speakersDict = [];


module.exports = {
    getSchema: function() {
        return Schema;
    },
    validate: function(data) {
        var hasError = false;
        var sheetObject = {};

        // Get each sheet
        _.each(data, function(val, key) {
            console.log('>>>>>>>>>>>>>>>> ' + key + ' : ' + val.length);

            var sheetMessages = [];

            // Loop through each row
            _.each(val, function(rowVal, rowKey) {


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

            //VALIDATE ALL ARRAYS
            var results = checkGrammar();
            if (results.msg.length > 0) {
                sheetMessages.push(results.msg);
            }
            if (results.err) {
                hasError = true;
            }

            sheetObject[key] = sheetMessages;


        });
        return {
            status: sheetObject,
            err: hasError
        };
    }
};

function findMissingFieldSchema(data, subschema, rowNum) {
    var hasError = false;
    var messageString = [];

    _.each(subschema, function(schemaVal, key) {
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

    _.each(subschema, function(schemaVal, key) {
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
    });

}


function checkGrammar() {

    var checkTrack = false; //checkflags
    var checkSpeaker = false; //checkflags
    var hasError = false;
    var messageString = [];

    //Validate Tracks
    _.each(eventTracks, function(track) {
        _.each(tracksDict, function(t) {
            if (track === t) {
                checkTrack = true;
            }
        });
        if (checkTrack === false) {
            hasError = true;
            messageString.push(track);
        } else {
            checkTrack = false;
        }
    });

    //Validate Names
    _.each(eventSpeakers, function(speakers) {

        //Tokenize Speakers
        var sp = speakers.split(',');
        //Iterate sp remove whitespace
        sp = sp.map(function(s) {
            s.trim()
        });
        //Itereate sp to dictionary
        _.each(sp, function(s) {
            _.each(speakersDict, function(sd) {
                if (s === sd) {
                    checkSpeaker = true;
                }
            });
            if (checkSpeaker === false) {
                hasError = true;
                messageString.push(s);
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
