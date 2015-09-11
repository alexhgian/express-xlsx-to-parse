'use strict';

var _ = require('underscore');

var Schema = require('./validator.schema');

//Array for Grammar Validation
var eventTracks = [];
var eventTalks = [];
var tracksDict = [];
var eventSpeakers = [];
var speakersDict = [];
var sessionTimes = {
    "startTimes" : [],
    "endTimes" : [],
    "rowNum" : []
};
var eventTimes = {
    "startTimes" : [],
    "endTimes" : [],
    "rowNum" : []
};


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
        // GRAMMAR
        var results = checkGrammar();
        var sheetMessages = [];
        if (results.msg.length > 0) {
            sheetMessages.push(results.msg);
        }
        if (results.err) {
            hasError = true;
        }
        sheetObject['Grammar'] = sheetMessages;


        //TIME
        results = checkTime();
        sheetMessages = [];
        if (results.msg.length > 0) {
            sheetMessages.push(results.msg);
        }
        if (results.err) {
            hasError = true;
        }
        sheetObject['Time'] = sheetMessages;

        //SESSION / EVENT - SESSION REFERENCES
        results = checkStructure();
        sheetMessages = [];
        if (results.msg.length > 0) {
            sheetMessages.push(results.msg);
        }
        if (results.err) {
            hasError = true;
        }
        sheetObject['Structure'] = sheetMessages;

        //SESSION / EVENT - TRACK AND TALK REFERENCES
        results = checkTrackTalk();
        sheetMessages = [];
        if (results.msg.length > 0) {
            sheetMessages.push(results.msg);
        }
        if (results.err) {
            hasError = true;
        }
        sheetObject['Duplicate'] = sheetMessages;



        eventTracks = [];
        tracksDict = [];
        eventSpeakers = [];
        speakersDict = [];
        eventTalks = [];
        sessionTimes = {
            "startTimes" : [],
            "endTimes" : [],
            "rowNum" : []
        };
        eventTimes = {
            "startTimes" : [],
            "endTimes" : [],
            "rowNum" : []
        };

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
    var name = '';
    _.each(subschema, function (schemaVal, key) {
        //console.log(key);
        if (data[key]) {
            if (masterKey === 'Session') {
                if (key === 'TrackSessionName') {
                    tracksDict.push(data[key]);
                } else if (key === 'StartTime'){
                    sessionTimes.startTimes.push(data[key]);
                } else if (key === 'EndTime'){
                    sessionTimes.endTimes.push(data[key]);
                    sessionTimes.rowNum.push(rowNum + 2);
                }
            } else if (masterKey === 'Speaker' && key.indexOf('Name')>-1) {
                name = name + ' ' + data[key].trim();
                if(key === "lastName") {
                    speakersDict.push(name);
                    name = '';
                }
            } else if (masterKey === 'Event') {
                if (key === 'TrackSessionName') {
                    eventTracks.push({"word": data[key], "rowNum": rowNum + 2});
                } else if (key === 'Speakers') {
                    eventSpeakers.push({"word": data[key], "rowNum": rowNum + 2});
                } else if (key === 'StartTime'){
                    eventTimes.startTimes.push(data[key]);
                } else if (key === 'EndTime'){
                    eventTimes.endTimes.push(data[key]);
                    eventTimes.rowNum.push(rowNum + 2);
                } else if(key === 'TalkIndividualEvents'){
                    eventTalks.push({"word": data[key], "rowNum": rowNum + 2});
                }
            }
        }
    });

}

function checkTrackTalk(){
    var messageString = [];
    var hasError = false;

    for(var i = 0; i < eventTracks.length; i++){
        if(eventTracks[i].word === eventTalks[i].word){
            hasError = true;
            messageString.push({"word": eventTalks[i].word, "rowNum": eventTracks[j].rowNum});
        }
    }


    return {
        msg: messageString,
        err: hasError
    };

}

function checkStructure(){
    var messageString = [];
    var hasError = false;
    var duplicates = [];

    //Check Tracks Dict for duplicates
    tracksDict.sort();
    //Get Duplicates
    for(var i = 0; i< tracksDict.length-1; i++){
        if(tracksDict[i] === tracksDict[i+1]){
            duplicates.push(tracksDict[i]);
        }
    }
    //Remove duplicates on the duplicates
    duplicates = eliminateDuplicates(duplicates);
    //Check if referenced in Event Tracks
    for(i = 0; i < duplicates.length; i++){
        console.log(duplicates[i]);
        for(var j = 0; j < tracksDict.length; j++){
            if(eventTracks[j].word === duplicates[i]){
                messageString.push({"word": duplicates[i], "rowNum": eventTracks[j].rowNum});
                hasError = true;
            }
        }
    }

    return {
        msg: messageString,
        err: hasError
    };

    //http://stackoverflow.com/questions/840781/easiest-way-to-find-duplicate-values-in-a-javascript-array
    function eliminateDuplicates(a) {
        var temp = {};
        for (var i = 0; i < a.length; i++)
            temp[a[i]] = true;
        var r = [];
        for (var k in temp)
            r.push(k);
        return r;
    }

}

function checkTime(){
    var messageString = [];
    var hasError = false;
    var start, end;

    for(var i = 0; i < eventTimes.startTimes.length ; i++){
            start = new Date(eventTimes.startTimes[i]);
            end = new Date(eventTimes.endTimes[i]);
            if (end.getTime() < start.getTime()){
                hasError = true;
                messageString.push({"rowNum" : eventTimes.rowNum[i], "Sheet": "Event"});
            }
    }

    for(i = 0; i < sessionTimes.startTimes.length ; i++){
            start = new Date(sessionTimes.startTimes[i]);
            end = new Date(sessionTimes.endTimes[i]);
            if (end.getTime() < start.getTime()){
                hasError = true;
                messageString.push({"rowNum" : sessionTimes.rowNum[i], "Sheet": "Session"});
            }
    }

    return {
        msg: messageString,
        err: hasError
    };

}

function checkGrammar() {

    var checkTrack = false; //checkflags
    var checkSpeaker = false; //checkflags
    var hasError = false;
    var messageString = [];

    //Trim ALL
    _.each(eventTracks, function(s){
        s.word = s.word.trim();
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
            if (track.word === t) {
                checkTrack = true;
                console.log('CHECK TRACK  ' + track.word + ' ' + t + ' TRUE');
            }
        });
        if (checkTrack === false) {
            hasError = true;
            console.log('CHECK TRACK  ' + track.word + ' FALSE');
            messageString.push({
                'track': track.word,
                'rowNum': track.rowNum
            });
        } else {
            checkTrack = false;
        }
    });

    //Validate Names
    _.each(eventSpeakers, function (speakers) {

        //Tokenize Speakers
        var sp = speakers.word.split(',');
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
                    messageString.push({
                        'speaker': s,
                        'rowNum': speakers.rowNum
                    });
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
