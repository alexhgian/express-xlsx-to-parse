'use strict';
var Schema = require('./schema').Schema;
var _ = require('underscore');

exports.Mapper = function (Parse) {
    var Undupe = require('./undupe').Undupe(Parse);
    // Assoicate Conference Id to all Rows
    var Conference = Parse.Object.extend("Conference");
    var conference = new Conference();


    /*********** Parse Util Begin ************/
    var ParseUtil = {
        setPointer: function (val, collection) {
            var Collect = Parse.Object.extend(collection);
            var collect = new Collect();
            collect.id = val;
            return collect;
        },
        find: function (searchQuery, val, collection, conference, cb) {

            var Collection = Parse.Object.extend(collection);
            var mainQuery = new Parse.Query(Collection);
            mainQuery.equalTo(searchQuery, val.trim());
            mainQuery.equalTo('conference', conference);

            return mainQuery.find({
                success: function (results) {
                    // // console.log("Successfully retrieved " + results.length + " "+collection+"s.");

                    if (results[0]) {
                        cb(ParseUtil.setPointer(results[0].id, collection), false);
                    } else {
                        cb(null, 'Invaid ID');
                    }
                },
                error: function (error) {
                    // // console.log("Error: " + error.code + " " + error.message);
                    cb(null, error);
                }
            });

        }
    };
    /*********** Parse Util End ************/

    /*********** Mock Data      ************/
    var xlsxData = {
        Speaker: [{
            'Name': 'Deepak Chopra',
            'Email': 'Deepak@Chopra.com',
            'Title': 'MDPHDDDRABC',
            'Bio': 'Cool guy',
            'IsContactable': 'yes',
            'Organization': 'Scripps',
            'Experience': 'CEOing',
            'Image': '2eb01cc0-8ebb-451f-855a-52008979a5de/tfss-4f405416-a80b-41a9-bbec-f468a6141666-cat1.jpeg'
        }],
        Event: [{
            'name': 'Wellness Matters',
            'speakers': 'Deepak Chopra, Gary Conkright,Richard J. Boxer',
            'description': 'Being Well in the 33rd century',
            'slideName': '2eb01cc0-8ebb-451f-855a-52008979a5de/tfss-4f405416-a80b-41a9-bbec-f468a6141666-cat1.jpeg',
            'conference': 'x9e1mtYnwH',
            'Track': 'Morning Session I',
            'date': '10/17/1991',
            'startTime': '9:59 AM',
            'endTime': '10:59 AM'
        }]
    };

    var CollectionMapper2 = function (conference, rowData, schema, callback) {
        var cb = callback || _.noop; // Optional Callback
        var promises = [];

        /*************************************
         Select collection
         **************************************/
        var Col = Parse.Object.extend(schema.collectionName);
        var col = new Col();

        col.set('conference', conference);


        // Check schema for default values and set them.
        _.forEach(schema, function (val, key) {
            // // console.log(key + ' : ' + val + ' has default ' + (val.default!=undefined) )
            if (val.default != undefined) {
                // console.log('    > Setting default for ' + key + ' = ' + val.default );
                switch (val.type) {
                    case 'Pointer':
                        console.log('     > Default Pointer Detected in Schema: ' + schema.collectionName);
                        console.log('     >>>>> ' + val.pointerTo);
                        var NewCol = Parse.Object.extend(val.pointerTo);
                        var newCol = new NewCol();
                        console.log(newCol.id);
                        //col.set(val.parseName || key, newCol);
                        break;
                    case 'Boolean':
                    case 'String':
                    case 'Number':
                        col.set(val.parseName || key, val.default);
                        break;
                }

            }
        });

        var spkName = '';
        // Start mapping the rows
        _.forEach(rowData, function (val, key) {
            var field = schema[key];
            if (field) {
                if (field.default) {
                    // console.log('Default Override: ' + field.default);
                } else {
                    switch (field.type || field) {
                        // String and Number
                        case 'String':
                            if (key === 'otherDetails') {
                                val = val.replace(/[\n]+/g, ' ');
                                val = val.replace(/  +/g, ' ');
                                val = val.replace(/a.m./g, 'am');
                                val = val.replace(/p.m./g, 'pm');
                                val = val.replace(/[\.]+/g, '.\n\n');
                                val = val.replace(/[\u2022]+/g, '\n\u2022');
                            }
                            if (key === 'professionalTitle'){
                                val = val.replace(/[\n]+/g, ' ');
                            }
                            if (key === 'bio'){
                                val = val.replace(/[\n]+/g, ' ');
                            }
                            if (key === 'website' || key === 'Website'){
                                if (val && (val.charAt(0)) !== 'h') {
                                    val = 'http://' + val;
                                }
                            }
                            if(key === 'businessType'){
                                val = val.toLowerCase();
                            }
                            if(key.indexOf('Name')>-1){
                                if(key === 'lastName'){
                                    spkName = spkName + val.trim();

                                } else{
                                    spkName = spkName + ' ' + val.trim();
                                }
                                if(key === 'firstName'){
                                    var spkN = spkName.split(' ');
                                    var sp = '';
                                    for(var i = 1; i<spkN.length ; i++){
                                        sp += ' ' + spkN[i];
                                    }
                                    sp += ' ' + spkN[0];
                                    col.set('name', sp.trim());
                                    //HACK
                                    if(spkN.length === 4){
                                        col.set('name', spkN[3] + ' ' + spkN[0] + ' ' + spkN[1] + ' ' + spkN[2]);
                                    }
                                }
                                if(key === 'middleName'){
                                    spkName = spkName.split(' ');
                                    var sp = '';
                                    for(var i = 1; i<spkName.length ; i++){
                                        sp += ' ' + spkName[i];
                                    }
                                    sp += ' ' +spkName[0];
                                    col.set('name', sp.trim());
                                    //HACK
                                    if(spkName.length === 4){
                                        col.set('name', spkName[2] + ' ' + spkName[3] + ' ' + spkName[0] + ' ' + spkName[1]);
                                    }
                                    spkName = '';
                                }
                            }
                            col.set(field.parseName || key, val);
                            break;
                        case 'Number':
                            col.set(field.parseName || key, parseInt(val));
                            // console.log('    > Number or String: ' + val);
                            break;

                        // Handle Boolean
                        case 'Boolean':
                            col.set(field.parseName || key, val.toLowerCase() == 'yes' || val == true || val == 'true');
                            // console.log('    > Boolean');
                            break;


                        // Handle Date
                        case 'Date':
                            var dt = new Date(val);
                            if (dt.toString() == 'Invalid Date') {
                                dt = new Date((new Date()).toDateString() + ' ' + val);
                            }
                            if (dt.toString() != 'Invalid Date') {
                                col.set(field.parseName || key, dt);
                            }
                            // console.log('    > Date');
                            break;


                    /*************************************
                     Handle File
                     **************************************/
                        case 'File':
                            var Uploads = Parse.Object.extend('Uploads');
                            var query = new Parse.Query(Uploads);
                            query.equalTo("name", val);
                            var fPromise = query.find({
                                success: function (results) {
                                    // // console.log("Successfully retrieved " + results.length + " Uploads.");
                                    if (results[0]) {
                                        col.set(field.parseName || key, results[0].get('file'));
                                    }
                                },
                                error: function (error) {
                                    // // console.log('Error getting files!');
                                }
                            });
                            promises.push(fPromise); // Add to list of promises

                            // console.log('    > File')
                            break;


                    /*************************************
                     Pointer Date
                     **************************************/
                        case 'Pointer':
                            var pPromise = ParseUtil.find(field.query || key, val, field.pointerTo, conference, function (data, err) {
                                if (err) {
                                    return err;
                                }
                                col.set(field.parseName || key, ParseUtil.setPointer(data.id, field.pointerTo));
                            });
                            promises.push(pPromise); // Add to list of promises
                            //console.log('    > Pointer')
                            //console.log('    >> key:val:field.query ' + key + ':' + val + ':' + field.query )
                            break;


                    /*************************************
                     Relation Date
                     **************************************/
                        case 'Relation':
                            _.forEach(val.split(','), function (rVal, rKey) {
                                rVal = rVal.trim();
                                var sPromise = ParseUtil.find(field.query || "name", rVal, field.pointerTo, conference, function (data, err) {
                                    if (err) {
                                        return err;
                                    }
                                    var colRel = col.relation(field.parseName || key);
                                    colRel.add(data);
                                });
                                promises.push(sPromise); // Add to list of promises
                            });
                            // console.log('    > Relation')
                            break;
                    }
                }
            }

        });

        /**************************************
         *           Handle Promises           *
         **************************************/
        return Parse.Promise.when(promises).then(function () {
            // // console.log(schema.collectionName + ' Promises finished');
            cb(col, false);
        }).fail(function () {
            cb(null, true);
        });
    };

    return function (conference, jsonSheet, sheetName, cb) {
        var promises = [];
        var list = [];
        var savePromise;
        _.forEach(jsonSheet, function (row, key) {

            // Make every first letter lowercase
            var tmpInvObj = _.invert(row);
            tmpInvObj = _.mapObject(tmpInvObj, function (val, key) {
                return lowerFirst(val);
            });
            var newRow = _.invert(tmpInvObj);

            // Combined first and last name
            if (newRow.firstName && newRow.lastName) {
                newRow.key = (newRow.firstName).trim() + ' ' + (newRow.lastName).trim() + ' ' + conference.id;
                //console.log('FN LS: ' + newRow.name);
            }

            // Combined name or talk and startTime to generate unique key
            // used for Event issue with Openning Remarks and Closing Remarks
            if ((newRow.talkIndividualEvents) && newRow.startTime) {
                newRow.key = (newRow.talkIndividualEvents).trim() + ': ' + (newRow.startTime).trim() + ': ' + conference.id;
                //console.log('FN LS: ' + newRow.name);
            }

            if(newRow.businessName){
                newRow.key = newRow.businessName.trim() + ': ' +  conference.id;
            }

            if(newRow.order && newRow.name && newRow.sponsoring){
                newRow.key = newRow.name + ': ' + conference.id + ': ' + newRow.order;
            }

            if(newRow.moderator && newRow.trackSessionName){
                newRow.key = newRow.trackSessionName + ' ' + newRow.startTime + ' ' +  conference.id;
            }



            // Do work
            var promise = CollectionMapper2(conference, newRow, Schema[sheetName], function (data) {
                list.push(data);
            });
            promises.push(promise);
        });

        return Parse.Promise.when(promises).then(function (data) {

            // var tmp = Parse.Object.saveAll(list, {
            //     success: function(data) {
            //         console.log('     >> '+ sheetName+ ' Objects [' + data.length + '] saved!');
            //         // Execute any logic that should take place after the object is saved.
            //
            //         // // console.log('Objects [' + data.length + '] saved!');
            //         //res.json(data);
            //         //// // console.log(data);
            //         cb(data, false);
            //     },
            //     error: function(data, error) {
            //         // Execute any logic that should take place if the save fails.
            //         // error is a Parse.Error with an error code and message.
            //         console.log('Failed to create new object, with error code: ');
            //         console.log(data);
            //         cb(data, error);
            //
            //     }
            // });
            //
            // return tmp;
            console.log('     > before saving: ' + Schema[sheetName].primaryKey + ' for ' + sheetName);
            return Undupe.saveWithoutDupe(list, Schema[sheetName].primaryKey).then(function (data) {
                console.log('     >> ' + sheetName + ' Objects [' + data.length + '] saved!');
                //console.log('Objects [' + data.length + '] saved!');
                cb(data, false);
            }).fail(function (data) {
                console.log('Failed to create new object, with error code: ');
                cb(data, true);
            });

        });

        //return Parse.Promise.when(promises);
    };
};

function lowerFirst(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}
