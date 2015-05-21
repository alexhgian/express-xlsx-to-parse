var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');
var Parse = require('parse').Parse;
var _ = require('underscore');
/* GET users listing. */
Parse.initialize('UnTJ7KjFdK1wNMHkvJBMBAMu4jqh7tog5WZYRJ5c','aT6vbh3DMGGzfxDmcjJH23qsZGts7hop2gTWetFy');

router.get('/', function(req, res, next){
    res.render('index',{title:'world'});
});

router.post('/api/import/', function(req, res, next) {

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
    find : function(val, collection, cb){
        var Attendee = Parse.Object.extend(collection);
        var query = new Parse.Query(Attendee);

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
        },{
            name : 'attendees',
            pointerTo : 'Attendee'
        }],
        file: ['slideName'],
        primatives: ['description', 'name']
    }
}

var CollectionMapper = function(rowData, schema, callback) {
    cb = callback || _.noop; // Optional Callback
    var promises = [];

    /*************************************
    Select collection
    **************************************/
    var Col = Parse.Object.extend(schema.collectionName);
    var col = new Col();

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
            col.set(pVal.name, ParseUtil.setPointer(rowData[pVal.name], pVal.pointerTo));
        }
    });

    /*************************************
    Select File Data
    **************************************/




    /*************************************
    Select Time Data
    **************************************/


    /*************************************
    Handle Promises
    **************************************/
    Parse.Promise.when(promises).then(function(){
        console.log(schema.collectionName + ' Promises finished');
        cb(col);
    });

    return Parse.Promise.when(promises);
}

router.get('/xlsx', function(req, res, next) {
    fileToParse(req, res, next);
});

fileToParse();
function fileToParse(req, res, next){
    var list = [];
    var promises = [];
    var sheet = [{
        'name' : 'Wellness Matters',
        'speakers' : 'Deepak Chopra, Gary Conkright',
        'attendees' : 'Deepak Chopra, Gary Conkright',
        'description' : 'Being Well in the 33rd century',
        'slideName' : 'myslide.pdf',
        'conference': 'x9e1mtYnwH',
        'session': 'bjURosMXyC',
        'Date':0,
        'StartTime':0,
        'EndTime':0
    },{
        'name' : 'Robots Matters',
        'speakers' : 'Gary Conkright',

        'description' : 'Arduino Microcontrollers',
        'slideName' : 'myslide1.pdf',
        'conference': 'x9e1mtYnwH',
        'session': 'bjURosMXyC',
        'Date':0,
        'StartTime':0,
        'EndTime':0
    }];



    _.forEach(sheet, function(row, key){
        var promise = CollectionMapper(row,Schema.Event, function(data){
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

function lowerFirst(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}



module.exports = router;
