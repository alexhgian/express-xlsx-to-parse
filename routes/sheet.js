var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');
var Parse = require('parse').Parse;
var _ = require('underscore');
/* GET users listing. */
Parse.initialize('UnTJ7KjFdK1wNMHkvJBMBAMu4jqh7tog5WZYRJ5c','aT6vbh3DMGGzfxDmcjJH23qsZGts7hop2gTWetFy');
// Assoicate Conference Id to all Rows
var Conference = Parse.Object.extend("Conference");
var conference = new Conference();


var fakeRes = {
    sendStatus : function(status) {
        console.log(status);
    }
}



var ParseUtil = {
    setPointer : function(val, collection) {
        var Collect = Parse.Object.extend(collection);
        var collect = new Collect();
        collect.id = val;
        return collect;
    },
    find : function(val, collection, cb){
        var Collection = Parse.Object.extend(collection);
        var query = new Parse.Query(Collection);

        query.equalTo("name", val.trim());
        return query.find({
            success: function(results) {
                console.log("Successfully retrieved " + results.length + " "+collection+"s.");

                if(results[0]){
                    cb(ParseUtil.setPointer(results[0].id, collection), false);
                } else {
                    cb(null,'Invaid ID');
                }

            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                cb(null, error);
            }
        });

    }
}

var Schema = {
    Event : {
        collectionName : 'Event',
        pointer : [{
            name : 'session',
            pointerTo : 'Session'
        }],
        dateTime : ['date', 'startTime', 'endTime'],
        relation:[{
            name : 'speakers',
            pointerTo : 'Attendee'
        }],
        file: ['slideName'],
        primatives: ['description', 'name']
    }
}

var CollectionMapper = function(conference, rowData, schema, callback) {
    cb = callback || _.noop; // Optional Callback
    var promises = [];



    /*************************************
    Select collection
    **************************************/
    var Col = Parse.Object.extend(schema.collectionName);
    var col = new Col();

    col.set('conference', conference);

    /*************************************
    Processing Primative Data
    **************************************/
    var simpleObject = _.pick(rowData, schema.primatives);
    _.forEach(simpleObject, function(val, key){
        col.set(key, val);
    });


    /*************************************
    Processing Relational Data
    **************************************/
    _.forEach(schema.relation, function(rVal, rKey){
        // TODO: Relational Data
        if(rowData[rVal.name]){
            _.forEach((rowData[rVal.name]).split(','), function(val, key){
                var sPromise = ParseUtil.find(val, rVal.pointerTo, function(data, err){
                    if(err) { return err; }
                    var colRel = col.relation(rVal.name);
                    colRel.add(data);
                });
                promises.push(sPromise); // Add to list of promises
            });
        }
    });


    /*************************************
    Select Pointer Data
    **************************************/
    _.forEach(schema.pointer, function(pVal, pKey){
        if(rowData[pVal.name]){
            var sPromise = ParseUtil.find(rowData[pVal.name], pVal.pointerTo, function(data, err){
                if(err) { return err; }
                col.set(pVal.name, ParseUtil.setPointer(data.id, pVal.pointerTo));
            });
            promises.push(sPromise); // Add to list of promises
        }
    });

    /*************************************
    Select File Data
    **************************************/

    _.forEach(schema.file, function(pVal, pKey){

        if(rowData[pVal]){
            console.log("Getting files..." + rowData[pVal]);
            var Uploads = Parse.Object.extend('Uploads');
            var query = new Parse.Query(Uploads);
            query.equalTo("name", rowData[pVal]);
            var sPromise = query.find({
                success: function(results) {
                    console.log("Successfully retrieved " + results.length + " Uploads.");
                    col.set(pVal, results[0].get('file'));
                },
                error: function(error) {
                    console.log('Error getting files!');
                }
            });

            promises.push(sPromise); // Add to list of promises
        }
    });

    /*************************************
    Select Time Data
    **************************************/
    _.forEach(schema.dateTime, function(pVal, pKey){
        if(rowData[pVal]){
            var dt = new Date(rowData[pVal]);
            if(dt.toString()=='Invalid Date'){
                dt = new Date((new Date()).toDateString() + ' ' + rowData[pVal]);
            }
            col.set(pVal, dt);
        }
    });

    /*************************************
    Handle Promises
    **************************************/
    Parse.Promise.when(promises).then(function(){
        console.log(schema.collectionName + ' Promises finished');
        cb(col);
    });

    return Parse.Promise.when(promises);
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
            var promises = [];
            console.log(sheet_name);
            /* Get worksheet */
            var worksheet = workbook.Sheets[sheet_name];
            var jsonSheet = XLSX.utils.sheet_to_json(worksheet);

            _.forEach(jsonSheet, function(row, key){
                console.log(row);

                var tmpInvObj = _.invert(row);
                tmpInvObj = _.mapObject(tmpInvObj, function(val, key){
                    return lowerFirst(val);
                });
                var newRow = _.invert(tmpInvObj);

                var promise = CollectionMapper(conference, newRow, Schema[sheet_name], function(data){
                    list.push(data);
                });
                promises.push(promise);
            });

            Parse.Promise.when(promises).then(function(data){
                console.log('Objects [' + list.length + '] saved!');

                var tmpPromise = Parse.Object.saveAll(list, {
                    success: function(data) {
                        // Execute any logic that should take place after the object is saved.
                        console.log('Objects [' + data.length + '] saved!');
                        //res.json(data);
                        //console.log(data);
                    },
                    error: function(data, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a Parse.Error with an error code and message.
                        console.log('Failed to create new object, with error code: ');
                        console.log(data);

                    }
                });
                savePromises.push(tmpPromise);
            });
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



    _.forEach(sheet, function(row, key){
        var promise = CollectionMapper(conference, row, Schema.Event, function(data){
            list.push(data);
        });
        promises.push(promise);
    });

    Parse.Promise.when(promises).then(function(data){
        console.log('Objects [' + list.length + '] saved!');

        Parse.Object.saveAll(list, {
            success: function(data) {
                // Execute any logic that should take place after the object is saved.
                console.log('Objects [' + data.length + '] saved!');
                //res.json(data);
                //console.log(data);
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

}

router.get('/', function(req, res, next){
    res.render('index',{title:'world'});
});

function lowerFirst(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}



module.exports = router;
